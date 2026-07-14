import { useState } from 'react'
import { useGetInvoicesQuery, useCreateInvoiceMutation, useGetPaymentsQuery } from '../../features/payments/paymentsApi'
import { useGetLeasesQuery } from '../../features/leases/leasesApi'
import { Plus, X, CreditCard, FileText, CheckCircle, Clock, AlertCircle, DollarSign, Receipt, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"

function LandlordPayments() {
  const { data: invoicesData, isLoading } = useGetInvoicesQuery()
  const { data: paymentsData } = useGetPaymentsQuery()
  const { data: leasesData } = useGetLeasesQuery()
  const [createInvoice, { isLoading: creating }] = useCreateInvoiceMutation()
  const [showCreate, setShowCreate] = useState(false)
  const [activeTab, setActiveTab] = useState('invoices')
  const [form, setForm] = useState({ lease: '', amount: '', due_date: '', invoice_month: new Date().getMonth() + 1, invoice_year: new Date().getFullYear() })

  const invoices = invoicesData?.results || []
  const payments = paymentsData?.results || []
  const pendingLeases = (leasesData?.results || []).filter(l => l.status === 'pending')

  const statusColor = (s) => ({
    pending: 'bg-warning-container text-warning',
    paid: 'bg-success-container text-success',
    overdue: 'bg-error-container text-error',
    cancelled: 'bg-surface-container-highest text-on-surface-variant',
  }[s] || 'bg-surface-container-highest text-on-surface-variant')

  const statusIcon = (s) => ({
    paid: <CheckCircle size={14} className="text-success" />,
    pending: <Clock size={14} className="text-warning" />,
    overdue: <AlertCircle size={14} className="text-error" />,
  }[s] || null)

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createInvoice(form).unwrap()
      toast.success('Invoice created')
      setShowCreate(false)
      setForm({ lease: '', amount: '', due_date: '', invoice_month: new Date().getMonth() + 1, invoice_year: new Date().getFullYear() })
    } catch (err) {
      toast.error(err.data?.error || 'Failed to create invoice')
    }
  }

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0)
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + Number(i.amount), 0)

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Payment Management</p>
          <h1 className="text-display-lg text-primary tracking-tight">Payments</h1>
          <p className="text-body-md text-on-surface-variant mt-2">Invoices and payment history</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5">
          <Plus size={16} /> Create Invoice
        </button>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-success-container">
              <DollarSign size={18} className="text-success" />
            </div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Total Collected</p>
          </div>
          <p className="text-3xl font-black text-on-surface">KES {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning-container">
              <Clock size={18} className="text-warning" />
            </div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Pending Amount</p>
          </div>
          <p className="text-3xl font-black text-warning">KES {pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        {[['invoices', 'Invoices'], ['payments', 'Payment History']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'invoices' && (
        isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass-panel ambient-shadow rounded-2xl h-20 animate-pulse border border-outline-variant/30" />)}</div>
        ) : invoices.length === 0 ? (
          <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
            <FileText size={40} className="text-outline mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">No invoices yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5 flex items-center justify-between hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-shadow">
                <div className="flex items-center gap-3">
                  {statusIcon(inv.status)}
                  <div>
                    <p className="font-bold text-on-surface text-sm">{inv.tenant_name}</p>
                    <p className="text-on-surface-variant text-xs">{inv.property_name} · Unit {inv.unit_number} · {inv.invoice_month}/{inv.invoice_year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-on-surface">KES {Number(inv.amount).toLocaleString()}</p>
                    <p className="text-on-surface-variant text-xs">Due {inv.due_date}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor(inv.status)}`}>{inv.status_display}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'payments' && (
        payments.length === 0 ? (
          <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
            <CreditCard size={40} className="text-outline mx-auto mb-3" />
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
                    <p className="font-bold text-on-surface text-sm">M-Pesa · {p.phone_number}</p>
                    <p className="text-on-surface-variant text-xs">{p.transaction_code} · {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-black text-on-surface">KES {Number(p.amount).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-surface-container-lowest glass-panel rounded-2xl w-full max-w-lg shadow-2xl border border-outline-variant/30">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
              <h3 className="font-headline-md text-headline-md text-on-surface">Create Invoice</h3>
              <button onClick={() => setShowCreate(false)} className="text-on-surface-variant hover:text-on-surface transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Lease</label>
                <select
                  name="lease"
                  value={form.lease}
                  onChange={e => {
                    const l = pendingLeases.find(l => l.id === e.target.value)
                    setForm({ ...form, lease: e.target.value, amount: l?.rent_amount || '' })
                  }}
                  required
                  className={inputCls}
                >
                  <option value="">Select pending lease</option>
                  {pendingLeases.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.tenant_name} · {l.property_name} Unit {l.unit_number}
                    </option>
                  ))}
                </select>
                {pendingLeases.length === 0 && (
                  <p className="text-xs text-warning mt-1">No pending leases available.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Amount (KES)</label>
                  <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Due Date</label>
                  <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} required className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Month</label>
                  <input type="number" min={1} max={12} value={form.invoice_month} onChange={e => setForm({ ...form, invoice_month: e.target.value })} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Year</label>
                  <input type="number" value={form.invoice_year} onChange={e => setForm({ ...form, invoice_year: e.target.value })} required className={inputCls} />
                </div>
              </div>
              <button type="submit" disabled={creating} className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-lg font-bold text-sm disabled:opacity-50 transition-all">
                {creating ? 'Creating...' : 'Create Invoice'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandlordPayments