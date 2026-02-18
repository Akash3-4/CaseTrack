import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { getRiskColor, getStatusColor, formatDate } from '../utils/helpers'

function CasesList() {
  const [cases, setCases] = useState([])
  const [filteredCases, setFilteredCases] = useState([])
  const [filters, setFilters] = useState({
    status: '',
    risk_zone: '',
    pilot_only: false,
    search: ''
  })

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockCases = [
      {
        id: 1,
        case_number: 'CASE-20260218-0001',
        registration_datetime: '2026-02-18T10:30:00',
        case_type: 'first_time_domestic_harassment',
        is_pilot_category: true,
        risk_zone: 'red',
        status: 'under_investigation',
        assigned_officer_level: 'inspector'
      },
      {
        id: 2,
        case_number: 'CASE-20260218-0002',
        registration_datetime: '2026-02-18T11:15:00',
        case_type: 'first_time_domestic_harassment',
        is_pilot_category: true,
        risk_zone: 'orange',
        status: 'registered',
        assigned_officer_level: 'sub_inspector'
      },
      {
        id: 3,
        case_number: 'CASE-20260217-0056',
        registration_datetime: '2026-02-17T14:20:00',
        case_type: 'assault',
        is_pilot_category: false,
        risk_zone: 'yellow',
        status: 'pending_review',
        assigned_officer_level: 'constable'
      },
      {
        id: 4,
        case_number: 'CASE-20260216-0043',
        registration_datetime: '2026-02-16T09:45:00',
        case_type: 'first_time_domestic_harassment',
        is_pilot_category: true,
        risk_zone: 'orange',
        status: 'closed',
        assigned_officer_level: 'sub_inspector'
      }
    ]
    setCases(mockCases)
    setFilteredCases(mockCases)
  }, [])

  useEffect(() => {
    let filtered = cases

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status)
    }
    if (filters.risk_zone) {
      filtered = filtered.filter(c => c.risk_zone === filters.risk_zone)
    }
    if (filters.pilot_only) {
      filtered = filtered.filter(c => c.is_pilot_category)
    }
    if (filters.search) {
      filtered = filtered.filter(c => 
        c.case_number.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredCases(filtered)
  }, [filters, cases])

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Cases</h2>
          <p className="mt-2 text-sm text-gray-600">
            {filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'} found
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center mb-3">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search case number..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="registered">Registered</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="pending_review">Pending Review</option>
            <option value="closed">Closed</option>
          </select>

          {/* Risk Zone Filter */}
          <select
            value={filters.risk_zone}
            onChange={(e) => handleFilterChange('risk_zone', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Risk Zones</option>
            <option value="yellow">Yellow (Low)</option>
            <option value="orange">Orange (Moderate)</option>
            <option value="red">Red (High)</option>
          </select>

          {/* Pilot Only */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.pilot_only}
              onChange={(e) => handleFilterChange('pilot_only', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Pilot cases only
            </label>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Zone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCases.map((caseItem) => (
              <tr key={caseItem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {caseItem.case_number}
                  {caseItem.is_pilot_category && (
                    <span className="ml-2 text-xs text-blue-600">★ Pilot</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(caseItem.registration_datetime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(caseItem.risk_zone)}`}>
                    {caseItem.risk_zone.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                    {caseItem.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {caseItem.case_type.replace(/_/g, ' ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/cases/${caseItem.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No cases found matching the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CasesList
