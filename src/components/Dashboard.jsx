import { useState, useEffect } from 'react'
import { ChartBarIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

function Dashboard() {
  const [stats, setStats] = useState({
    totalCases: 0,
    highRiskCases: 0,
    pendingReview: 0,
    closedCases: 0,
    pilotCases: 0,
    avgInputTime: 0,
    disputeRate: 0
  })

  useEffect(() => {
    // In a real app, fetch from API
    // For now, using mock data
    setStats({
      totalCases: 156,
      highRiskCases: 23,
      pendingReview: 12,
      closedCases: 98,
      pilotCases: 45,
      avgInputTime: 3.8,
      disputeRate: 8.2
    })
  }, [])

  const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {subtitle && <div className="ml-2 text-sm text-gray-500">{subtitle}</div>}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-sm text-gray-600">
          System overview and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Cases"
          value={stats.totalCases}
          icon={ChartBarIcon}
          color="text-blue-600"
        />
        <StatCard
          title="High Risk Cases"
          value={stats.highRiskCases}
          icon={ExclamationTriangleIcon}
          color="text-red-600"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingReview}
          icon={ClockIcon}
          color="text-yellow-600"
        />
        <StatCard
          title="Closed Cases"
          value={stats.closedCases}
          icon={CheckCircleIcon}
          color="text-green-600"
        />
      </div>

      {/* Performance Metrics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Pilot Category Cases</p>
            <p className="text-3xl font-bold text-blue-600">{stats.pilotCases}</p>
            <p className="text-xs text-gray-500 mt-1">First-time domestic harassment</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg. Input Time</p>
            <p className="text-3xl font-bold text-green-600">{stats.avgInputTime} min</p>
            <p className="text-xs text-gray-500 mt-1">Target: &lt; 5 minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dispute Rate</p>
            <p className="text-3xl font-bold text-orange-600">{stats.disputeRate}%</p>
            <p className="text-xs text-gray-500 mt-1">From victim feedback</p>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-3">
          {stats.avgInputTime < 5 ? (
            <div className="flex items-start p-4 bg-green-50 rounded-md">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">Input time within target</p>
                <p className="text-sm text-green-600">Average input time is {stats.avgInputTime} minutes, below the 5-minute threshold.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start p-4 bg-yellow-50 rounded-md">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Input time threshold exceeded</p>
                <p className="text-sm text-yellow-600">Consider reviewing data fields to reduce officer workload.</p>
              </div>
            </div>
          )}
          
          <div className="flex items-start p-4 bg-blue-50 rounded-md">
            <ChartBarIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">6-week review checkpoint approaching</p>
              <p className="text-sm text-blue-600">Next system evaluation scheduled for pilot category outcomes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
