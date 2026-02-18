from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Case, Officer, RiskOverride, EvidenceLog, InvestigationAction, VictimFeedback, SystemMetric
from config import Config
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db.init_app(app)

# Import services
from risk_classifier import RiskClassifier
from utils import generate_case_number, check_supervisory_separation

risk_classifier = RiskClassifier()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})


@app.route('/api/cases', methods=['GET'])
def get_cases():
    """Get all cases with optional filtering"""
    status = request.args.get('status')
    risk_zone = request.args.get('risk_zone')
    is_pilot = request.args.get('is_pilot')
    
    query = Case.query
    
    if status:
        query = query.filter_by(status=status)
    if risk_zone:
        query = query.filter_by(risk_zone=risk_zone)
    if is_pilot:
        query = query.filter_by(is_pilot_category=(is_pilot.lower() == 'true'))
    
    cases = query.order_by(Case.registration_datetime.desc()).all()
    return jsonify([case.to_dict() for case in cases])


@app.route('/api/cases/<int:case_id>', methods=['GET'])
def get_case(case_id):
    """Get specific case details"""
    case = Case.query.get_or_404(case_id)
    
    case_data = case.to_dict()
    case_data['overrides'] = [override.to_dict() for override in case.overrides]
    case_data['evidence'] = [evidence.to_dict() for evidence in case.evidence_logs]
    case_data['actions'] = [action.to_dict() for action in case.actions]
    
    return jsonify(case_data)


@app.route('/api/cases', methods=['POST'])
def register_case():
    """Register a new case with risk classification"""
    data = request.json
    
    # Validate required fields
    required_fields = ['case_type', 'victim_age_bracket', 'suspect_relationship', 'location_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Create case
    case = Case(
        case_number=generate_case_number(),
        case_type=data['case_type'],
        is_pilot_category=(data['case_type'] == Config.PILOT_CASE_TYPE),
        victim_age_bracket=data['victim_age_bracket'],
        prior_incident_flag=data.get('prior_incident_flag', False),
        suspect_relationship=data['suspect_relationship'],
        vulnerability_indicators=json.dumps(data.get('vulnerability_indicators', [])),
        location_type=data['location_type']
    )
    
    # Run risk classification
    classification = risk_classifier.classify(case)
    case.risk_zone = classification['risk_zone']
    case.recommended_officer_level = classification['recommended_officer_level']
    case.assigned_officer_level = classification['recommended_officer_level']
    
    db.session.add(case)
    db.session.commit()
    
    return jsonify(case.to_dict()), 201


@app.route('/api/cases/<int:case_id>/assign', methods=['POST'])
def assign_case(case_id):
    """Assign case to an officer"""
    case = Case.query.get_or_404(case_id)
    data = request.json
    
    officer_id = data.get('officer_id')
    officer = Officer.query.get_or_404(officer_id)
    
    case.assigned_officer_id = officer_id
    case.status = 'under_investigation'
    
    db.session.commit()
    return jsonify(case.to_dict())


@app.route('/api/cases/<int:case_id>/override', methods=['POST'])
def override_classification(case_id):
    """Override risk classification with rationale"""
    case = Case.query.get_or_404(case_id)
    data = request.json
    
    # Validate required fields
    if 'officer_id' not in data or 'rationale' not in data:
        return jsonify({'error': 'officer_id and rationale are required'}), 400
    
    if not data['rationale'] or len(data['rationale'].strip()) < 10:
        return jsonify({'error': 'Rationale must be at least 10 characters'}), 400
    
    # Create override record
    override = RiskOverride(
        case_id=case_id,
        officer_id=data['officer_id'],
        original_risk_zone=case.risk_zone,
        new_risk_zone=data.get('new_risk_zone', case.risk_zone),
        original_officer_level=case.assigned_officer_level,
        new_officer_level=data.get('new_officer_level', case.assigned_officer_level),
        rationale=data['rationale']
    )
    
    # Update case
    if 'new_risk_zone' in data:
        case.risk_zone = data['new_risk_zone']
    if 'new_officer_level' in data:
        case.assigned_officer_level = data['new_officer_level']
    
    db.session.add(override)
    db.session.commit()
    
    return jsonify(override.to_dict()), 201


@app.route('/api/cases/<int:case_id>/evidence', methods=['POST'])
def add_evidence(case_id):
    """Add evidence to a case"""
    case = Case.query.get_or_404(case_id)
    data = request.json
    
    evidence = EvidenceLog(
        case_id=case_id,
        officer_id=data['officer_id'],
        evidence_type=data['evidence_type'],
        description=data['description'],
        file_reference=data.get('file_reference')
    )
    
    db.session.add(evidence)
    db.session.commit()
    
    return jsonify(evidence.to_dict()), 201


@app.route('/api/cases/<int:case_id>/actions', methods=['POST'])
def add_action(case_id):
    """Add investigation action"""
    case = Case.query.get_or_404(case_id)
    data = request.json
    
    action = InvestigationAction(
        case_id=case_id,
        officer_id=data['officer_id'],
        action_type=data['action_type'],
        description=data['description'],
        outcome=data.get('outcome')
    )
    
    db.session.add(action)
    db.session.commit()
    
    return jsonify(action.to_dict()), 201


@app.route('/api/cases/<int:case_id>/submit-for-review', methods=['POST'])
def submit_for_review(case_id):
    """Submit case for supervisory review"""
    case = Case.query.get_or_404(case_id)
    
    if case.status != 'under_investigation':
        return jsonify({'error': 'Case must be under investigation'}), 400
    
    case.status = 'pending_review'
    db.session.commit()
    
    return jsonify(case.to_dict())


@app.route('/api/cases/<int:case_id>/review', methods=['POST'])
def review_case(case_id):
    """Supervisory review and closure"""
    case = Case.query.get_or_404(case_id)
    data = request.json
    
    reviewer_id = data.get('reviewer_id')
    
    # Check supervisory separation
    if not check_supervisory_separation(case.assigned_officer_id, reviewer_id):
        return jsonify({'error': 'Reviewer cannot be the investigating officer'}), 400
    
    case.reviewing_officer_id = reviewer_id
    case.status = data.get('status', 'closed')
    case.closure_datetime = datetime.utcnow()
    
    db.session.commit()
    
    # Schedule victim feedback collection
    feedback_delay = timedelta(days=Config.VICTIM_FEEDBACK_DELAY_DAYS)
    # In production, this would trigger a scheduled task
    
    return jsonify(case.to_dict())


@app.route('/api/cases/<int:case_id>/feedback', methods=['POST'])
def submit_feedback(case_id):
    """Submit victim feedback (anonymized)"""
    case = Case.query.get_or_404(case_id)
    data = request.json
    
    if case.status != 'closed':
        return jsonify({'error': 'Feedback only available for closed cases'}), 400
    
    # Calculate deletion time
    deletion_time = datetime.utcnow() + timedelta(hours=Config.VICTIM_FEEDBACK_RETENTION_HOURS)
    
    feedback = VictimFeedback(
        case_id=case_id,
        deletion_scheduled=deletion_time,
        satisfaction_rating=data.get('satisfaction_rating'),
        process_clear=data.get('process_clear'),
        timely_response=data.get('timely_response'),
        felt_heard=data.get('felt_heard'),
        disputes_conclusion=data.get('disputes_conclusion', False),
        dispute_reason=data.get('dispute_reason'),
        additional_comments=data.get('additional_comments')
    )
    
    db.session.add(feedback)
    db.session.commit()
    
    return jsonify(feedback.to_dict()), 201


@app.route('/api/officers', methods=['GET'])
def get_officers():
    """Get all officers"""
    officers = Officer.query.filter_by(is_active=True).all()
    return jsonify([officer.to_dict() for officer in officers])


@app.route('/api/officers', methods=['POST'])
def create_officer():
    """Create new officer"""
    data = request.json
    
    officer = Officer(
        badge_number=data['badge_number'],
        name=data['name'],
        rank=data['rank'],
        role=data['role']
    )
    
    db.session.add(officer)
    db.session.commit()
    
    return jsonify(officer.to_dict()), 201


@app.route('/api/analytics/dashboard', methods=['GET'])
def get_dashboard():
    """Get dashboard analytics"""
    total_cases = Case.query.count()
    pilot_cases = Case.query.filter_by(is_pilot_category=True).count()
    
    # Cases by status
    cases_by_status = db.session.query(
        Case.status, db.func.count(Case.id)
    ).group_by(Case.status).all()
    
    # Cases by risk zone
    cases_by_risk = db.session.query(
        Case.risk_zone, db.func.count(Case.id)
    ).group_by(Case.risk_zone).all()
    
    # Override rate
    total_overrides = RiskOverride.query.count()
    override_rate = (total_overrides / total_cases * 100) if total_cases > 0 else 0
    
    # Dispute rate (pilot cases only)
    pilot_feedbacks = db.session.query(VictimFeedback).join(Case).filter(
        Case.is_pilot_category == True
    ).all()
    
    disputes = sum(1 for f in pilot_feedbacks if f.disputes_conclusion)
    dispute_rate = (disputes / len(pilot_feedbacks) * 100) if pilot_feedbacks else 0
    
    return jsonify({
        'total_cases': total_cases,
        'pilot_cases': pilot_cases,
        'cases_by_status': dict(cases_by_status),
        'cases_by_risk': dict(cases_by_risk),
        'override_rate': round(override_rate, 2),
        'dispute_rate': round(dispute_rate, 2),
        'total_disputes': disputes
    })


@app.route('/api/analytics/metrics', methods=['GET'])
def get_metrics():
    """Get system performance metrics"""
    metrics = SystemMetric.query.order_by(SystemMetric.metric_date.desc()).limit(100).all()
    return jsonify([metric.to_dict() for metric in metrics])


@app.cli.command()
def init_db():
    """Initialize the database"""
    db.create_all()
    print("Database initialized!")


@app.cli.command()
def seed_db():
    """Seed database with sample data"""
    # Create sample officers
    officers = [
        Officer(badge_number='C001', name='Officer Smith', rank='constable', role='investigator'),
        Officer(badge_number='HC001', name='Head Constable Jones', rank='head_constable', role='both'),
        Officer(badge_number='SI001', name='Sub-Inspector Kumar', rank='sub_inspector', role='supervisor'),
        Officer(badge_number='I001', name='Inspector Patel', rank='inspector', role='supervisor'),
        Officer(badge_number='C002', name='Officer Williams', rank='constable', role='investigator')
    ]
    
    for officer in officers:
        db.session.add(officer)
    
    db.session.commit()
    print("Database seeded with sample officers!")


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
