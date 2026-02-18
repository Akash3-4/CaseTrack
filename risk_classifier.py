"""Risk classification engine for case triage"""
import json


class RiskClassifier:
    """
    Classifies cases into risk zones based on structured intake data.
    Returns risk zone (yellow/orange/red) and recommended officer level.
    """
    
    def __init__(self):
        # Risk scoring weights
        self.age_scores = {
            '18-25': 2,
            '26-35': 1,
            '36-50': 1,
            '50+': 2
        }
        
        self.relationship_scores = {
            'spouse': 3,
            'partner': 3,
            'family': 2,
            'acquaintance': 1,
            'stranger': 1,
            'ex-spouse': 3,
            'ex-partner': 3
        }
        
        self.location_scores = {
            'residence': 2,
            'workplace': 1,
            'public': 1,
            'isolated': 3
        }
        
        # High-risk vulnerability indicators
        self.high_risk_indicators = [
            'minor',
            'elderly',
            'disabled',
            'pregnant',
            'economic_dependency',
            'isolation',
            'threats',
            'weapons_involved'
        ]
        
        # Officer level recommendations by risk zone
        self.officer_recommendations = {
            'yellow': 'constable',
            'orange': 'head_constable',
            'red': 'sub_inspector'
        }
    
    def classify(self, case):
        """
        Classify a case and return risk zone and recommended officer level.
        
        Args:
            case: Case object with intake data
            
        Returns:
            dict with risk_zone and recommended_officer_level
        """
        score = 0
        
        # Age bracket scoring
        if case.victim_age_bracket in self.age_scores:
            score += self.age_scores[case.victim_age_bracket]
        
        # Prior incident flag
        if case.prior_incident_flag:
            score += 3
        
        # Relationship scoring
        if case.suspect_relationship in self.relationship_scores:
            score += self.relationship_scores[case.suspect_relationship]
        
        # Location scoring
        if case.location_type in self.location_scores:
            score += self.location_scores[case.location_type]
        
        # Vulnerability indicators
        if case.vulnerability_indicators:
            try:
                indicators = json.loads(case.vulnerability_indicators)
                for indicator in indicators:
                    if indicator in self.high_risk_indicators:
                        score += 2
            except json.JSONDecodeError:
                pass
        
        # Determine risk zone based on total score
        if score >= 8:
            risk_zone = 'red'
        elif score >= 4:
            risk_zone = 'orange'
        else:
            risk_zone = 'yellow'
        
        return {
            'risk_zone': risk_zone,
            'recommended_officer_level': self.officer_recommendations[risk_zone],
            'score': score
        }
    
    def recalibrate(self, performance_data):
        """
        Recalibrate scoring weights based on performance data.
        Called when dispute rate exceeds threshold after 6 weeks.
        
        Args:
            performance_data: dict with feedback metrics
        """
        # This is a placeholder for the adaptive recalibration logic
        # In production, this would use ML or statistical analysis
        print(f"Recalibrating based on: {performance_data}")
        # Adjust weights based on which categories have higher dispute rates
        pass
