import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetDashboardSummaryQuery } from '../../features/reports/reportsApi'
import { Building2, Users, FileText, Wrench, DollarSign, TrendingUp, Home, AlertCircle, ArrowUpRight, Plus } from 'lucide-react'

function StatCard({ label, value, sub, Icon, accent, loading }) {
  // 👈 Make sure Icon is being received as a prop
  return (
    <div className={`glass-panel ambient-shadow rounded-2xl p-6 border ${accent ? 'border-secondary/30' : 'border-outline-variant/30'}`}>
      <div className="flex items-center justify-between mb-4">
        <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-secondary' : 'text-on-surface-variant'}`}>{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent ? 'bg-secondary text-white' : 'bg-surface-container'}`}>
          {Icon && <Icon size={17} className={accent ? 'text-white' : 'text-on-surface-variant'} />}
        </div>
      </div>
      {loading ? (
        <div className="animate-pulse">
          <div className={`h-8 w-24 rounded ${accent ? 'bg-secondary/30' : 'bg-surface-container'}`} />
        </div>
      ) : (
        <p className={`text-3xl font-black leading-none ${accent ? 'text-secondary' : 'text-on-surface'}`}>{value ?? '—'}</p>
      )}
      {sub && <p className={`text-xs mt-2 ${accent ? 'text-secondary/70' : 'text-on-surface-variant'}`}>{sub}</p>}
    </div>
  )
}

function AdminOverview() {
  const { user } = useSelector(s => s.auth)
  const { data, isLoading } = useGetDashboardSummaryQuery()

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Admin Panel</p>
          <h2 className="text-display-lg text-primary tracking-tight">Platform Overview</h2>
          <p className="text-body-md text-on-surface-variant mt-2">
            {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/admin/users"
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5"
        >
          <Users size={15} /> Manage Users
        </Link>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={data ? `KES ${Number(data.total_revenue).toLocaleString()}` : null}
          sub="All time"
          Icon={DollarSign}
          accent
          loading={isLoading}
        />
        <StatCard
          label="Properties"
          value={data?.total_properties}
          sub="Active listings"
          Icon={Building2}
          loading={isLoading}
        />
        <StatCard
          label="Total Units"
          value={data?.total_units}
          sub={`${data?.occupied_units || 0} occupied`}
          Icon={Home}
          loading={isLoading}
        />
        <StatCard
          label="Active Leases"
          value={data?.active_leases}
          sub="Current tenants"
          Icon={FileText}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Occupancy Rate"
          value={data ? `${data.occupancy_rate}%` : null}
          Icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          label="Pending Maintenance"
          value={data?.pending_maintenance}
          Icon={Wrench}
          loading={isLoading}
        />
        <StatCard
          label="Pending Invoices"
          value={data?.pending_invoices}
          Icon={AlertCircle}
          loading={isLoading}
        />
      </div>

      {/* Occupancy Bar */}
      {data && (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">Platform Occupancy</h3>
            <Link
              to="/properties"
              className="text-secondary text-xs font-semibold flex items-center gap-1 hover:underline transition-all"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 bg-surface-container rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-700"
                style={{ width: `${data.occupancy_rate}%` }}
              />
            </div>
            <span className="text-on-surface font-black text-lg w-16 text-right">{data.occupancy_rate}%</span>
          </div>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />
              {data.occupied_units} occupied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest inline-block" />
              {data.total_units - data.occupied_units} vacant
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOverview