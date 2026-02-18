import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { getRiskColor, getStatusColor, formatDate, formatOfficerLevel } from '../utils/helpers'

function CaseDetail() {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [newEvidence, setNewEvidence] = useState({ type: '', description: '' })
  const [newAction, setNewAction] = useState({ type: '', description: '', outcome: '' })

  useEffect(() => {
    // Mock case data - in real app, fetch from API
    const mockCase = {
      id: parseInt(caseId),
      case_number: 'CASE-20260218-0001',
      registration_datetime: '2026-02-18T10:30:00',
      case_type: 'first_time_domestic_harassment',
      is_pilot_category: true,
      victim_age_bracket: '26-35',
      prior_incident_flag: true,
      suspect_relationship: 'spouse',
      vulnerability_indicators: ['financial_dependence', 'children_involved'],
      location_type: 'residence',
      risk_zone: 'red',
      recommended_officer_level: 'inspector',
      assigned_officer_level: 'inspector',
      status: 'under_investigation',
      evidence: [
        {
          id: 1,
          upload_datetime: '2026-02-18T11:00:00',
          evidence_type: 'statement',
          description: 'Victim statement recorded',
          officer: { name: 'Officer Sharma', rank: 'Inspector' }
        }
      ],
      actions: [
        {
          id: 1,
          action_datetime: '2026-02-18T12:00:00',
          action_type: 'interview',
          description: 'Initial interview with victim',
          outcome: 'Statement recorded, evidence collected',
          officer: { name: 'Officer Sharma', rank: 'Inspector' }
        }
      ],
      overrides: []
    }
    setCaseData(mockCase)
  }, [caseId])

  const handleAddEvidence = () => {
    if (!newEvidence.type || !newEvidence.description) {
      alert('Please fill in all evidence fields')
      return
    }
    
    // In real app, send to API
    console.log('Adding evidence:', newEvidence)
    alert('Evidence logged successfully')
    setNewEvidence({ type: '', description: '' })
  }

  const handleAddAction = () => {
    if (!newAction.type || !newAction.description) {
      alert('Please fill in all action fields')
      return
    }
    
    // In real app, send to API
    console.log('Adding action:', newAction)
    alert('Action logged successfully')
    setNewAction({ type: '', description: '', outcome: '' })
  }

  const handleUpdateStatus = (newStatus) => {
    if (window.confirm(`Update case status to ${newStatus}?`)) {
      console.log('Updating status to:', newStatus)
      setCaseData(prev => ({ ...prev, status: newStatus }))
    }
  }

  if (!caseData) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/cases')}
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{caseData.case_number}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Registered: {formatDate(caseData.registration_datetime)}
              {caseData.is_pilot_category && (
                <span className="ml-2 text-blue-600 font-medium">★ Pilot Category</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(caseData.risk_zone)}`}>
            {caseData.risk_zone.toUpperCase()} RISK
          </span>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(caseData.status)}`}>
            {caseData.status.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Case Details
          </button>
          <button
            onClick={() => setActiveTab('investigation')}
            className={`${
              activeTab === 'investigation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            Investigation
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`${
              activeTab === 'audit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
            Audit Trail
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Case Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Case Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{caseData.case_type.replace(/_/g, ' ')}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Victim Age Bracket</dt>
              <dd className="mt-1 text-sm text-gray-900">{caseData.victim_age_bracket}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Prior Incident</dt>
              <dd className="mt-1 text-sm text-gray-900">{caseData.prior_incident_flag ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Suspect Relationship</dt>
              <dd className="mt-1 text-sm text-gray-900">{caseData.suspect_relationship}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{caseData.location_type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Assigned Officer Level</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatOfficerLevel(caseData.assigned_officer_level)}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Vulnerability Indicators</dt>
              <dd className="mt-1">
                {caseData.vulnerability_indicators.map(ind => (
                  <span key={ind} className="inline-flex items-center px-2 py-1 mr-2 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                    {ind.replace(/_/g, ' ')}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          {/* Status Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Update Status</h4>
            <div className="flex space-x-2">
              {caseData.status === 'registered' && (
                <button
                  onClick={() => handleUpdateStatus('under_investigation')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Start Investigation
                </button>
              )}
              {caseData.status === 'under_investigation' && (
                <button
                  onClick={() => handleUpdateStatus('pending_review')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                >
                  Submit for Review
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'investigation' && (
        <div className="space-y-6">
          {/* Evidence Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Evidence Log</h3>
            
            {/* Add Evidence */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Evidence
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={newEvidence.type}
                  onChange={(e) => setNewEvidence(prev => ({ ...prev, type: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select evidence type</option>
                  <option value="statement">Statement</option>
                  <option value="document">Document</option>
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                  <option value="physical">Physical Evidence</option>
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={newEvidence.description}
                  onChange={(e) => setNewEvidence(prev => ({ ...prev, description: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <button
                onClick={handleAddEvidence}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Log Evidence
              </button>
            </div>

            {/* Evidence List */}
            <div className="space-y-3">
              {caseData.evidence.map(ev => (
                <div key={ev.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {ev.evidence_type}
                      </span>
                      <p className="mt-2 text-sm text-gray-900">{ev.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(ev.upload_datetime)}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Logged by: {ev.officer.name} ({ev.officer.rank})
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Investigation Actions</h3>
            
            {/* Add Action */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" />
                Log Action
              </h4>
              <div className="space-y-3">
                <select
                  value={newAction.type}
                  onChange={(e) => setNewAction(prev => ({ ...prev, type: e.target.value }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select action type</option>
                  <option value="interview">Interview</option>
                  <option value="site_visit">Site Visit</option>
                  <option value="coordination">Coordination</option>
                  <option value="follow_up">Follow-up</option>
                </select>
                <textarea
                  placeholder="Description"
                  value={newAction.description}
                  onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <textarea
                  placeholder="Outcome (optional)"
                  value={newAction.outcome}
                  onChange={(e) => setNewAction(prev => ({ ...prev, outcome: e.target.value }))}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <button
                onClick={handleAddAction}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Log Action
              </button>
            </div>

            {/* Actions List */}
            <div className="space-y-3">
              {caseData.actions.map(action => (
                <div key={action.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        {action.action_type.replace(/_/g, ' ')}
                      </span>
                      <p className="mt-2 text-sm text-gray-900 font-medium">{action.description}</p>
                      {action.outcome && (
                        <p className="mt-1 text-sm text-gray-600">Outcome: {action.outcome}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(action.action_datetime)}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    By: {action.officer.name} ({action.officer.rank})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Audit Trail</h3>
          
          {caseData.overrides.length === 0 ? (
            <p className="text-sm text-gray-500">No classification overrides recorded for this case.</p>
          ) : (
            <div className="space-y-3">
              {caseData.overrides.map(override => (
                <div key={override.id} className="border border-yellow-200 bg-yellow-50 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">Risk Classification Override</span>
                    <span className="text-xs text-gray-500">{formatDate(override.timestamp)}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-gray-600">Risk Zone:</span>{' '}
                      <span className="font-medium">{override.original_risk_zone}</span> → <span className="font-medium">{override.new_risk_zone}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Officer Level:</span>{' '}
                      <span className="font-medium">{formatOfficerLevel(override.original_officer_level)}</span> → <span className="font-medium">{formatOfficerLevel(override.new_officer_level)}</span>
                    </p>
                    <p className="mt-2">
                      <span className="text-gray-600">Rationale:</span>{' '}
                      <span className="text-gray-900">{override.rationale}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      By: {override.officer.name} ({override.officer.rank})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CaseDetail
