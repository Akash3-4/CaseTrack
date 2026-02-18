// Risk classification engine
export const classifyRisk = (caseData) => {
  let riskScore = 0
  
  // Age bracket scoring
  const ageRiskMap = {
    '18-25': 2,
    '26-35': 1,
    '36-50': 1,
    '50+': 2,
    'under_18': 3
  }
  riskScore += ageRiskMap[caseData.victim_age_bracket] || 0
  
  // Prior incident flag
  if (caseData.prior_incident_flag) {
    riskScore += 3
  }
  
  // Suspect relationship
  const relationshipRiskMap = {
    'spouse': 3,
    'partner': 3,
    'family': 2,
    'acquaintance': 1,
    'stranger': 2
  }
  riskScore += relationshipRiskMap[caseData.suspect_relationship] || 0
  
  // Vulnerability indicators
  const vulnerabilities = caseData.vulnerability_indicators || []
  riskScore += vulnerabilities.length * 2
  
  // Location type
  const locationRiskMap = {
    'residence': 2,
    'workplace': 1,
    'public': 1,
    'isolated': 3
  }
  riskScore += locationRiskMap[caseData.location_type] || 0
  
  // Determine risk zone based on score
  let riskZone = 'yellow'
  let recommendedOfficerLevel = 'constable'
  
  if (riskScore >= 10) {
    riskZone = 'red'
    recommendedOfficerLevel = 'inspector'
  } else if (riskScore >= 5) {
    riskZone = 'orange'
    recommendedOfficerLevel = 'sub_inspector'
  }
  
  return {
    risk_zone: riskZone,
    recommended_officer_level: recommendedOfficerLevel,
    risk_score: riskScore
  }
}

// Generate case number
export const generateCaseNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `CASE-${year}${month}${day}-${random}`
}

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get risk zone color
export const getRiskColor = (zone) => {
  const colors = {
    'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'orange': 'bg-orange-100 text-orange-800 border-orange-300',
    'red': 'bg-red-100 text-red-800 border-red-300'
  }
  return colors[zone] || 'bg-gray-100 text-gray-800 border-gray-300'
}

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    'registered': 'bg-blue-100 text-blue-800',
    'under_investigation': 'bg-purple-100 text-purple-800',
    'pending_review': 'bg-yellow-100 text-yellow-800',
    'closed': 'bg-green-100 text-green-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Format officer level
export const formatOfficerLevel = (level) => {
  const labels = {
    'constable': 'Constable',
    'head_constable': 'Head Constable',
    'sub_inspector': 'Sub Inspector',
    'inspector': 'Inspector'
  }
  return labels[level] || level
}
