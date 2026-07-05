import { useState } from 'react'
import { useGetLeasesQuery, useCreateLeaseMutation, useUpdateLeaseMutation, useGetTerminationRequestsQuery, useApproveTerminationMutation, useRejectTerminationMutation } from '../../features/leases/leasesApi'
import { useGetUnitsQuery } from '../../features/properties/propertiesApi'
import { Plus, X, FileText, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-emerald-50 text-emerald-700',
    expired: 'bg-slate-100 text-slate-600',
    terminated: 'bg-red-50 text-red-600',
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-600',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

function LandlordLeases() {
  const { data, isLoading } = useGetLeasesQuery()
  const { data: terminationsData } = useGetTerminationRequestsQuery()
  const { data: unitsData } = useGetUnitsQuery()
  const [createLease, { isLoading: creating }] = useCreateLeaseMutation()
  const [updateLease] = useUpdateLeaseMutation()
  const [approveTermination] = useApproveTerminationMutation()
  const [rejectTermination] = useRejectTerminationMutation()

  const [showCreate, setShowCreate] = useState(false)
  const [activeTab, setActiveTab] = useState('leases')
  const [form, setForm] = useState({ tenant: '', unit: '', rent_amount: '', deposit_amount: '', start_date: '', end_date: '', notes: '' })

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
  const vacantUnits = (unitsData?.results || []).filter(u => u.status === 'vacant')
  const pendingTerminations = terminations.filter(t => t.status === 'pending')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Leases</h1>
          <p className="text-slate-500 text-sm mt-1">{leases.length} total lease{leases.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/25 hover:-translate-y-0.5">
          <Plus size={16} /> New Lease
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {[['leases', 'Active Leases'], ['terminations', `Termination Requests ${pendingTerminations.length > 0 ? `(${pendingTerminations.length})` : ''}`]].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'leases' && (
        <>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-slate-100" />)}</div>
          ) : leases.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
              <FileText size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No leases yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leases.map(lease => (
                <div key={lease.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <span className="font-bold text-slate-600 text-sm">{lease.tenant_name?.[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{lease.tenant_name}</p>
                        <p className="text-slate-500 text-xs">{lease.property_name} · Unit {lease.unit_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-slate-900 text-sm">KES {Number(lease.rent_amount).toLocaleString()}/mo</p>
                        <p className="text-slate-400 text-xs">{lease.start_date} → {lease.end_date || 'Open-ended'}</p>
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
            <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
              <CheckCircle size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No termination requests</p>
            </div>
          ) : terminations.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-slate-900">{t.tenant_name}</p>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-slate-500 text-xs">{t.property_name} · Unit {t.unit_number}</p>
                  <p className="text-slate-500 text-xs mt-0.5">Requested vacate: <span className="font-medium text-slate-700">{t.requested_vacate_date}</span></p>
                </div>
                {t.unpaid_invoices_count > 0 && (
                  <div className="flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <AlertTriangle size={12} />
                    {t.unpaid_invoices_count} unpaid invoice{t.unpaid_invoices_count !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Reason</p>
                <p className="text-slate-700 text-sm">{t.reason}</p>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                <p className="text-amber-800 text-xs font-semibold flex items-center gap-1.5">
                  <AlertTriangle size={12} /> Deposit Note
                </p>
                <p className="text-amber-700 text-xs mt-1">{t.deposit_note}</p>
              </div>

              {t.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(t.id)}
                    className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <XCircle size={15} /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(t.id)}
                    disabled={t.unpaid_invoices_count > 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
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
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tenant Profile ID</label>
              <input name="tenant" value={form.tenant} onChange={handleChange} required className={inputCls} placeholder="Tenant profile ID" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Unit</label>
              <select name="unit" value={form.unit} onChange={(e) => { const u = vacantUnits.find(u => u.id === e.target.value); setForm({ ...form, unit: e.target.value, rent_amount: u?.rent_amount || '' }) }} required className={inputCls}>
                <option value="">Select a vacant unit</option>
                {vacantUnits.map(u => <option key={u.id} value={u.id}>Unit {u.unit_number} · KES {Number(u.rent_amount).toLocaleString()}/mo</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Rent (KES)</label>
                <input type="number" name="rent_amount" value={form.rent_amount} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Deposit (KES)</label>
                <input type="number" name="deposit_amount" value={form.deposit_amount} onChange={handleChange} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Start Date</label>
                <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">End Date</label>
                <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={inputCls} />
            </div>
            <button type="submit" disabled={creating} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
              {creating ? 'Creating...' : 'Create Lease'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default LandlordLeases