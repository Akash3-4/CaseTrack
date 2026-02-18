import os
from datetime import timedelta

class Config:
    """Application configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///casetrack.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # System constraints
    MAX_INPUT_TIME_MINUTES = 5
    PILOT_CASE_TYPE = 'first_time_domestic_harassment'
    OUTCOME_REVIEW_WEEKS = 6
    
    # Risk zones
    RISK_ZONES = {
        'yellow': {'name': 'Low Risk', 'color': '#FFC107'},
        'orange': {'name': 'Moderate Risk', 'color': '#FF9800'},
        'red': {'name': 'High Risk', 'color': '#F44336'}
    }
    
    # Officer levels
    OFFICER_LEVELS = ['constable', 'head_constable', 'sub_inspector', 'inspector']
    
    # Victim feedback settings
    VICTIM_FEEDBACK_RETENTION_HOURS = int(os.getenv('VICTIM_FEEDBACK_RETENTION_HOURS', '72'))
    VICTIM_FEEDBACK_DELAY_DAYS = 7
    
    # Audit settings
    REQUIRE_OVERRIDE_RATIONALE = True
    SUPERVISORY_SEPARATION_REQUIRED = True
