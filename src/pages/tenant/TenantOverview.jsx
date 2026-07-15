import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetLeasesQuery } from '../../features/leases/leasesApi'
import { useGetInvoicesQuery } from '../../features/payments/paymentsApi'
import { useGetMaintenanceRequestsQuery } from '../../features/maintenance/maintenanceApi'
import { FileText, CreditCard, Wrench, Home, ArrowRight, AlertCircle, ChevronRight, Calendar, DollarSign } from 'lucide-react'

function TenantOverview() {
  const { user } = useSelector(s => s.auth)
  const { data: leasesData } = useGetLeasesQuery()
  const { data: invoicesData } = useGetInvoicesQuery()
  const { data: maintenanceData } = useGetMaintenanceRequestsQuery()

  const activeLease = leasesData?.results?.find(l => l.status === 'active')
  const pendingInvoices = invoicesData?.results?.filter(i => i.status === 'pending') || []
  const openRequests = maintenanceData?.results?.filter(r => r.status !== 'completed') || []

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">{greeting}</p>
        <h1 className="text-display-lg text-primary tracking-tight">{user?.first_name}</h1>
        <p className="text-body-md text-on-surface-variant mt-2">
          {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      {/* Active lease banner */}
      {activeLease ? (
        <div className="bg-primary-container rounded-2xl p-6 flex items-center justify-between border border-white/5">
          <div>
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-1">Active Lease</p>
            <p className="text-secondary font-bold text-lg">{activeLease.property_name} — Unit {activeLease.unit_number}</p>
            <p className="text-on-primary-container text-sm mt-1 flex items-center gap-2">
              <DollarSign size={14} className="text-secondary" />
              KES {Number(activeLease.rent_amount).toLocaleString()}/mo
              <span className="w-1 h-1 rounded-full bg-on-primary-container/30" />
              <Calendar size={14} className="text-secondary" />
              {activeLease.start_date} → {activeLease.end_date || 'Open-ended'}
            </p>
          </div>
          <Link to="/tenant/lease" className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30">
            View lease
          </Link>
        </div>
      ) : (
        <div className="bg-warning-container border border-warning/20 rounded-2xl p-5 flex items-center gap-4">
          <AlertCircle size={20} className="text-warning shrink-0" />
          <div>
            <p className="font-semibold text-warning text-sm">No active lease</p>
            <p className="text-warning/80 text-xs mt-0.5">Browse available properties to find your next home.</p>
          </div>
          <Link to="/tenant/browse" className="ml-auto bg-warning text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-warning/90 transition-colors">Browse</Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Invoices', value: pendingInvoices.length, sub: pendingInvoices.length > 0 ? `KES ${Number(pendingInvoices[0]?.amount || 0).toLocaleString()} due` : 'All clear', Icon: CreditCard, to: '/tenant/payments', warn: pendingInvoices.length > 0 },
          { label: 'Open Maintenance', value: openRequests.length, sub: openRequests.length > 0 ? `${openRequests[0]?.status_display} — ${openRequests[0]?.title}` : 'No open requests', Icon: Wrench, to: '/tenant/maintenance', warn: false },
          { label: 'Browse Properties', value: null, sub: 'Find your next home', Icon: Home, to: '/tenant/browse', warn: false },
        ].map(({ label, value, sub, Icon, to, warn }) => (
          <Link key={label} to={to} className={`glass-panel ambient-shadow rounded-2xl p-5 border transition-all hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] group ${warn ? 'border-error/30 bg-error/5' : 'border-outline-variant/30'}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-semibold uppercase tracking-wide ${warn ? 'text-error' : 'text-on-surface-variant'}`}>{label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${warn ? 'bg-error/10 text-error' : 'bg-surface-container text-on-surface-variant'}`}>
                <Icon size={16} />
              </div>
            </div>
            {value !== null && <p className={`text-3xl font-black mb-1 ${warn ? 'text-error' : 'text-on-surface'}`}>{value}</p>}
            <p className={`text-xs ${warn ? 'text-error/70' : 'text-on-surface-variant'}`}>{sub}</p>
            <div className="flex items-center gap-1 mt-3 text-secondary text-xs font-semibold group-hover:gap-2 transition-all">
              <span>View</span><ChevronRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent maintenance */}
      {openRequests.length > 0 && (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">Open Maintenance Requests</h2>
            <Link to="/tenant/maintenance" className="text-secondary text-xs font-semibold hover:underline transition-all">View all →</Link>
          </div>
          <div className="space-y-3">
            {openRequests.slice(0, 3).map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{r.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{r.category_display} · {r.priority_display} priority</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                  r.status === 'pending' ? 'bg-warning-container text-warning' :
                  r.status === 'in_progress' ? 'bg-secondary/10 text-secondary' :
                  'bg-secondary/10 text-secondary'
                }`}>{r.status_display}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantOverview