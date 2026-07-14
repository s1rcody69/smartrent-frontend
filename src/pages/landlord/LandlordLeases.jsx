import { useState } from 'react'
import { useGetLeasesQuery, useCreateLeaseMutation, useUpdateLeaseMutation, useGetTerminationRequestsQuery, useApproveTerminationMutation, useRejectTerminationMutation } from '../../features/leases/leasesApi'
import { useGetUnitsQuery } from '../../features/properties/propertiesApi'
import { useGetAvailableTenantsQuery } from '../../features/auth/authApi'
import { Plus, X, FileText, AlertTriangle, CheckCircle, XCircle, Clock, Users, Home, Calendar, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-surface-container-lowest glass-panel rounded-2xl w-full max-w-lg shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30 sticky top-0 bg-surface-container-lowest/95 backdrop-blur-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors"><X size={20} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-success-container text-success',
    expired: 'bg-surface-container-highest text-on-surface-variant',
    terminated: 'bg-error-container text-error',
    pending: 'bg-warning-container text-warning',
    approved: 'bg-success-container text-success',
    rejected: 'bg-error-container text-error',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || 'bg-surface-container-highest text-on-surface-variant'}`}>
      {status}
    </span>
  )
}

function LandlordLeases() {
  const { data, isLoading } = useGetLeasesQuery()
  const { data: terminationsData } = useGetTerminationRequestsQuery()
  const { data: unitsData } = useGetUnitsQuery()
  const { data: tenantsData, isLoading: tenantsLoading } = useGetAvailableTenantsQuery()
  const [createLease, { isLoading: creating }] = useCreateLeaseMutation()
  const [updateLease] = useUpdateLeaseMutation()
  const [approveTermination] = useApproveTerminationMutation()
  const [rejectTermination] = useRejectTerminationMutation()

  const [showCreate, setShowCreate] = useState(false)
  const [activeTab, setActiveTab] = useState('leases')
  const [form, setForm] = useState({ tenant: '', unit: '', rent_amount: '', deposit_amount: '', start_date: '', end_date: '', notes: '' })

  const tenants = tenantsData || []
  const vacantUnits = (unitsData?.results || []).filter(u => u.status === 'vacant')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createLease(form).unwrap()
      toast.success('Lease created')
      setShowCreate(false)
      setForm({ tenant: '', unit: '', rent_amount: '', deposit_amount: '', start_date: '', end_date: '', notes: '' })
    } catch (err) {
      toast.error(err.data?.error || Object.values(err.data || {})[0]?.[0] || 'Failed to create lease')
    }
  }

  const handleApprove = async (id) => {
    try {
      await approveTermination({ id }).unwrap()
      toast.success('Termination approved — lease terminated, unit now vacant')
    } catch (err) {
      toast.error(err.data?.error || 'Failed to approve')
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectTermination({ id }).unwrap()
      toast.success('Termination request rejected')
    } catch (err) {
      toast.error(err.data?.error || 'Failed to reject')
    }
  }

  const leases = data?.results || []
  const terminations = terminationsData?.results || []
  const pendingTerminations = terminations.filter(t => t.status === 'pending')

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Lease Management</p>
          <h1 className="text-display-lg text-primary tracking-tight">Leases</h1>
          <p className="text-body-md text-on-surface-variant mt-2">{leases.length} total lease{leases.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5">
          <Plus size={16} /> New Lease
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        {[['leases', 'Active Leases'], ['terminations', `Termination Requests ${pendingTerminations.length > 0 ? `(${pendingTerminations.length})` : ''}`]].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'leases' && (
        <>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass-panel ambient-shadow rounded-2xl h-24 animate-pulse border border-outline-variant/30" />)}</div>
          ) : leases.length === 0 ? (
            <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
              <FileText size={40} className="text-outline mx-auto mb-3" />
              <p className="text-on-surface-variant font-medium">No leases yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leases.map(lease => (
                <div key={lease.id} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5 hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <span className="font-bold text-secondary text-sm">{lease.tenant_name?.[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">{lease.tenant_name}</p>
                        <p className="text-on-surface-variant text-xs">{lease.property_name} · Unit {lease.unit_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-on-surface text-sm">KES {Number(lease.rent_amount).toLocaleString()}/mo</p>
                        <p className="text-on-surface-variant text-xs">{lease.start_date} → {lease.end_date || 'Open-ended'}</p>
                      </div>
                      <StatusBadge status={lease.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'terminations' && (
        <div className="space-y-4">
          {terminations.length === 0 ? (
            <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
              <CheckCircle size={40} className="text-outline mx-auto mb-3" />
              <p className="text-on-surface-variant font-medium">No termination requests</p>
            </div>
          ) : terminations.map(t => (
            <div key={t.id} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-on-surface">{t.tenant_name}</p>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-on-surface-variant text-xs">{t.property_name} · Unit {t.unit_number}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">Requested vacate: <span className="font-medium text-on-surface">{t.requested_vacate_date}</span></p>
                </div>
                {t.unpaid_invoices_count > 0 && (
                  <div className="flex items-center gap-1.5 bg-error-container text-error text-xs font-semibold px-3 py-1.5 rounded-full">
                    <AlertTriangle size={12} />
                    {t.unpaid_invoices_count} unpaid invoice{t.unpaid_invoices_count !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className="bg-surface-container-low rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Reason</p>
                <p className="text-on-surface text-sm">{t.reason}</p>
              </div>

              <div className="bg-warning-container border border-warning/20 rounded-lg p-3 mb-4">
                <p className="text-warning text-xs font-semibold flex items-center gap-1.5">
                  <AlertTriangle size={12} /> Deposit Note
                </p>
                <p className="text-white text-xs mt-1">{t.deposit_note}</p>
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
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="Create New Lease" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Tenant</label>
              <select
                name="tenant"
                value={form.tenant}
                onChange={handleChange}
                required
                className={inputCls}
              >
                <option value="">Select a tenant</option>
                {tenantsLoading ? (
                  <option value="" disabled>Loading tenants...</option>
                ) : (
                  tenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.full_name || t.email || t.id}
                    </option>
                  ))
                )}
              </select>
              {tenants.length === 0 && !tenantsLoading && (
                <p className="text-xs text-warning mt-1">No available tenants. All tenants have active leases.</p>
              )}
            </div>

            <div>
              <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Unit</label>
              <select name="unit" value={form.unit} onChange={(e) => { const u = vacantUnits.find(u => u.id === e.target.value); setForm({ ...form, unit: e.target.value, rent_amount: u?.rent_amount || '' }) }} required className={inputCls}>
                <option value="">Select a vacant unit</option>
                {vacantUnits.map(u => <option key={u.id} value={u.id}>Unit {u.unit_number} · KES {Number(u.rent_amount).toLocaleString()}/mo</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Rent (KES)</label>
                <input type="number" name="rent_amount" value={form.rent_amount} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Deposit (KES)</label>
                <input type="number" name="deposit_amount" value={form.deposit_amount} onChange={handleChange} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Start Date</label>
                <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">End Date</label>
                <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={inputCls} />
            </div>
            <button type="submit" disabled={creating} className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-lg font-bold text-sm disabled:opacity-50 transition-all">
              {creating ? 'Creating...' : 'Create Lease'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default LandlordLeases