import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useGetLeasesQuery } from '../../features/leases/leasesApi'
import { useGetInvoicesQuery } from '../../features/payments/paymentsApi'
import { useGetMaintenanceRequestsQuery } from '../../features/maintenance/maintenanceApi'
import { FileText, CreditCard, Wrench, Home, ArrowRight, AlertCircle } from 'lucide-react'

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
    <div className="p-8">
      <div className="mb-8">
        <p className="text-amber-600 text-sm font-semibold mb-1">{greeting}</p>
        <h1 className="text-3xl font-black text-slate-900">{user?.first_name}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Active lease banner */}
      {activeLease ? (
        <div className="bg-slate-900 rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Active Lease</p>
            <p className="text-white font-bold text-lg">{activeLease.property_name} — Unit {activeLease.unit_number}</p>
            <p className="text-slate-400 text-sm mt-1">KES {Number(activeLease.rent_amount).toLocaleString()}/mo · {activeLease.start_date} → {activeLease.end_date || 'Open-ended'}</p>
          </div>
          <Link to="/tenant/lease" className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
            View lease
          </Link>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <AlertCircle size={20} className="text-amber-600 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">No active lease</p>
            <p className="text-amber-600 text-xs mt-0.5">Browse available properties to find your next home.</p>
          </div>
          <Link to="/tenant/browse" className="ml-auto bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold">Browse</Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending Invoices', value: pendingInvoices.length, sub: pendingInvoices.length > 0 ? `KES ${Number(pendingInvoices[0]?.amount || 0).toLocaleString()} due` : 'All clear', Icon: CreditCard, to: '/tenant/payments', warn: pendingInvoices.length > 0 },
          { label: 'Open Maintenance', value: openRequests.length, sub: openRequests.length > 0 ? `${openRequests[0]?.status_display} — ${openRequests[0]?.title}` : 'No open requests', Icon: Wrench, to: '/tenant/maintenance', warn: false },
          { label: 'Browse Properties', value: null, sub: 'Find your next home', Icon: Home, to: '/tenant/browse', warn: false },
        ].map(({ label, value, sub, Icon, to, warn }) => (
          <Link key={label} to={to} className={`rounded-2xl p-5 border transition-all hover:shadow-md group ${warn ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-semibold uppercase tracking-wide ${warn ? 'text-red-500' : 'text-slate-500'}`}>{label}</p>
              <Icon size={16} className={warn ? 'text-red-400' : 'text-slate-400'} />
            </div>
            {value !== null && <p className={`text-3xl font-black mb-1 ${warn ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>}
            <p className={`text-xs ${warn ? 'text-red-400' : 'text-slate-400'}`}>{sub}</p>
            <div className="flex items-center gap-1 mt-3 text-amber-600 text-xs font-semibold group-hover:gap-2 transition-all">
              <span>View</span><ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent maintenance */}
      {openRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Open Maintenance Requests</h2>
            <Link to="/tenant/maintenance" className="text-amber-600 text-xs font-semibold hover:text-amber-700">View all →</Link>
          </div>
          <div className="space-y-3">
            {openRequests.slice(0, 3).map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.category_display} · {r.priority_display} priority</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                  r.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                  r.status === 'in_progress' ? 'bg-purple-50 text-purple-700' :
                  'bg-blue-50 text-blue-700'
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