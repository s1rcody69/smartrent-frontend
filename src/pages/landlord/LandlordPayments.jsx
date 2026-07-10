import { useState } from 'react'
import { useGetInvoicesQuery, useCreateInvoiceMutation, useGetPaymentsQuery } from '../../features/payments/paymentsApi'
import { useGetLeasesQuery } from '../../features/leases/leasesApi'
import { Plus, X, CreditCard, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"

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
  // 👇 CHANGED: Show pending leases instead of active leases
  const pendingLeases = (leasesData?.results || []).filter(l => l.status === 'pending')

  const statusColor = (s) => ({
    pending: 'bg-amber-50 text-amber-700',
    paid: 'bg-emerald-50 text-emerald-700',
    overdue: 'bg-red-50 text-red-600',
    cancelled: 'bg-slate-100 text-slate-500',
  }[s] || 'bg-slate-100 text-slate-600')

  const statusIcon = (s) => ({
    paid: <CheckCircle size={14} className="text-emerald-500" />,
    pending: <Clock size={14} className="text-amber-500" />,
    overdue: <AlertCircle size={14} className="text-red-500" />,
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Payments</h1>
          <p className="text-slate-500 text-sm mt-1">Invoices and payment history</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/25 hover:-translate-y-0.5">
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Collected</p>
          <p className="text-2xl font-black text-slate-900">KES {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Pending Amount</p>
          <p className="text-2xl font-black text-amber-600">KES {pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {[['invoices', 'Invoices'], ['payments', 'Payment History']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'invoices' && (
        isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-slate-100" />)}</div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <FileText size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No invoices yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map(inv => (
              <div key={inv.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  {statusIcon(inv.status)}
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{inv.tenant_name}</p>
                    <p className="text-slate-500 text-xs">{inv.property_name} · Unit {inv.unit_number} · {inv.invoice_month}/{inv.invoice_year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-slate-900">KES {Number(inv.amount).toLocaleString()}</p>
                    <p className="text-slate-400 text-xs">Due {inv.due_date}</p>
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
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <CreditCard size={40} className="text-slate-300 mx-auto mb-3" />
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
                    <p className="font-bold text-slate-900 text-sm">M-Pesa · {p.phone_number}</p>
                    <p className="text-slate-400 text-xs">{p.transaction_code} · {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-black text-slate-900">KES {Number(p.amount).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Create Invoice</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Lease</label>
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
                  <p className="text-xs text-amber-600 mt-1">No pending leases available.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Amount (KES)</label>
                  <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Due Date</label>
                  <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} required className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Month</label>
                  <input type="number" min={1} max={12} value={form.invoice_month} onChange={e => setForm({ ...form, invoice_month: e.target.value })} required className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Year</label>
                  <input type="number" value={form.invoice_year} onChange={e => setForm({ ...form, invoice_year: e.target.value })} required className={inputCls} />
                </div>
              </div>
              <button type="submit" disabled={creating} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
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