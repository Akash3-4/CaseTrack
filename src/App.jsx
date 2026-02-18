import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { HomeIcon, PlusCircleIcon, FolderOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Dashboard from './components/Dashboard'
import ComplaintIntake from './components/ComplaintIntake'
import CasesList from './components/CasesList'
import CaseDetail from './components/CaseDetail'
import SupervisoryReview from './components/SupervisoryReview'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-blue-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">CaseTrack</h1>
                <span className="ml-3 text-sm text-blue-200">Complaint Management System</span>
              </div>
              <div className="flex space-x-4 items-center">
                <Link to="/" className="flex items-center px-3 py-2 rounded-md hover:bg-blue-800 transition">
                  <HomeIcon className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                <Link to="/intake" className="flex items-center px-3 py-2 rounded-md hover:bg-blue-800 transition">
                  <PlusCircleIcon className="h-5 w-5 mr-1" />
                  New Case
                </Link>
                <Link to="/cases" className="flex items-center px-3 py-2 rounded-md hover:bg-blue-800 transition">
                  <FolderOpenIcon className="h-5 w-5 mr-1" />
                  Cases
                </Link>
                <Link to="/review" className="flex items-center px-3 py-2 rounded-md hover:bg-blue-800 transition">
                  <ChartBarIcon className="h-5 w-5 mr-1" />
                  Review
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/intake" element={<ComplaintIntake />} />
            <Route path="/cases" element={<CasesList />} />
            <Route path="/cases/:caseId" element={<CaseDetail />} />
            <Route path="/review" element={<SupervisoryReview />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              CaseTrack v1.0 - Decision-Support System for Complaint Classification
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
