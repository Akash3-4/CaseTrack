import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircleIcon, XCircleIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'
import { getRiskColor, formatDate, formatOfficerLevel } from '../utils/helpers'

function SupervisoryReview() {
  const [pendingCases, setPendingCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [reviewForm, setReviewForm] = useState({
    decision: '',
    comments: '',
    requires_changes: false,
    feedback_to_officer: ''
  })
  const [victimFeedback, setVictimFeedback] = useState([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockPendingCases = [
      {
        id: 3,
        case_number: 'CASE-20260217-0056',
        registration_datetime: '2026-02-17T14:20:00',
        case_type: 'assault',
        is_pilot_category: false,
        risk_zone: 'yellow',
        status: 'pending_review',
        assigned_officer: { name: 'Officer Kumar', rank: 'Constable' },
        evidence_count: 3,
        actions_count: 4
      }
    ]
    setPendingCases(mockPendingCases)

    // Mock victim feedback data
    const mockFeedback = [
      {
        id: 1,
        case_number: 'CASE-20260216-0043',
        feedback_datetime: '2026-02-17T10:00:00',
        satisfaction_rating: 4,
        process_clear: true,
        timely_response: true,
        felt_heard: true,
        disputes_conclusion: false,
        processed_by_oversight: false
      },
      {
        id: 2,
        case_number: 'CASE-20260215-0032',
        feedback_datetime: '2026-02-16T15:30:00',
        satisfaction_rating: 2,
        process_clear: false,
        timely_response: false,
        felt_heard: false,
        disputes_conclusion: true,
        dispute_reason: 'Case was closed too quickly without thorough investigation',
        processed_by_oversight: false
      }
    ]
    setVictimFeedback(mockFeedback)
  }, [])

  const handleSelectCase = (caseItem) => {
    setSelectedCase(caseItem)
    setReviewForm({
      decision: '',
      comments: '',
      requires_changes: false,
      feedback_to_officer: ''
    })
  }

  const handleApprove = () => {
    if (!reviewForm.comments) {
      alert('Please provide review comments')
      return
    }

    if (window.confirm('Approve and close this case?')) {
      console.log('Approving case:', selectedCase.id, reviewForm)
      alert('Case approved and closed successfully')
      setSelectedCase(null)
      setPendingCases(prev => prev.filter(c => c.id !== selectedCase.id))
    }
  }

  const handleRequestChanges = () => {
    if (!reviewForm.feedback_to_officer) {
      alert('Please provide feedback to the investigating officer')
      return
    }

    if (window.confirm('Send case back for changes?')) {
      console.log('Requesting changes:', selectedCase.id, reviewForm)
      alert('Case returned to investigating officer with feedback')
      setSelectedCase(null)
      setPendingCases(prev => prev.filter(c => c.id !== selectedCase.id))
    }
  }

  const handleProcessFeedback = (feedbackId) => {
    if (window.confirm('Mark this feedback as processed by oversight unit?')) {
      console.log('Processing feedback:', feedbackId)
      setVictimFeedback(prev => 
        prev.map(f => 
          f.id === feedbackId ? { ...f, processed_by_oversight: true } : f
        )
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Supervisory Review</h2>
        <p className="mt-2 text-sm text-gray-600">
          Review cases and victim feedback with separation of roles
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Pending Cases ({pendingCases.length})
          </button>
          <button
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          >
            Victim Feedback ({victimFeedback.filter(f => !f.processed_by_oversight).length})
          </button>
        </nav>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Cases for Review</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingCases.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No cases pending review</p>
                </div>
              ) : (
                pendingCases.map(caseItem => (
                  <button
                    key={caseItem.id}
                    onClick={() => handleSelectCase(caseItem)}
                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition ${
                      selectedCase?.id === caseItem.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{caseItem.case_number}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {caseItem.assigned_officer.name}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getRiskColor(caseItem.risk_zone)}`}>
                            {caseItem.risk_zone.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Evidence: {caseItem.evidence_count} | Actions: {caseItem.actions_count}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-2">
          {!selectedCase ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <ChatBubbleLeftEllipsisIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-500">
                Select a case from the list to begin review
              </p>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedCase.case_number}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {formatDate(selectedCase.registration_datetime)}
                    </p>
                  </div>
                  <Link
                    to={`/cases/${selectedCase.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View Full Details →
                  </Link>
                </div>
              </div>

              <div className="px-6 py-4 space-y-6">
                {/* Case Summary */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Case Summary</h4>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500">Case Type</dt>
                      <dd className="text-gray-900 font-medium">{selectedCase.case_type.replace(/_/g, ' ')}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Risk Zone</dt>
                      <dd>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getRiskColor(selectedCase.risk_zone)}`}>
                          {selectedCase.risk_zone.toUpperCase()}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Investigating Officer</dt>
                      <dd className="text-gray-900 font-medium">
                        {selectedCase.assigned_officer.name} ({selectedCase.assigned_officer.rank})
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Evidence & Actions</dt>
                      <dd className="text-gray-900 font-medium">
                        {selectedCase.evidence_count} evidence, {selectedCase.actions_count} actions
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Separation Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Separation of Roles:</strong> As a supervisory officer, you were not directly involved in this investigation and can provide independent review.
                  </p>
                </div>

                {/* Review Form */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Review Decision</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Comments (Required)
                      </label>
                      <textarea
                        value={reviewForm.comments}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comments: e.target.value }))}
                        rows={4}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Provide your assessment of the investigation quality, evidence sufficiency, and conclusion..."
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reviewForm.requires_changes}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, requires_changes: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Case requires changes before closure
                      </label>
                    </div>

                    {reviewForm.requires_changes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Feedback to Investigating Officer
                        </label>
                        <textarea
                          value={reviewForm.feedback_to_officer}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, feedback_to_officer: e.target.value }))}
                          rows={3}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="Specify what changes are needed..."
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 flex space-x-3">
                  {reviewForm.requires_changes ? (
                    <button
                      onClick={handleRequestChanges}
                      className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Return for Changes
                    </button>
                  ) : (
                    <button
                      onClick={handleApprove}
                      className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Approve & Close Case
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedCase(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Victim Feedback Section */}
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Victim Feedback</h3>
              <p className="text-sm text-gray-500 mt-1">
                Anonymized feedback for external oversight review
              </p>
            </div>
            <div className="px-6 py-4 space-y-4">
              {victimFeedback.map(feedback => (
                <div
                  key={feedback.id}
                  className={`border rounded-md p-4 ${
                    feedback.disputes_conclusion
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Case: {feedback.case_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted: {formatDate(feedback.feedback_datetime)}
                      </p>
                    </div>
                    {feedback.disputes_conclusion && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        Disputed
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Satisfaction: </span>
                      <span className="font-medium">{feedback.satisfaction_rating}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Process Clear: </span>
                      <span className={feedback.process_clear ? 'text-green-600' : 'text-red-600'}>
                        {feedback.process_clear ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Timely: </span>
                      <span className={feedback.timely_response ? 'text-green-600' : 'text-red-600'}>
                        {feedback.timely_response ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Felt Heard: </span>
                      <span className={feedback.felt_heard ? 'text-green-600' : 'text-red-600'}>
                        {feedback.felt_heard ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {feedback.disputes_conclusion && feedback.dispute_reason && (
                    <div className="mt-3 p-3 bg-white rounded border border-red-200">
                      <p className="text-xs font-medium text-red-900 mb-1">Dispute Reason:</p>
                      <p className="text-sm text-red-800">{feedback.dispute_reason}</p>
                    </div>
                  )}

                  {!feedback.processed_by_oversight && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleProcessFeedback(feedback.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark as Processed by Oversight
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Will be anonymized and deleted after 72 hours per data sharing agreement
                      </p>
                    </div>
                  )}

                  {feedback.processed_by_oversight && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-green-600 font-medium">
                        ✓ Processed by oversight unit
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupervisoryReview
