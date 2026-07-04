import Navbar from '../../components/layout/Navbar'
import { useSelector } from 'react-redux'

function AdminDashboard() {
  const { user } = useSelector(s => s.auth)
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16 max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform-wide overview coming next.</p>
      </div>
    </div>
  )
}

export default AdminDashboard