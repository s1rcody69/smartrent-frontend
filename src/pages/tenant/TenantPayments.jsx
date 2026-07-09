import { useState } from 'react'
import { useGetInvoicesQuery, useStkPushMutation } from '../../features/payments/paymentsApi'
import { useGetPaymentsQuery } from '../../features/payments/paymentsApi'
import { CreditCard, FileText, Phone, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

function StatusBadge({ status, display }) {
  const colors = {
    paid: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    failed: 'bg-red-50 text-red-700',
    overdue: 'bg-red-50 text-red-600',
    cancelled: 'bg-slate-100 text-slate-500',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-slate-50 text-slate-600'}`}>
      {display || status}
    </span>
  )
}

function TenantPayments() {
  const { data: invoices, isLoading: invoicesLoading } = useGetInvoicesQuery()
  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery()
  const [stkPush, { isLoading: stkLoading }] = useStkPushMutation()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [payModal, setPayModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const invoiceList = invoices?.results || []
  const paymentList = payments?.results || []
  const pendingInvoices = invoiceList.filter(i => i.status === 'pending')

  const totalPaid = paymentList
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const handleStkPush = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your M-Pesa phone number')
      return
    }
    try {
      await stkPush({ invoice_id: selectedInvoice, phone_number: phoneNumber }).unwrap()
      toast.success('M-Pesa STK push sent! Check your phone.')
      setPayModal(false)
      setPhoneNumber('')
      setSelectedInvoice(null)
    } catch (err) {
      toast.error(err?.data?.detail || 'M-Pesa payment failed. Try again.')
    }
  }

  if (invoicesLoading || paymentsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl h-24 animate-pulse border border-slate-100" />
            <div className="bg-white rounded-2xl h-24 animate-pulse border border-slate-100" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Payments</h1>
        <p className="text-slate-500 text-sm mt-1">View your invoices and payment history</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Paid</p>
          <p className="text-2xl font-black text-slate-900">KES {totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Pending Invoices</p>
          <p className="text-2xl font-black text-amber-600">{pendingInvoices.length}</p>
        </div>
      </div>

      {/* Pending Invoices */}
      {pendingInvoices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4">Pending Invoices</h2>
          <div className="space-y-3">
            {pendingInvoices.map(inv => (
              <div key={inv.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{inv.property_name} — Unit {inv.unit_number}</p>
                  <p className="text-xs text-slate-400">
                    Due: {new Date(inv.due_date).toLocaleDateString('en-KE')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-slate-900">KES {Number(inv.amount).toLocaleString()}</p>
                  <StatusBadge status={inv.status} display={inv.status_display} />
                  <button
                    onClick={() => {
                      setSelectedInvoice(inv.id)
                      setPayModal(true)
                    }}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Phone size={14} />
                    Pay now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice History */}
      {invoiceList.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4">Invoice History</h2>
          <div className="space-y-3">
            {invoiceList.filter(i => i.status !== 'pending').map(inv => (
              <div key={inv.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{inv.property_name} — Unit {inv.unit_number}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(inv.due_date).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-slate-900">KES {Number(inv.amount).toLocaleString()}</p>
                  <StatusBadge status={inv.status} display={inv.status_display} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {invoiceList.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <FileText size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No invoices yet</p>
        </div>
      )}

      {/* Payment History */}
      {paymentList.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">Payment History</h2>
          <div className="space-y-3">
            {paymentList.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">KES {Number(p.amount).toLocaleString()}</p>
                  <p className="text-xs text-slate-400">
                    {p.payment_method_display} • {new Date(p.created_at).toLocaleDateString('en-KE')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {p.transaction_code && (
                    <span className="text-xs text-slate-400 font-mono">{p.transaction_code}</span>
                  )}
                  <StatusBadge status={p.status} display={p.status_display} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Pay via M-Pesa</h2>
            <p className="text-sm text-slate-500 mb-4">
              Enter your M-Pesa phone number to receive an STK push.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254712345678"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPayModal(false)
                  setPhoneNumber('')
                  setSelectedInvoice(null)
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStkPush}
                disabled={stkLoading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Phone size={14} />
                {stkLoading ? 'Sending...' : 'Send STK Push'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantPayments