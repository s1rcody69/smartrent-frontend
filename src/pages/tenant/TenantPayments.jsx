import { useState, useEffect } from 'react'
import { useGetInvoicesQuery, useGetPaymentsQuery } from '../../features/payments/paymentsApi'
import { useStkPushMutation } from '../../features/payments/paymentsApi'
import { useGetLeasesQuery } from '../../features/leases/leasesApi'
import { CreditCard, CheckCircle, Clock, AlertCircle, X, Phone, DollarSign, Receipt, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"

function TenantPayments() {
  const { data: invoicesData, isLoading, refetch: refetchInvoices } = useGetInvoicesQuery()
  const { data: paymentsData, refetch: refetchPayments } = useGetPaymentsQuery()
  const { refetch: refetchLeases } = useGetLeasesQuery()
  const [stkPush, { isLoading: paying }] = useStkPushMutation()
  const [payingInvoice, setPayingInvoice] = useState(null)
  const [phone, setPhone] = useState('')
  const [activeTab, setActiveTab] = useState('invoices')
  const [paymentPending, setPaymentPending] = useState(false)

  const invoices = invoicesData?.results || []
  const payments = paymentsData?.results || []
  const pending = invoices.filter(i => i.status === 'pending')
  const paid = invoices.filter(i => i.status === 'paid')

  const handlePay = async (e) => {
    e.preventDefault()
    try {
      await stkPush({ invoice_id: payingInvoice.id, phone_number: phone, amount: payingInvoice.amount }).unwrap()
      toast.success('Check your phone and enter your M-Pesa PIN')
      setPaymentPending(true)
      
      // Poll for updates every 3 seconds for up to 30 seconds
      let attempts = 0
      const maxAttempts = 10
      const interval = setInterval(async () => {
        attempts++
        await refetchInvoices()
        await refetchPayments()
        await refetchLeases()
        
        // Check if invoice is now paid
        const updatedData = await refetchInvoices().unwrap()
        const updatedInvoices = updatedData?.results || []
        const isPaid = updatedInvoices.find(i => i.id === payingInvoice.id)?.status === 'paid'
        
        if (isPaid) {
          clearInterval(interval)
          setPaymentPending(false)
          toast.success('Payment confirmed! Invoice marked as paid.')
          setPayingInvoice(null)
          setPhone('')
        } else if (attempts >= maxAttempts) {
          clearInterval(interval)
          setPaymentPending(false)
          toast.info('Payment still processing. Check your payment history shortly.')
        }
      }, 3000)
      
    } catch (err) {
      toast.error(err.data?.error || 'Payment failed. Try again.')
      setPaymentPending(false)
    }
  }

  const statusIcon = (s) => ({
    paid: <CheckCircle size={14} className="text-success" />,
    pending: <Clock size={14} className="text-warning" />,
    overdue: <AlertCircle size={14} className="text-error" />,
  }[s])

  const statusColor = (s) => ({
    paid: 'bg-success-container text-success',
    pending: 'bg-warning-container text-warning',
    overdue: 'bg-error-container text-error',
  }[s] || 'bg-surface-container-highest text-on-surface-variant')

  return (
    <div className="space-y-8">
      <header>
        <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Payment Management</p>
        <h1 className="text-display-lg text-primary tracking-tight">Payments</h1>
        <p className="text-body-md text-on-surface-variant mt-2">Your invoices and payment history</p>
      </header>

      {/* Payment pending status */}
      {paymentPending && (
        <div className="bg-warning-container border border-warning/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-warning border-t-transparent animate-spin" />
          <p className="text-warning font-medium text-sm">Processing your payment... Please wait.</p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel ambient-shadow rounded-2xl p-5 border border-secondary/20 bg-secondary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning-container">
              <Clock size={18} className="text-warning" />
            </div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Pending</p>
          </div>
          <p className="text-3xl font-black text-warning">{pending.length}</p>
          <p className="text-on-surface-variant text-xs mt-1">
            {pending.length > 0 ? `KES ${pending.reduce((s, i) => s + Number(i.amount), 0).toLocaleString()} due` : 'All clear'}
          </p>
        </div>
        <div className="glass-panel ambient-shadow rounded-2xl p-5 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-success-container">
              <CheckCircle size={18} className="text-success" />
            </div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Paid</p>
          </div>
          <p className="text-3xl font-black text-success">{paid.length}</p>
          <p className="text-on-surface-variant text-xs mt-1">Total invoices paid</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        {[['invoices', 'Invoices'], ['history', 'Payment History']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'invoices' && (
        isLoading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="glass-panel ambient-shadow rounded-2xl h-20 animate-pulse border border-outline-variant/30" />)}</div>
        ) : invoices.length === 0 ? (
          <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
            <CreditCard size={40} className="text-outline mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">No invoices yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5 flex items-center justify-between hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-shadow">
                <div className="flex items-center gap-3">
                  {statusIcon(inv.status)}
                  <div>
                    <p className="font-bold text-on-surface text-sm">{inv.property_name} — Unit {inv.unit_number}</p>
                    <p className="text-on-surface-variant text-xs">{inv.invoice_month}/{inv.invoice_year} · Due {inv.due_date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-black text-on-surface">KES {Number(inv.amount).toLocaleString()}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor(inv.status)}`}>{inv.status_display}</span>
                  </div>
                  {inv.status === 'pending' && (
                    <button 
                      onClick={() => setPayingInvoice(inv)} 
                      disabled={paymentPending}
                      className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
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
          <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
            <CheckCircle size={40} className="text-outline mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">No payments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-success-container flex items-center justify-center">
                    <CheckCircle size={16} className="text-success" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">M-Pesa Payment</p>
                    <p className="text-on-surface-variant text-xs">{p.transaction_code} · {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-black text-on-surface">KES {Number(p.amount).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )
      )}

      {/* STK Push modal */}
      {payingInvoice && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-surface-container-lowest glass-panel rounded-2xl w-full max-w-md shadow-2xl border border-outline-variant/30">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
              <h3 className="font-headline-md text-headline-md text-on-surface">Pay via M-Pesa</h3>
              <button onClick={() => setPayingInvoice(null)} className="text-on-surface-variant hover:text-on-surface transition-colors"><X size={20} /></button>
            </div>
            <div className="px-6 py-5">
              <div className="bg-surface-container-low rounded-lg p-4 mb-5 border border-outline-variant/20">
                <p className="text-xs text-on-surface-variant mb-1">Amount to pay</p>
                <p className="text-2xl font-black text-on-surface">KES {Number(payingInvoice.amount).toLocaleString()}</p>
                <p className="text-on-surface-variant text-xs mt-1">{payingInvoice.property_name} — {payingInvoice.invoice_month}/{payingInvoice.invoice_year}</p>
              </div>
              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">M-Pesa Phone Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="0712345678" className={`${inputCls} pl-10`} />
                  </div>
                </div>
                <button type="submit" disabled={paying || paymentPending} className="w-full bg-secondary hover:bg-secondary/90 text-white py-3.5 rounded-lg font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-secondary/20">
                  {paying || paymentPending ? 'Processing...' : 'Send M-Pesa Request'}
                </button>
                <p className="text-on-surface-variant text-xs text-center">You will receive a PIN prompt on your phone. Enter your M-Pesa PIN to complete payment.</p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantPayments