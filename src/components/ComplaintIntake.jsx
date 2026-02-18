import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { classifyRisk, generateCaseNumber, getRiskColor, formatOfficerLevel } from '../utils/helpers'
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

function ComplaintIntake() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    case_type: 'first_time_domestic_harassment',
    victim_age_bracket: '',
    prior_incident_flag: false,
    suspect_relationship: '',
    vulnerability_indicators: [],
    location_type: ''
  })
  const [classification, setClassification] = useState(null)
  const [showOverride, setShowOverride] = useState(false)
  const [overrideData, setOverrideData] = useState({
    new_risk_zone: '',
    new_officer_level: '',
    rationale: ''
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleVulnerabilityToggle = (indicator) => {
    setFormData(prev => ({
      ...prev,
      vulnerability_indicators: prev.vulnerability_indicators.includes(indicator)
        ? prev.vulnerability_indicators.filter(i => i !== indicator)
        : [...prev.vulnerability_indicators, indicator]
    }))
  }

  const handleClassify = (e) => {
    e.preventDefault()
    const result = classifyRisk(formData)
    setClassification(result)
  }

  const handleSubmit = () => {
    const caseNumber = generateCaseNumber()
    const finalData = {
      ...formData,
      case_number: caseNumber,
      ...classification,
      is_pilot_category: formData.case_type === 'first_time_domestic_harassment',
      status: 'registered',
      registration_datetime: new Date().toISOString()
    }

    if (showOverride && overrideData.rationale) {
      finalData.override = overrideData
      finalData.risk_zone = overrideData.new_risk_zone
      finalData.assigned_officer_level = overrideData.new_officer_level
    } else {
      finalData.assigned_officer_level = classification.recommended_officer_level
    }

    // In real app, send to API
    console.log('Submitting case:', finalData)
    
    // Simulate success and redirect
    alert(`Case ${caseNumber} registered successfully!`)
    navigate('/cases')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Complaint Intake</h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete the data capture template. Estimated time: &lt; 5 minutes
          </p>
        </div>

        <form onSubmit={handleClassify} className="px-6 py-5 space-y-6">
          {/* Case Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Case Type</label>
            <select
              name="case_type"
              value={formData.case_type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="first_time_domestic_harassment">First-Time Domestic Harassment (Pilot)</option>
              <option value="repeat_domestic">Repeat Domestic</option>
              <option value="assault">Assault</option>
              <option value="theft">Theft</option>
              <option value="other">Other</option>
            </select>
            {formData.case_type === 'first_time_domestic_harassment' && (
              <p className="mt-1 text-xs text-blue-600">★ This case is part of the pilot evaluation program</p>
            )}
          </div>

          {/* Victim Age Bracket */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Victim Age Bracket</label>
            <select
              name="victim_age_bracket"
              value={formData.victim_age_bracket}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select age bracket</option>
              <option value="under_18">Under 18</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-50">36-50</option>
              <option value="50+">50+</option>
            </select>
          </div>

          {/* Prior Incident Flag */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="prior_incident_flag"
              checked={formData.prior_incident_flag}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Prior Incident Reported
            </label>
          </div>

          {/* Suspect Relationship */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Suspect Relationship</label>
            <select
              name="suspect_relationship"
              value={formData.suspect_relationship}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse</option>
              <option value="partner">Partner</option>
              <option value="family">Family Member</option>
              <option value="acquaintance">Acquaintance</option>
              <option value="stranger">Stranger</option>
            </select>
          </div>

          {/* Vulnerability Indicators */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vulnerability Indicators</label>
            <div className="space-y-2">
              {['financial_dependence', 'children_involved', 'physical_disability', 'mental_health', 'isolated_location', 'language_barrier'].map(indicator => (
                <div key={indicator} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.vulnerability_indicators.includes(indicator)}
                    onChange={() => handleVulnerabilityToggle(indicator)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700 capitalize">
                    {indicator.replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location Type</label>
            <select
              name="location_type"
              value={formData.location_type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select location type</option>
              <option value="residence">Residence</option>
              <option value="workplace">Workplace</option>
              <option value="public">Public Place</option>
              <option value="isolated">Isolated Area</option>
            </select>
          </div>

          {/* Classify Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Classify Risk
            </button>
          </div>
        </form>

        {/* Classification Result */}
        {classification && (
          <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Risk Classification Result</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Risk Zone</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(classification.risk_zone)}`}>
                    {classification.risk_zone.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recommended Officer Level</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatOfficerLevel(classification.recommended_officer_level)}
                  </p>
                </div>
              </div>

              {/* Override Option */}
              {!showOverride ? (
                <button
                  onClick={() => setShowOverride(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Re-score classification (requires rationale)
                </button>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 space-y-3">
                  <div className="flex items-start">
                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                    <p className="text-sm text-yellow-800">
                      Override requires written rationale for audit trail
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Risk Zone</label>
                    <select
                      value={overrideData.new_risk_zone}
                      onChange={(e) => setOverrideData(prev => ({ ...prev, new_risk_zone: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select new risk zone</option>
                      <option value="yellow">Yellow (Low Risk)</option>
                      <option value="orange">Orange (Moderate Risk)</option>
                      <option value="red">Red (High Risk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Officer Level</label>
                    <select
                      value={overrideData.new_officer_level}
                      onChange={(e) => setOverrideData(prev => ({ ...prev, new_officer_level: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select officer level</option>
                      <option value="constable">Constable</option>
                      <option value="head_constable">Head Constable</option>
                      <option value="sub_inspector">Sub Inspector</option>
                      <option value="inspector">Inspector</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rationale (Required)</label>
                    <textarea
                      value={overrideData.rationale}
                      onChange={(e) => setOverrideData(prev => ({ ...prev, rationale: e.target.value }))}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Explain why the system recommendation is being overridden..."
                    />
                  </div>

                  <button
                    onClick={() => setShowOverride(false)}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Cancel override
                  </button>
                </div>
              )}

              {/* Submit Case */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={showOverride && !overrideData.rationale}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Register Case
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComplaintIntake
