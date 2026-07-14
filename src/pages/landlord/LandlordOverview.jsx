import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetDashboardSummaryQuery } from '../../features/reports/reportsApi'
import {
  Building2, Users, FileText, Wrench,
  TrendingUp, DollarSign, Home, AlertCircle,
  ArrowUpRight, ArrowRight, CreditCard, Plus
} from 'lucide-react'

function StatCard({ label, value, sub, Icon, accent = false, loading }) {
  return (
    <div className={`glass-panel ambient-shadow rounded-2xl p-6 border transition-all hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] ${
      accent
        ? 'border-secondary/30 bg-secondary/5'
        : 'border-outline-variant/30'
    }`}>
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className={`h-4 rounded w-1/2 ${accent ? 'bg-secondary/30' : 'bg-surface-container'}`} />
          <div className={`h-8 rounded w-2/3 ${accent ? 'bg-secondary/30' : 'bg-surface-container'}`} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-secondary' : 'text-on-surface-variant'}`}>
              {label}
            </p>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              accent ? 'bg-secondary text-white' : 'bg-surface-container'
            }`}>
              <Icon size={17} className={accent ? 'text-white' : 'text-on-surface-variant'} />
            </div>
          </div>
          <p className={`text-3xl font-black leading-none ${accent ? 'text-secondary' : 'text-on-surface'}`}>
            {value ?? '—'}
          </p>
          {sub && (
            <p className={`text-xs mt-2 ${accent ? 'text-secondary/70' : 'text-on-surface-variant'}`}>{sub}</p>
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
      className="flex items-center gap-4 p-4 bg-surface-container-lowest/80 glass-panel rounded-2xl border border-outline-variant/30 hover:border-secondary/30 hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-all group"
    >
      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
        <Icon size={18} className="text-secondary group-hover:text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant truncate">{desc}</p>
      </div>
      <ArrowRight size={16} className="text-on-surface-variant group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
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
    <div className="space-y-8">

      {/* Page header */}
      <header className="flex items-start justify-between">
        <div>
          <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">{greeting}</p>
          <h1 className="text-display-lg text-primary tracking-tight">{user?.first_name}</h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            {now.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          to="/landlord/properties"
          className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5"
        >
          <Plus size={15} />
          Add Property
        </Link>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Quick actions</h2>
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
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">Occupancy Overview</h2>
            <Link to="/landlord/properties" className="text-secondary text-xs font-semibold flex items-center gap-1 hover:underline transition-all">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 bg-surface-container rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-1000"
                style={{ width: `${data.occupancy_rate}%` }}
              />
            </div>
            <span className="text-on-surface font-black text-lg w-16 text-right">{data.occupancy_rate}%</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-on-surface-variant">
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

export default LandlordOverview