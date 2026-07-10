import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetDashboardSummaryQuery } from '../../features/reports/reportsApi'
import { Building2, Users, FileText, Wrench, DollarSign, TrendingUp, Home, AlertCircle, ArrowUpRight } from 'lucide-react'

function StatCard({ label, value, sub, Icon, accent }) {
  return (
    <div className={`rounded-2xl p-6 border ${accent ? 'bg-amber-500 border-amber-400' : 'bg-white border-slate-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-amber-100' : 'text-slate-500'}`}>{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-amber-400/50' : 'bg-slate-100'}`}>
          <Icon size={17} className={accent ? 'text-white' : 'text-slate-600'} />
        </div>
      </div>
      <p className={`text-3xl font-black leading-none ${accent ? 'text-white' : 'text-slate-900'}`}>{value ?? '—'}</p>
      {sub && <p className={`text-xs mt-2 ${accent ? 'text-amber-100' : 'text-slate-400'}`}>{sub}</p>}
    </div>
  )
}

function AdminOverview() {
  const { user } = useSelector(s => s.auth)
  const { data, isLoading } = useGetDashboardSummaryQuery()

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-amber-600 text-sm font-semibold mb-1">Admin Panel</p>
          <h1 className="text-3xl font-black text-slate-900">Platform Overview</h1>
          <p className="text-slate-500 text-sm mt-1">{new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/admin/users" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/25 hover:-translate-y-0.5">
          <Users size={15} /> Manage Users
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Revenue" value={data ? `KES ${Number(data.total_revenue).toLocaleString()}` : null} sub="All time" Icon={DollarSign} accent />
        <StatCard label="Properties" value={data?.total_properties} sub="Active listings" Icon={Building2} />
        <StatCard label="Total Units" value={data?.total_units} sub={`${data?.occupied_units || 0} occupied`} Icon={Home} />
        <StatCard label="Active Leases" value={data?.active_leases} sub="Current tenants" Icon={FileText} />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Occupancy Rate" value={data ? `${data.occupancy_rate}%` : null} Icon={TrendingUp} />
        <StatCard label="Pending Maintenance" value={data?.pending_maintenance} Icon={Wrench} />
        <StatCard label="Pending Invoices" value={data?.pending_invoices} Icon={AlertCircle} />
      </div>

      {/* Occupancy bar */}
      {data && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Platform Occupancy</h2>
            {/* 👇 Updated: Link to public properties instead of /admin/properties */}
            <Link to="/properties" className="text-amber-600 text-xs font-semibold flex items-center gap-1 hover:text-amber-700">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${data.occupancy_rate}%` }} />
            </div>
            <span className="text-slate-900 font-black text-lg w-16 text-right">{data.occupancy_rate}%</span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />{data.occupied_units} occupied</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />{data.total_units - data.occupied_units} vacant</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOverview