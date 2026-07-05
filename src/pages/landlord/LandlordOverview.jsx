import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetDashboardSummaryQuery } from '../../features/reports/reportsApi'
import {
  Building2, Users, FileText, Wrench,
  TrendingUp, DollarSign, Home, AlertCircle,
  ArrowUpRight, ArrowRight, CreditCard
} from 'lucide-react'

function StatCard({ label, value, sub, Icon, accent = false, loading }) {
  return (
    <div className={`rounded-2xl p-6 border transition-all hover:shadow-md ${
      accent
        ? 'bg-amber-500 border-amber-400'
        : 'bg-white border-slate-100'
    }`}>
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className={`h-4 rounded w-1/2 ${accent ? 'bg-amber-400' : 'bg-slate-200'}`} />
          <div className={`h-8 rounded w-2/3 ${accent ? 'bg-amber-400' : 'bg-slate-200'}`} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-amber-100' : 'text-slate-500'}`}>
              {label}
            </p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              accent ? 'bg-amber-400/50' : 'bg-slate-100'
            }`}>
              <Icon size={17} className={accent ? 'text-white' : 'text-slate-600'} />
            </div>
          </div>
          <p className={`text-3xl font-black leading-none ${accent ? 'text-white' : 'text-slate-900'}`}>
            {value ?? '—'}
          </p>
          {sub && (
            <p className={`text-xs mt-2 ${accent ? 'text-amber-100' : 'text-slate-400'}`}>{sub}</p>
          )}
        </>
      )}
    </div>
  )
}

function QuickAction({ to, label, desc, Icon }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all group"
    >
      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
        <Icon size={18} className="text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-400 truncate">{desc}</p>
      </div>
      <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}

function LandlordOverview() {
  const { user } = useSelector(s => s.auth)
  const { data, isLoading } = useGetDashboardSummaryQuery()

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-8">

      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-amber-600 text-sm font-semibold mb-1">{greeting}</p>
          <h1 className="text-3xl font-black text-slate-900">{user?.first_name}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {now.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/landlord/properties"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/25 hover:-translate-y-0.5"
        >
          <Building2 size={15} />
          Add Property
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Revenue"
          value={data ? `KES ${Number(data.total_revenue).toLocaleString()}` : null}
          sub="All time collected"
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
          sub={data ? `${data.occupied_units} occupied` : null}
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

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Occupancy Rate"
          value={data ? `${data.occupancy_rate}%` : null}
          sub="Across all properties"
          Icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          label="Pending Maintenance"
          value={data?.pending_maintenance}
          sub="Awaiting action"
          Icon={Wrench}
          loading={isLoading}
        />
        <StatCard
          label="Pending Invoices"
          value={data?.pending_invoices}
          sub="Awaiting payment"
          Icon={AlertCircle}
          loading={isLoading}
        />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            to="/landlord/properties"
            label="Manage Properties"
            desc="Add, edit or remove listings"
            Icon={Building2}
          />
          <QuickAction
            to="/landlord/leases"
            label="View Leases"
            desc="Active tenant agreements"
            Icon={FileText}
          />
          <QuickAction
            to="/landlord/maintenance"
            label="Maintenance Requests"
            desc="Review open requests"
            Icon={Wrench}
          />
          <QuickAction
            to="/landlord/payments"
            label="Payment History"
            desc="Track rent collection"
            Icon={CreditCard}
          />
        </div>
      </div>

      {/* Occupancy visual */}
      {data && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Occupancy Overview</h2>
            <Link to="/landlord/properties" className="text-amber-600 hover:text-amber-700 text-xs font-semibold flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${data.occupancy_rate}%` }}
              />
            </div>
            <span className="text-slate-900 font-black text-lg w-16 text-right">{data.occupancy_rate}%</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              {data.occupied_units} occupied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />
              {data.total_units - data.occupied_units} vacant
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandlordOverview