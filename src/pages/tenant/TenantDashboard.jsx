import { Routes, Route } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useSelector } from 'react-redux'

function TenantDashboard() {
  const { user } = useSelector(s => s.auth)
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.first_name} 👋</h1>
          <p className="text-slate-500 mt-1">Your tenant dashboard is being built out.</p>
          <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-6">
            <p className="text-slate-500 text-sm">Lease details, maintenance requests, and M-Pesa payments coming next.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TenantDashboard