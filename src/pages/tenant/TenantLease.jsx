import { useState } from 'react'
import { useGetLeasesQuery, useCreateTerminationRequestMutation, useGetTerminationRequestsQuery } from '../../features/leases/leasesApi'
import { FileText, AlertTriangle, Clock, CheckCircle, XCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"

function TenantLease() {
  const { data: leasesData, isLoading } = useGetLeasesQuery()
  const { data: terminationsData } = useGetTerminationRequestsQuery()
  const [createTermination, { isLoading: submitting }] = useCreateTerminationRequestMutation()
  const [showTermForm, setShowTermForm] = useState(false)
  const [termForm, setTermForm] = useState({ reason: '', requested_vacate_date: '' })

  const activeLease = leasesData?.results?.find(l => l.status === 'active')
  const allLeases = leasesData?.results || []
  const terminations = terminationsData?.results || []
  const pendingTermination = terminations.find(t => t.status === 'pending')

  const handleTermSubmit = async (e) => {
    e.preventDefault()
    try {
      await createTermination({ lease: activeLease.id, ...termForm }).unwrap()
      toast.success('Termination request submitted. Your landlord will review it.')
      setShowTermForm(false)
      setTermForm({ reason: '', requested_vacate_date: '' })
    } catch (err) {
      toast.error(err.data?.error || Object.values(err.data || {})[0]?.[0] || 'Failed to submit')
    }
  }

  if (isLoading) return <div className="p-8"><div className="bg-white rounded-2xl h-48 animate-pulse border border-slate-100" /></div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">My Lease</h1>
        <p className="text-slate-500 text-sm mt-1">Your current and past lease agreements</p>
      </div>

      {!activeLease ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <FileText size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No active lease found</p>
        </div>
      ) : (
        <>
          {/* Active lease card */}
          <div className="bg-slate-900 rounded-2xl p-7 mb-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">Active Lease</p>
                <h2 className="text-white font-bold text-xl">{activeLease.property_name}</h2>
                <p className="text-slate-400 text-sm mt-0.5">Unit {activeLease.unit_number}</p>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/30">Active</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ['Monthly Rent', `KES ${Number(activeLease.rent_amount).toLocaleString()}`],
                ['Deposit', `KES ${Number(activeLease.deposit_amount).toLocaleString()}`],
                ['Start Date', activeLease.start_date],
                ['End Date', activeLease.end_date || 'Open-ended'],
              ].map(([label, value]) => (
                <div key={label} className="bg-white/5 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">{label}</p>
                  <p className="text-white font-bold text-sm">{value}</p>
                </div>
              ))}
            </div>
            {activeLease.notes && (
              <div className="mt-4 bg-white/5 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Notes</p>
                <p className="text-slate-300 text-sm">{activeLease.notes}</p>
              </div>
            )}
          </div>

          {/* Deposit forfeiture warning */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-5 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Security Deposit Policy</p>
              <p className="text-amber-700 text-xs mt-1">Your security deposit of KES {Number(activeLease.deposit_amount).toLocaleString()} is non-refundable in the event of early lease termination. All outstanding invoices must be settled before any termination can be approved.</p>
            </div>
          </div>

          {/* Termination section */}
          {pendingTermination ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-amber-500" />
                <h3 className="font-bold text-slate-900">Termination Request Pending</h3>
              </div>
              <p className="text-slate-500 text-sm mb-3">Your request to vacate by <strong>{pendingTermination.requested_vacate_date}</strong> is under review.</p>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Your reason</p>
                <p className="text-slate-700 text-sm">{pendingTermination.reason}</p>
              </div>
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-amber-700 text-xs">{pendingTermination.deposit_note}</p>
              </div>
            </div>
          ) : (
            !showTermForm ? (
              <button
                onClick={() => setShowTermForm(true)}
                className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                <XCircle size={16} /> Request Early Termination
              </button>
            ) : (
              <div className="bg-white rounded-2xl border border-red-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Request Early Termination</h3>
                  <button onClick={() => setShowTermForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                  <p className="text-red-700 text-xs font-semibold flex items-center gap-1.5"><AlertTriangle size={12} /> Important</p>
                  <p className="text-red-600 text-xs mt-1">Your deposit is non-refundable on early termination. All outstanding invoices must be paid before this request can be approved.</p>
                </div>
                <form onSubmit={handleTermSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Reason for leaving</label>
                    <textarea value={termForm.reason} onChange={e => setTermForm({ ...termForm, reason: e.target.value })} required rows={3} className={inputCls} placeholder="Please explain why you need to vacate early..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Requested vacate date</label>
                    <input type="date" value={termForm.requested_vacate_date} onChange={e => setTermForm({ ...termForm, requested_vacate_date: e.target.value })} required className={inputCls} />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowTermForm(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50">Cancel</button>
                    <button type="submit" disabled={submitting} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            )
          )}
        </>
      )}

      {/* Past leases */}
      {allLeases.filter(l => l.status !== 'active').length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Past Leases</h3>
          <div className="space-y-3">
            {allLeases.filter(l => l.status !== 'active').map(l => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{l.property_name} — Unit {l.unit_number}</p>
                  <p className="text-slate-400 text-xs">{l.start_date} → {l.end_date}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${l.status === 'terminated' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantLease