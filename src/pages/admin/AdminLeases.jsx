import { useGetLeasesQuery, useGetTerminationRequestsQuery, useApproveTerminationMutation, useRejectTerminationMutation } from '../../features/leases/leasesApi'
import { FileText, CheckCircle, XCircle, AlertTriangle, Users, Home, Calendar, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

function AdminLeases() {
  const { data, isLoading } = useGetLeasesQuery()
  const { data: terminationsData } = useGetTerminationRequestsQuery()
  const [approveTermination] = useApproveTerminationMutation()
  const [rejectTermination] = useRejectTerminationMutation()
  const [activeTab, setActiveTab] = useState('leases')

  const leases = data?.results || []
  const terminations = terminationsData?.results || []
  const pending = terminations.filter(t => t.status === 'pending')

  const statusColor = (s) => ({
    active: 'bg-success-container text-success',
    expired: 'bg-surface-container-highest text-on-surface-variant',
    terminated: 'bg-error-container text-error',
    pending: 'bg-warning-container text-warning',
  }[s] || 'bg-surface-container-highest text-on-surface-variant')

  const handleApprove = async (id) => {
    try {
      await approveTermination({ id }).unwrap()
      toast.success('Termination approved')
    } catch (err) {
      toast.error(err.data?.error || 'Failed to approve')
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectTermination({ id }).unwrap()
      toast.success('Termination rejected')
    } catch {
      toast.error('Failed to reject')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-label-md text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Lease Management</p>
          <h2 className="text-display-lg text-display-lg text-primary tracking-tight">All Leases</h2>
          <p className="text-body-md text-body-md text-on-surface-variant mt-2">{leases.length} leases across all properties</p>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-2 bg-warning-container border border-warning/20 rounded-xl px-4 py-2.5">
            <AlertTriangle size={15} className="text-warning" />
            <span className="text-warning text-sm font-semibold">{pending.length} pending termination{pending.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        {[['leases', 'All Leases'], ['terminations', `Terminations (${terminations.length})`]].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-white text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Leases Table */}
      {activeTab === 'leases' && (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="grid grid-cols-5 bg-surface-container-low border-b border-outline-variant/30 px-6 py-3">
            {['Tenant', 'Property & Unit', 'Landlord', 'Rent/mo', 'Status'].map(h => (
              <p key={h} className="text-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</p>
            ))}
          </div>
          {isLoading ? (
            <div className="space-y-px">
              {[1,2,3].map(i => (
                <div key={i} className="h-16 animate-pulse bg-surface-container-low mx-6 my-2 rounded-xl" />
              ))}
            </div>
          ) : leases.length === 0 ? (
            <div className="py-16 text-center">
              <FileText size={32} className="text-outline mx-auto mb-2" />
              <p className="text-on-surface-variant text-sm">No leases yet</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {leases.map(l => (
                <div key={l.id} className="grid grid-cols-5 px-6 py-4 hover:bg-surface-container-low transition-colors items-center">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{l.tenant_name}</p>
                    <p className="text-xs text-on-surface-variant">{l.tenant_email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{l.property_name}</p>
                    <p className="text-xs text-on-surface-variant">Unit {l.unit_number}</p>
                  </div>
                  <p className="text-sm text-on-surface-variant">{l.landlord_name || '—'}</p>
                  <p className="text-sm font-bold text-on-surface">KES {Number(l.rent_amount).toLocaleString()}</p>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize w-fit ${statusColor(l.status)}`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Terminations */}
      {activeTab === 'terminations' && (
        <div className="space-y-4">
          {terminations.length === 0 ? (
            <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
              <CheckCircle size={40} className="text-outline mx-auto mb-3" />
              <p className="text-on-surface-variant">No termination requests</p>
            </div>
          ) : (
            terminations.map(t => (
              <div key={t.id} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-on-surface">{t.tenant_name}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        t.status === 'pending' ? 'bg-warning-container text-warning' :
                        t.status === 'approved' ? 'bg-success-container text-success' :
                        'bg-error-container text-error'
                      }`}>{t.status}</span>
                    </div>
                    <p className="text-on-surface-variant text-xs">{t.property_name} · Unit {t.unit_number}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">
                      Vacate by: <span className="font-medium text-on-surface">{t.requested_vacate_date}</span>
                    </p>
                  </div>
                  {t.unpaid_invoices_count > 0 && (
                    <div className="flex items-center gap-1.5 bg-error-container text-error text-xs font-semibold px-3 py-1.5 rounded-full">
                      <AlertTriangle size={12} />{t.unpaid_invoices_count} unpaid
                    </div>
                  )}
                </div>
                <div className="bg-surface-container-low rounded-xl p-3 mb-3">
                  <p className="text-xs text-on-surface-variant mb-1">Reason</p>
                  <p className="text-on-surface text-sm">{t.reason}</p>
                </div>
                <div className="bg-warning-container border border-warning/20 rounded-xl p-3 mb-4">
                  <p className="text-warning text-xs">{t.deposit_note}</p>
                </div>
                {t.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(t.id)}
                      className="flex-1 flex items-center justify-center gap-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg py-2.5 text-sm font-semibold transition-colors"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(t.id)}
                      disabled={t.unpaid_invoices_count > 0}
                      className="flex-1 flex items-center justify-center gap-2 bg-success hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-semibold transition-colors"
                    >
                      <CheckCircle size={15} /> Approve
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AdminLeases