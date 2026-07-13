import { useGetInvoicesQuery, useGetPaymentsQuery } from '../../features/payments/paymentsApi'
import { CreditCard, CheckCircle, Clock, AlertCircle, DollarSign, Receipt, Calendar, Phone } from 'lucide-react'
import { useState } from 'react'

function AdminPayments() {
  const { data: invoicesData, isLoading } = useGetInvoicesQuery()
  const { data: paymentsData } = useGetPaymentsQuery()
  const [activeTab, setActiveTab] = useState('invoices')

  const invoices = invoicesData?.results || []
  const payments = paymentsData?.results || []

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount), 0)
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + Number(i.amount), 0)

  const statusColor = (s) => ({
    paid: 'bg-success-container text-success',
    pending: 'bg-warning-container text-warning',
    overdue: 'bg-error-container text-error',
    cancelled: 'bg-surface-container-highest text-on-surface-variant',
  }[s] || 'bg-surface-container-highest text-on-surface-variant')

  const statusIcon = (s) => ({
    paid: <CheckCircle size={14} className="text-success" />,
    pending: <Clock size={14} className="text-warning" />,
    overdue: <AlertCircle size={14} className="text-error" />,
  }[s])

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-label-md text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Payment Management</p>
          <h2 className="text-display-lg text-display-lg text-primary tracking-tight">All Payments</h2>
          <p className="text-body-md text-body-md text-on-surface-variant mt-2">Platform-wide invoices and payment history</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-panel ambient-shadow rounded-2xl p-6 border border-secondary/20 bg-secondary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-secondary/10">
              <DollarSign size={18} className="text-secondary" />
            </div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide">Total Revenue</p>
          </div>
          <p className="text-3xl font-black text-on-surface">KES {totalRevenue.toLocaleString()}</p>
        </div>

        <div className="glass-panel ambient-shadow rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning-container">
              <Clock size={18} className="text-warning" />
            </div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Pending</p>
          </div>
          <p className="text-3xl font-black text-warning">KES {pendingAmount.toLocaleString()}</p>
        </div>

        <div className="glass-panel ambient-shadow rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-surface-container">
              <Receipt size={18} className="text-on-surface-variant" />
            </div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Total Transactions</p>
          </div>
          <p className="text-3xl font-black text-on-surface">{payments.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        {[['invoices', 'Invoices'], ['payments', 'Transactions']].map(([tab, label]) => (
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

      {/* Invoices Table */}
      {activeTab === 'invoices' && (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="grid grid-cols-5 bg-surface-container-low border-b border-outline-variant/30 px-6 py-3">
            {['Tenant', 'Property', 'Period', 'Amount', 'Status'].map(h => (
              <p key={h} className="text-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</p>
            ))}
          </div>
          {isLoading ? (
            <div className="space-y-px">
              {[1,2,3].map(i => (
                <div key={i} className="h-14 animate-pulse bg-surface-container-low mx-6 my-2 rounded-xl" />
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-16 text-center">
              <Receipt size={32} className="text-outline mx-auto mb-2" />
              <p className="text-on-surface-variant text-sm">No invoices yet</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {invoices.map(inv => (
                <div key={inv.id} className="grid grid-cols-5 px-6 py-4 hover:bg-surface-container-low transition-colors items-center">
                  <p className="text-sm font-semibold text-on-surface">{inv.tenant_name}</p>
                  <div>
                    <p className="text-sm text-on-surface">{inv.property_name}</p>
                    <p className="text-xs text-on-surface-variant">Unit {inv.unit_number}</p>
                  </div>
                  <p className="text-sm text-on-surface-variant">{inv.invoice_month}/{inv.invoice_year}</p>
                  <p className="text-sm font-bold text-on-surface">KES {Number(inv.amount).toLocaleString()}</p>
                  <div className="flex items-center gap-1.5">
                    {statusIcon(inv.status)}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor(inv.status)}`}>
                      {inv.status_display}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payments Table */}
      {activeTab === 'payments' && (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="grid grid-cols-4 bg-surface-container-low border-b border-outline-variant/30 px-6 py-3">
            {['Transaction Code', 'Phone', 'Amount', 'Date'].map(h => (
              <p key={h} className="text-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</p>
            ))}
          </div>
          {payments.length === 0 ? (
            <div className="py-16 text-center">
              <CreditCard size={32} className="text-outline mx-auto mb-2" />
              <p className="text-on-surface-variant text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/20">
              {payments.map(p => (
                <div key={p.id} className="grid grid-cols-4 px-6 py-4 hover:bg-surface-container-low transition-colors items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success shrink-0" />
                    <p className="text-sm font-mono text-on-surface truncate">{p.transaction_code || '—'}</p>
                  </div>
                  <p className="text-sm text-on-surface-variant">{p.phone_number}</p>
                  <p className="text-sm font-black text-on-surface">KES {Number(p.amount).toLocaleString()}</p>
                  <p className="text-sm text-on-surface-variant">{new Date(p.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPayments