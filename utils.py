"""Utility functions for the CaseTrack system"""
from datetime import datetime


def generate_case_number():
    """Generate unique case number with format: CT-YYYY-NNNNNN"""
    timestamp = datetime.utcnow()
    year = timestamp.year
    # In production, this would query database for last case number and increment
    # For now, using timestamp-based approach
    sequence = int(timestamp.timestamp() * 1000) % 1000000
    return f"CT-{year}-{sequence:06d}"


def check_supervisory_separation(investigating_officer_id, reviewing_officer_id):
    """
    Ensure supervisory separation: reviewer cannot be the investigating officer.
    
    Args:
        investigating_officer_id: ID of officer who investigated
        reviewing_officer_id: ID of officer reviewing
        
    Returns:
        bool: True if separation is maintained, False otherwise
    """
    if investigating_officer_id is None or reviewing_officer_id is None:
        return True
    
    return investigating_officer_id != reviewing_officer_id


def calculate_input_time(start_time, end_time):
    """Calculate time taken for data input in minutes"""
    delta = end_time - start_time
    return delta.total_seconds() / 60


def format_risk_zone_display(risk_zone):
    """Format risk zone for display"""
    colors = {
        'yellow': {'name': 'Low Risk', 'color': '#FFC107'},
        'orange': {'name': 'Moderate Risk', 'color': '#FF9800'},
        'red': {'name': 'High Risk', 'color': '#F44336'}
    }
    return colors.get(risk_zone, {'name': 'Unknown', 'color': '#9E9E9E'})


def anonymize_feedback(feedback_data):
    """
    Anonymize feedback data before sharing with oversight.
    Removes any potentially identifying information.
    
    Args:
        feedback_data: dict with feedback information
        
    Returns:
        dict: Anonymized feedback data
    """
    # Remove case-specific identifiers, keep only aggregate-relevant fields
    anonymized = {
        'satisfaction_rating': feedback_data.get('satisfaction_rating'),
        'process_clear': feedback_data.get('process_clear'),
        'timely_response': feedback_data.get('timely_response'),
        'felt_heard': feedback_data.get('felt_heard'),
        'disputes_conclusion': feedback_data.get('disputes_conclusion'),
        'week_of_year': datetime.utcnow().isocalendar()[1]  # Week number for temporal grouping
    }
    return anonymized


def check_system_health(metrics):
    """
    Check if system is meeting performance targets.
    
    Args:
        metrics: dict with current system metrics
        
    Returns:
        dict: Health status with warnings
    """
    health = {
        'status': 'healthy',
        'warnings': []
    }
    
    # Check dispute rate (target: reduction over 6 weeks)
    if metrics.get('dispute_rate', 0) > 15:
        health['warnings'].append('Dispute rate exceeds 15% - consider recalibration')
        health['status'] = 'warning'
    
    # Check average input time (target: under 5 minutes)
    if metrics.get('avg_input_time', 0) > 5:
        health['warnings'].append('Average input time exceeds 5 minutes - simplify data fields')
        health['status'] = 'warning'
    
    # Check override rate (monitor for gaming)
    if metrics.get('override_rate', 0) > 30:
        health['warnings'].append('High override rate - review classification accuracy')
        health['status'] = 'warning'
    
    return health
