from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Case(db.Model):
    """Main case/complaint record"""
    __tablename__ = 'cases'
    
    id = db.Column(db.Integer, primary_key=True)
    case_number = db.Column(db.String(50), unique=True, nullable=False)
    registration_datetime = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Case classification
    case_type = db.Column(db.String(100), nullable=False)
    is_pilot_category = db.Column(db.Boolean, default=False)
    
    # Intake data fields
    victim_age_bracket = db.Column(db.String(20))  # e.g., '18-25', '26-35', '36-50', '50+'
    prior_incident_flag = db.Column(db.Boolean, default=False)
    suspect_relationship = db.Column(db.String(100))  # e.g., 'spouse', 'partner', 'family', 'acquaintance', 'stranger'
    vulnerability_indicators = db.Column(db.Text)  # JSON array of indicators
    location_type = db.Column(db.String(100))  # e.g., 'residence', 'public', 'workplace'
    
    # Risk classification
    risk_zone = db.Column(db.String(20))  # 'yellow', 'orange', 'red'
    recommended_officer_level = db.Column(db.String(50))
    assigned_officer_level = db.Column(db.String(50))
    
    # Assignment
    assigned_officer_id = db.Column(db.Integer, db.ForeignKey('officers.id'))
    assigned_officer = db.relationship('Officer', foreign_keys=[assigned_officer_id], backref='assigned_cases')
    
    # Status tracking
    status = db.Column(db.String(50), default='registered')  # registered, under_investigation, pending_review, closed
    closure_datetime = db.Column(db.DateTime)
    
    # Review
    reviewing_officer_id = db.Column(db.Integer, db.ForeignKey('officers.id'))
    reviewing_officer = db.relationship('Officer', foreign_keys=[reviewing_officer_id])
    
    # Relationships
    overrides = db.relationship('RiskOverride', backref='case', lazy=True, cascade='all, delete-orphan')
    evidence_logs = db.relationship('EvidenceLog', backref='case', lazy=True, cascade='all, delete-orphan')
    actions = db.relationship('InvestigationAction', backref='case', lazy=True, cascade='all, delete-orphan')
    feedbacks = db.relationship('VictimFeedback', backref='case', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'case_number': self.case_number,
            'registration_datetime': self.registration_datetime.isoformat() if self.registration_datetime else None,
            'case_type': self.case_type,
            'is_pilot_category': self.is_pilot_category,
            'victim_age_bracket': self.victim_age_bracket,
            'prior_incident_flag': self.prior_incident_flag,
            'suspect_relationship': self.suspect_relationship,
            'vulnerability_indicators': json.loads(self.vulnerability_indicators) if self.vulnerability_indicators else [],
            'location_type': self.location_type,
            'risk_zone': self.risk_zone,
            'recommended_officer_level': self.recommended_officer_level,
            'assigned_officer_level': self.assigned_officer_level,
            'status': self.status,
            'closure_datetime': self.closure_datetime.isoformat() if self.closure_datetime else None
        }


class Officer(db.Model):
    """Officer/Staff record"""
    __tablename__ = 'officers'
    
    id = db.Column(db.Integer, primary_key=True)
    badge_number = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    rank = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(50))  # 'investigator', 'supervisor', 'both'
    is_active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'badge_number': self.badge_number,
            'name': self.name,
            'rank': self.rank,
            'role': self.role,
            'is_active': self.is_active
        }


class RiskOverride(db.Model):
    """Records when officers override risk classification"""
    __tablename__ = 'risk_overrides'
    
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('cases.id'), nullable=False)
    officer_id = db.Column(db.Integer, db.ForeignKey('officers.id'), nullable=False)
    officer = db.relationship('Officer')
    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    original_risk_zone = db.Column(db.String(20))
    new_risk_zone = db.Column(db.String(20))
    original_officer_level = db.Column(db.String(50))
    new_officer_level = db.Column(db.String(50))
    rationale = db.Column(db.Text, nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'case_id': self.case_id,
            'officer': self.officer.to_dict() if self.officer else None,
            'timestamp': self.timestamp.isoformat(),
            'original_risk_zone': self.original_risk_zone,
            'new_risk_zone': self.new_risk_zone,
            'original_officer_level': self.original_officer_level,
            'new_officer_level': self.new_officer_level,
            'rationale': self.rationale
        }


class EvidenceLog(db.Model):
    """Evidence uploaded during investigation"""
    __tablename__ = 'evidence_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('cases.id'), nullable=False)
    officer_id = db.Column(db.Integer, db.ForeignKey('officers.id'), nullable=False)
    officer = db.relationship('Officer')
    
    upload_datetime = db.Column(db.DateTime, default=datetime.utcnow)
    evidence_type = db.Column(db.String(100))  # 'statement', 'document', 'photo', 'video', 'physical'
    description = db.Column(db.Text)
    file_reference = db.Column(db.String(500))  # Path or reference to stored file
    
    def to_dict(self):
        return {
            'id': self.id,
            'case_id': self.case_id,
            'officer': self.officer.to_dict() if self.officer else None,
            'upload_datetime': self.upload_datetime.isoformat(),
            'evidence_type': self.evidence_type,
            'description': self.description
        }


class InvestigationAction(db.Model):
    """Actions taken during investigation"""
    __tablename__ = 'investigation_actions'
    
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('cases.id'), nullable=False)
    officer_id = db.Column(db.Integer, db.ForeignKey('officers.id'), nullable=False)
    officer = db.relationship('Officer')
    
    action_datetime = db.Column(db.DateTime, default=datetime.utcnow)
    action_type = db.Column(db.String(100))  # 'interview', 'site_visit', 'coordination', 'follow_up'
    description = db.Column(db.Text, nullable=False)
    outcome = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'case_id': self.case_id,
            'officer': self.officer.to_dict() if self.officer else None,
            'action_datetime': self.action_datetime.isoformat(),
            'action_type': self.action_type,
            'description': self.description,
            'outcome': self.outcome
        }


class VictimFeedback(db.Model):
    """Victim feedback collected after case closure"""
    __tablename__ = 'victim_feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('cases.id'), nullable=False)
    
    feedback_datetime = db.Column(db.DateTime, default=datetime.utcnow)
    deletion_scheduled = db.Column(db.DateTime)  # Auto-delete after 72 hours
    is_deleted = db.Column(db.Boolean, default=False)
    
    # Anonymized feedback
    satisfaction_rating = db.Column(db.Integer)  # 1-5 scale
    process_clear = db.Column(db.Boolean)
    timely_response = db.Column(db.Boolean)
    felt_heard = db.Column(db.Boolean)
    disputes_conclusion = db.Column(db.Boolean, default=False)
    dispute_reason = db.Column(db.Text)
    additional_comments = db.Column(db.Text)
    
    # Anonymization flag for oversight
    processed_by_oversight = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        if self.is_deleted:
            return {'message': 'Feedback deleted per retention policy'}
        return {
            'id': self.id,
            'case_id': self.case_id,
            'feedback_datetime': self.feedback_datetime.isoformat(),
            'satisfaction_rating': self.satisfaction_rating,
            'process_clear': self.process_clear,
            'timely_response': self.timely_response,
            'felt_heard': self.felt_heard,
            'disputes_conclusion': self.disputes_conclusion,
            'dispute_reason': self.dispute_reason if self.disputes_conclusion else None
        }


class SystemMetric(db.Model):
    """Track system performance metrics"""
    __tablename__ = 'system_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    metric_date = db.Column(db.Date, default=datetime.utcnow)
    metric_name = db.Column(db.String(100))
    metric_value = db.Column(db.Float)
    metadata = db.Column(db.Text)  # JSON for additional context
    
    def to_dict(self):
        return {
            'id': self.id,
            'metric_date': self.metric_date.isoformat(),
            'metric_name': self.metric_name,
            'metric_value': self.metric_value,
            'metadata': json.loads(self.metadata) if self.metadata else {}
        }
