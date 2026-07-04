import { useSelector } from 'react-redux'
import { useGetDashboardSummaryQuery } from '../../features/reports/reportsApi'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value ?? '—'}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

function LandlordOverview() {
  const { user } = useSelector(s => s.auth)
  const { data, isLoading } = useGetDashboardSummaryQuery()

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Good morning, {user?.first_name} 👋</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your properties today.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl p-6 h-28 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Properties" value={data?.total_properties} />
          <StatCard label="Total Units" value={data?.total_units} sub={`${data?.occupied_units} occupied`} />
          <StatCard label="Active Leases" value={data?.active_leases} />
          <StatCard label="Pending Maintenance" value={data?.pending_maintenance} />
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Revenue" value={data ? `KES ${Number(data.total_revenue).toLocaleString()}` : null} />
        <StatCard label="Occupancy Rate" value={data ? `${data.occupancy_rate}%` : null} />
        <StatCard label="Pending Invoices" value={data?.pending_invoices} />
      </div>

      <div className="mt-10 bg-amber-50 border border-amber-100 rounded-2xl p-6">
        <p className="text-amber-800 font-medium text-sm">More dashboard pages coming — Properties, Leases, Maintenance, and Payments are next.</p>
      </div>
    </div>
  )
}

export default LandlordOverview