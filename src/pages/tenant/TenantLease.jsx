import { useState } from 'react'
import { useGetLeasesQuery, useCreateTerminationRequestMutation, useGetTerminationRequestsQuery } from '../../features/leases/leasesApi'
import { FileText, AlertTriangle, Clock, CheckCircle, XCircle, X, Home, Calendar, DollarSign, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"

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

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="glass-panel ambient-shadow rounded-2xl p-8 w-full max-w-2xl animate-pulse border border-outline-variant/30">
        <div className="h-8 bg-surface-container rounded w-32 mb-4" />
        <div className="h-4 bg-surface-container rounded w-48 mb-6" />
        <div className="h-48 bg-surface-container rounded-2xl" />
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <header>
        <p className="text-label-md text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Lease Management</p>
        <h1 className="text-display-lg text-display-lg text-primary tracking-tight">My Lease</h1>
        <p className="text-body-md text-body-md text-on-surface-variant mt-2">Your current and past lease agreements</p>
      </header>

      {!activeLease ? (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
          <FileText size={40} className="text-outline mx-auto mb-3" />
          <p className="text-on-surface-variant font-medium">No active lease found</p>
        </div>
      ) : (
        <>
          {/* Active lease card - ALL TEXT WHITE */}
          <div className="bg-primary-container rounded-2xl p-7 border border-white/10 shadow-lg">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-1">Active Lease</p>
                <h2 className="text-secondary font-bold text-xl">{activeLease.property_name}</h2>
                <p className="text-secondary/90 text-sm mt-0.5">Unit {activeLease.unit_number}</p>
              </div>
              <span className="bg-success/20 text-success text-xs font-bold px-3 py-1.5 rounded-full border border-success/30">Active</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ['Monthly Rent', `KES ${Number(activeLease.rent_amount).toLocaleString()}`],
                ['Deposit', `KES ${Number(activeLease.deposit_amount).toLocaleString()}`],
                ['Start Date', activeLease.start_date],
                ['End Date', activeLease.end_date || 'Open-ended'],
              ].map(([label, value]) => (
                <div key={label} className="bg-white/10 rounded-lg p-3 border border-white/5">
                  <p className="text-secondary/70 text-xs mb-1">{label}</p>
                  <p className="text-secondary font-bold text-sm">{value}</p>
                </div>
              ))}
            </div>
            {activeLease.notes && (
              <div className="mt-4 bg-white/10 rounded-lg p-3 border border-white/5">
                <p className="text-white/70 text-xs mb-1">Notes</p>
                <p className="text-white text-sm">{activeLease.notes}</p>
              </div>
            )}
          </div>

          {/* Deposit forfeiture warning */}
          <div className="bg-warning-container border border-warning/20 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-warning text-sm">Security Deposit Policy</p>
              <p className="text-warning/80 text-xs mt-1">Your security deposit of KES {Number(activeLease.deposit_amount).toLocaleString()} is non-refundable in the event of early lease termination. All outstanding invoices must be settled before any termination can be approved.</p>
            </div>
          </div>

          {/* Termination section */}
          {pendingTermination ? (
            <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-warning" />
                <h3 className="font-headline-md text-headline-md text-on-surface">Termination Request Pending</h3>
              </div>
              <p className="text-on-surface-variant text-sm mb-3">Your request to vacate by <strong className="text-on-surface">{pendingTermination.requested_vacate_date}</strong> is under review.</p>
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-xs text-on-surface-variant mb-1">Your reason</p>
                <p className="text-on-surface text-sm">{pendingTermination.reason}</p>
              </div>
              <div className="mt-3 bg-warning-container border border-warning/20 rounded-lg p-3">
                <p className="text-warning text-xs">{pendingTermination.deposit_note}</p>
              </div>
            </div>
          ) : (
            !showTermForm ? (
              <button
                onClick={() => setShowTermForm(true)}
                className="flex items-center gap-2 border border-error/30 text-error hover:bg-error-container px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                <XCircle size={16} /> Request Early Termination
              </button>
            ) : (
              <div className="glass-panel ambient-shadow rounded-2xl border border-error/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Request Early Termination</h3>
                  <button onClick={() => setShowTermForm(false)} className="text-on-surface-variant hover:text-on-surface transition-colors"><X size={18} /></button>
                </div>
                <div className="bg-error-container border border-error/20 rounded-lg p-4 mb-5">
                  <p className="text-error text-xs font-semibold flex items-center gap-1.5"><AlertTriangle size={12} /> Important</p>
                  <p className="text-error/80 text-xs mt-1">Your deposit is non-refundable on early termination. All outstanding invoices must be paid before this request can be approved.</p>
                </div>
                <form onSubmit={handleTermSubmit} className="space-y-4">
                  <div>
                    <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Reason for leaving</label>
                    <textarea value={termForm.reason} onChange={e => setTermForm({ ...termForm, reason: e.target.value })} required rows={3} className={inputCls} placeholder="Please explain why you need to vacate early..." />
                  </div>
                  <div>
                    <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Requested vacate date</label>
                    <input type="date" value={termForm.requested_vacate_date} onChange={e => setTermForm({ ...termForm, requested_vacate_date: e.target.value })} required className={inputCls} />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowTermForm(false)} className="flex-1 border border-outline-variant text-on-surface-variant py-2.5 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors">Cancel</button>
                    <button type="submit" disabled={submitting} className="flex-1 bg-error hover:bg-error/90 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors">
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
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Past Leases</h3>
          <div className="space-y-3">
            {allLeases.filter(l => l.status !== 'active').map(l => (
              <div key={l.id} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
                <div>
                  <p className="font-semibold text-on-surface text-sm">{l.property_name} — Unit {l.unit_number}</p>
                  <p className="text-on-surface-variant text-xs">{l.start_date} → {l.end_date}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${l.status === 'terminated' ? 'bg-error-container text-error' : 'bg-surface-container-highest text-on-surface-variant'}`}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantLease