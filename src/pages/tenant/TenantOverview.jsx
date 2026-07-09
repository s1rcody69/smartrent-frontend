import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetLeasesQuery } from '../../features/leases/leasesApi'
import { useGetMaintenanceRequestsQuery } from '../../features/maintenance/maintenanceApi'
import { useGetInvoicesQuery } from '../../features/payments/paymentsApi'
import { useGetPaymentsQuery } from '../../features/payments/paymentsApi'
import {
  Building2, FileText, Wrench,
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

function TenantOverview() {
  const { user } = useSelector(s => s.auth)
  
  // Individual API calls for tenant data
  const { data: leasesData, isLoading: leasesLoading } = useGetLeasesQuery()
  const { data: maintenanceData, isLoading: maintenanceLoading } = useGetMaintenanceRequestsQuery()
  const { data: invoicesData, isLoading: invoicesLoading } = useGetInvoicesQuery()
  const { data: paymentsData, isLoading: paymentsLoading } = useGetPaymentsQuery()

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Derived stats from tenant data
  const activeLease = leasesData?.results?.find(l => l.status === 'active')
  const pendingInvoices = invoicesData?.results?.filter(i => i.status === 'pending') || []
  const pendingMaintenance = maintenanceData?.results?.filter(m => 
    ['submitted', 'assigned', 'in_progress'].includes(m.status)
  ) || []
  
  const totalPaid = paymentsData?.results
    ?.filter(p => p.status === 'completed')
    ?.reduce((sum, p) => sum + Number(p.amount), 0) || 0
  
  const isLoading = leasesLoading || maintenanceLoading || invoicesLoading || paymentsLoading

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
          to="/properties"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/25 hover:-translate-y-0.5"
        >
          <Building2 size={15} />
          Browse Properties
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="My Unit"
          value={activeLease?.unit_number || '—'}
          sub={activeLease?.property_name || 'No active lease'}
          Icon={Home}
          accent
          loading={isLoading}
        />
        <StatCard
          label="Monthly Rent"
          value={activeLease ? `KES ${Number(activeLease.rent_amount).toLocaleString()}` : '—'}
          sub={activeLease ? `Due: ${new Date(activeLease.end_date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}` : null}
          Icon={DollarSign}
          loading={isLoading}
        />
        <StatCard
          label="Pending Bills"
          value={pendingInvoices.length}
          sub={pendingInvoices.length > 0 ? 'Awaiting payment' : 'All paid'}
          Icon={AlertCircle}
          loading={isLoading}
        />
        <StatCard
          label="Open Requests"
          value={pendingMaintenance.length}
          sub={pendingMaintenance.length > 0 ? 'Awaiting resolution' : 'None'}
          Icon={Wrench}
          loading={isLoading}
        />
      </div>

      {/* Second row - extra stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Paid"
          value={`KES ${totalPaid.toLocaleString()}`}
          sub="All time payments"
          Icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          label="Lease Status"
          value={activeLease?.status_display || 'No Lease'}
          sub={activeLease ? `Started ${new Date(activeLease.start_date).toLocaleDateString('en-KE')}` : null}
          Icon={FileText}
          loading={isLoading}
        />
        <StatCard
          label="Property"
          value={activeLease?.property_name || '—'}
          sub={activeLease?.city || null}
          Icon={Building2}
          loading={isLoading}
        />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            to="/tenant/leases"
            label="View My Lease"
            desc="Check lease agreement details"
            Icon={FileText}
          />
          <QuickAction
            to="/tenant/maintenance"
            label="Maintenance"
            desc="Submit or track requests"
            Icon={Wrench}
          />
          <QuickAction
            to="/tenant/payments"
            label="Payments"
            desc="View invoices and pay rent"
            Icon={CreditCard}
          />
          <QuickAction
            to="/properties"
            label="Browse Properties"
            desc="Find available units"
            Icon={Building2}
          />
        </div>
      </div>

      {/* Occupancy visual - shows tenant's lease status */}
      {activeLease && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">My Lease Status</h2>
            <Link to="/tenant/leases" className="text-amber-600 hover:text-amber-700 text-xs font-semibold flex items-center gap-1">
              View details <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: activeLease ? '100%' : '0%' }}
              />
            </div>
            <span className="text-slate-900 font-black text-lg w-16 text-right">
              {activeLease ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              {activeLease?.property_name} — Unit {activeLease?.unit_number}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />
              Rent: KES {activeLease ? Number(activeLease.rent_amount).toLocaleString() : '—'}/mo
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantOverview