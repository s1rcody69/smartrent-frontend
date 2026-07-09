import { useState } from 'react'
import { useGetInvoicesQuery, useGetPaymentsQuery } from '../../features/payments/paymentsApi'
import { useStkPushMutation } from '../../features/payments/paymentsApi'
import { CreditCard, CheckCircle, Clock, AlertCircle, X, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"

function TenantPayments() {
  const { data: invoicesData, isLoading } = useGetInvoicesQuery()
  const { data: paymentsData } = useGetPaymentsQuery()
  const [stkPush, { isLoading: paying }] = useStkPushMutation()
  const [payingInvoice, setPayingInvoice] = useState(null)
  const [phone, setPhone] = useState('')
  const [activeTab, setActiveTab] = useState('invoices')

  const invoices = invoicesData?.results || []
  const payments = paymentsData?.results || []
  const pending = invoices.filter(i => i.status === 'pending')
  const paid = invoices.filter(i => i.status === 'paid')

  const handlePay = async (e) => {
    e.preventDefault()
    try {
      await stkPush({ invoice_id: payingInvoice.id, phone_number: phone, amount: payingInvoice.amount }).unwrap()
      toast.success('Check your phone and enter your M-Pesa PIN')
      setPayingInvoice(null)
      setPhone('')
    } catch (err) {
      toast.error(err.data?.error || 'Payment failed. Try again.')
    }
  }

  const statusIcon = (s) => ({
    paid: <CheckCircle size={14} className="text-emerald-500" />,
    pending: <Clock size={14} className="text-amber-500" />,
    overdue: <AlertCircle size={14} className="text-red-500" />,
  }[s])

  const statusColor = (s) => ({
    paid: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    overdue: 'bg-red-50 text-red-600',
  }[s] || 'bg-slate-100 text-slate-600')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Payments</h1>
        <p className="text-slate-500 text-sm mt-1">Your invoices and payment history</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-500 rounded-2xl p-5">
          <p className="text-amber-100 text-xs font-semibold uppercase tracking-wide mb-2">Pending</p>
          <p className="text-white text-3xl font-black">{pending.length}</p>
          <p className="text-amber-100 text-xs mt-1">
            {pending.length > 0 ? `KES ${pending.reduce((s, i) => s + Number(i.amount), 0).toLocaleString()} due` : 'All clear'}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Paid</p>
          <p className="text-slate-900 text-3xl font-black">{paid.length}</p>
          <p className="text-slate-400 text-xs mt-1">Total invoices paid</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {[['invoices', 'Invoices'], ['history', 'Payment History']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'invoices' && (
        isLoading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-slate-100" />)}</div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <CreditCard size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No invoices yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  {statusIcon(inv.status)}
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{inv.property_name} — Unit {inv.unit_number}</p>
                    <p className="text-slate-400 text-xs">{inv.invoice_month}/{inv.invoice_year} · Due {inv.due_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-black text-slate-900">KES {Number(inv.amount).toLocaleString()}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(inv.status)}`}>{inv.status_display}</span>
                  </div>
                  {inv.status === 'pending' && (
                    <button onClick={() => setPayingInvoice(inv)} className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
                      Pay now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'history' && (
        payments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <CheckCircle size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No payments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <CheckCircle size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">M-Pesa Payment</p>
                    <p className="text-slate-400 text-xs">{p.transaction_code} · {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-black text-slate-900">KES {Number(p.amount).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )
      )}

      {/* STK Push modal */}
      {payingInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Pay via M-Pesa</h3>
              <button onClick={() => setPayingInvoice(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="px-6 py-5">
              <div className="bg-slate-50 rounded-xl p-4 mb-5">
                <p className="text-xs text-slate-400 mb-1">Amount to pay</p>
                <p className="text-2xl font-black text-slate-900">KES {Number(payingInvoice.amount).toLocaleString()}</p>
                <p className="text-slate-400 text-xs mt-1">{payingInvoice.property_name} — {payingInvoice.invoice_month}/{payingInvoice.invoice_year}</p>
              </div>
              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">M-Pesa Phone Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="0712345678" className={`${inputCls} pl-10`} />
                  </div>
                </div>
                <button type="submit" disabled={paying} className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
                  {paying ? 'Sending STK Push...' : 'Send M-Pesa Request'}
                </button>
                <p className="text-slate-400 text-xs text-center">You will receive a PIN prompt on your phone. Enter your M-Pesa PIN to complete payment.</p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantPayments