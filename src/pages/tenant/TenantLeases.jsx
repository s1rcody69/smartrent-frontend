import { useGetLeasesQuery } from '../../features/leases/leasesApi'
import { Home, FileText, Calendar, AlertCircle } from 'lucide-react'

function StatusBadge({ status, display }) {
  const colors = {
    active: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    terminated: 'bg-slate-50 text-slate-600',
    expired: 'bg-slate-50 text-slate-600',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-slate-50 text-slate-600'}`}>
      {display || status}
    </span>
  )
}

function TenantLeases() {
  const { data, isLoading } = useGetLeasesQuery()
  
  const leases = data?.results || []
  const activeLease = leases.find(l => l.status === 'active')

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-100 rounded w-1/4" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">My Lease</h1>
        <p className="text-slate-500 text-sm mt-1">View your current lease agreement</p>
      </div>

      {!activeLease ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <FileText size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No active lease</p>
          <p className="text-slate-400 text-sm mt-1">You don't have an active lease agreement.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{activeLease.property_name}</h2>
                <p className="text-slate-500 text-sm">Unit {activeLease.unit_number}</p>
              </div>
              <StatusBadge status={activeLease.status} display={activeLease.status_display} />
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Monthly Rent</p>
                <p className="text-2xl font-black text-slate-900">KES {Number(activeLease.rent_amount).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Security Deposit</p>
                <p className="text-2xl font-black text-slate-900">KES {Number(activeLease.deposit_amount).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Lease Period</p>
                <div className="space-y-1">
                  <p className="text-sm text-slate-900 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    Start: {new Date(activeLease.start_date).toLocaleDateString('en-KE')}
                  </p>
                  <p className="text-sm text-slate-900 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    End: {new Date(activeLease.end_date).toLocaleDateString('en-KE')}
                  </p>
                </div>
              </div>
              {activeLease.notes && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-slate-700">{activeLease.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lease History */}
      {leases.length > 1 && (
        <div className="mt-8">
          <h3 className="text-base font-bold text-slate-900 mb-4">Lease History</h3>
          <div className="space-y-3">
            {leases.filter(l => l.status !== 'active').map(lease => (
              <div key={lease.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{lease.property_name}</p>
                  <p className="text-xs text-slate-400">Unit {lease.unit_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">KES {Number(lease.rent_amount).toLocaleString()}/mo</p>
                  <StatusBadge status={lease.status} display={lease.status_display} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantLeases