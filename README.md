# CaseTrack - Decision-Support and Accountability System

A focused decision-support and accountability system that classifies incoming complaints at the station level into structured risk zones, ensuring transparent processes, supervisory oversight, and victim-centered feedback mechanisms.

## 🎯 Project Goals

- **Risk Classification**: Automated risk assessment grouping cases into yellow (low), orange (moderate), or red (high risk)
- **Decision Support**: Recommend appropriate officer levels while maintaining senior officer decision authority
- **Accountability**: Transparent audit trails for all classification overrides
- **Pilot Evaluation**: Focused outcome measurement on first-time domestic harassment cases
- **Time Efficiency**: Keep additional input time under 5 minutes
- **Victim Feedback**: Anonymous feedback collection with 72-hour retention policy
- **Adaptive System**: Built-in failure modes to recalibrate based on performance

## 🏗️ System Architecture

### Frontend (React)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Heroicons

### Backend (Flask - Optional)
- **Framework**: Flask
- **Database**: SQLAlchemy with SQLite
- **API**: RESTful endpoints

## 📁 Project Structure

```
CaseTrack/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # System overview and metrics
│   │   ├── ComplaintIntake.jsx    # One-page data capture form
│   │   ├── CasesList.jsx          # Case browsing and filtering
│   │   ├── CaseDetail.jsx         # Investigation tracking
│   │   └── SupervisoryReview.jsx  # Review workflow
│   ├── utils/
│   │   └── helpers.js             # Risk classification engine
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles
├── models.py                      # Database models (optional backend)
├── config.py                      # System configuration
└── package.json                   # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- (Optional) Python 3.9+ for backend API

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akash3-4/CaseTrack.git
   cd CaseTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser to `http://localhost:3000`

### Optional: Backend Setup

If you want to use the Flask backend:

1. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the backend**
   ```bash
   python app.py
   ```

## 📋 Key Features

### 1. **Complaint Intake** (`/intake`)
- One-page data capture template
- Fields: victim age bracket, prior incident flag, suspect relationship, vulnerability indicators, location type
- Real-time risk classification
- Override mechanism with mandatory rationale
- Time-optimized for <5 minute completion

### 2. **Risk Classification Engine**
Automatically scores cases based on:
- Victim age bracket
- Prior incident history
- Suspect relationship type
- Vulnerability indicators (financial dependence, children involved, disabilities, etc.)
- Location type

**Classification Zones:**
- 🟡 **Yellow**: Low risk → Constable
- 🟠 **Orange**: Moderate risk → Sub Inspector
- 🔴 **Red**: High risk → Inspector

### 3. **Investigation Tracking** (`/cases/:id`)
- Evidence upload with structured templates
- Action logging (interviews, site visits, coordination, follow-ups)
- Aligned with existing reporting formats
- Status progression: Registered → Under Investigation → Pending Review → Closed

### 4. **Supervisory Review** (`/review`)
- **Separation of roles**: Reviewers cannot be involved in investigation
- Independent case assessment
- Approve or request changes workflow
- Feedback mechanism to investigating officers

### 5. **Victim Feedback System**
- Anonymous feedback collection
- Fixed time gap after case closure
- 72-hour automatic deletion policy
- Dispute mechanism with limited window
- Routed to external oversight unit
- Monthly summary reporting

### 6. **Audit Trail** (Built-in)
- Track all classification overrides
- Required written rationale for changes
- Officer identity and timestamp logging
- Transparent accountability system

### 7. **Performance Dashboard** (`/`)
- Total cases overview
- High-risk case tracking
- Pilot category monitoring
- Average input time metrics
- Dispute rate analysis
- System alerts for thresholds

## 🎯 Pilot Evaluation

The system focuses outcome measurement on **first-time domestic harassment cases** while applying classification to all case types.

**Success Metrics:**
- Reduction in closure disputes within 6 weeks
- Officer workload under 5-minute threshold
- Classification accuracy
- Supervisory review efficiency

**Failure Modes:**
- If no reduction in disputes: Intensify supervisory audits and recalibrate classification rules
- If workload exceeds 5 minutes: Reduce or merge data fields
- Adaptive recalibration based on operational feedback

## 🔐 Data Privacy & Security

- **Victim feedback**: Anonymous data collection
- **72-hour retention**: Automatic deletion after oversight review
- **Data sharing agreement**: Formal protocols with external oversight unit
- **Access control**: Role-based permissions (investigators vs supervisors)
- **Audit logging**: Complete trail of all system actions

## 🛠️ Configuration

Key settings in `config.py`:

```python
MAX_INPUT_TIME_MINUTES = 5              # Input time threshold
PILOT_CASE_TYPE = 'first_time_domestic_harassment'
OUTCOME_REVIEW_WEEKS = 6                # Pilot evaluation period
VICTIM_FEEDBACK_RETENTION_HOURS = 72    # Auto-deletion window
REQUIRE_OVERRIDE_RATIONALE = True       # Enforce audit trail
SUPERVISORY_SEPARATION_REQUIRED = True  # Role separation
```

## 📊 Risk Scoring Algorithm

The classification engine uses weighted scoring:

| Factor | Risk Contribution |
|--------|------------------|
| Under 18 or 50+ age | +3 points |
| Prior incident flag | +3 points |
| Spouse/Partner relationship | +3 points |
| Each vulnerability indicator | +2 points |
| Isolated/Residence location | +2-3 points |

**Thresholds:**
- Score ≥ 10: Red (High Risk)
- Score 5-9: Orange (Moderate Risk)
- Score < 5: Yellow (Low Risk)

## 🧪 Testing the Pilot

To test with 5 officers as mentioned in the goal:

1. Create officer profiles in the system
2. Register test cases across all risk zones
3. Track input time per case
4. Monitor override rationale quality
5. Collect feedback after 6-week period
6. Evaluate dispute reduction metrics

## 📈 Future Enhancements

- Mobile app for field officers
- Integration with existing station management systems
- Advanced analytics and predictive modeling
- Multi-language support
- Bulk case import/export
- SMS notifications for case updates
- Real-time dashboard for station commanders

## 🤝 Contributing

This is a prototype system designed for pilot testing. Feedback and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is designed for law enforcement and public safety applications. Please ensure compliance with local data protection regulations and institutional policies.

## 📞 Support

For questions or issues:
- Create an issue in the GitHub repository
- Contact the development team

---

**Built with focus on transparency, accountability, and victim-centered justice.**