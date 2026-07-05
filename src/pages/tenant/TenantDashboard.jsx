// import { Routes, Route } from 'react-router-dom'
// import Navbar from '../../components/layout/Navbar'
// import { useSelector } from 'react-redux'

// function TenantDashboard() {
//   const { user } = useSelector(s => s.auth)
//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Navbar />
//       <div className="pt-16">
//         <div className="max-w-7xl mx-auto px-6 py-10">
//           <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.first_name} 👋</h1>
//           <p className="text-slate-500 mt-1">Your tenant dashboard is being built out.</p>
//           <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-6">
//             <p className="text-slate-500 text-sm">Lease details, maintenance requests, and M-Pesa payments coming next.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TenantDashboard
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useGetLeasesQuery } from '../../features/leases/leasesApi'
import { useGetMaintenanceRequestsQuery, useCreateMaintenanceRequestMutation } from '../../features/maintenance/maintenanceApi'
import { useGetInvoicesQuery, useStkPushMutation } from '../../features/payments/paymentsApi'
import { useGetPaymentsQuery } from '../../features/payments/paymentsApi'
import DashboardLayout from '../../components/layout/DashboardLayout'
import {
  LayoutDashboard, FileText, Wrench, CreditCard,
  Home, AlertCircle, Plus, Phone, Calendar,
  CheckCircle2, Clock, XCircle, Send
} from 'lucide-react'
import toast from 'react-hot-toast'

// Sidebar links specific to tenant
const TENANT_LINKS = [
  { to: '/tenant/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/tenant/leases', label: 'My Lease', Icon: FileText },
  { to: '/tenant/maintenance', label: 'Maintenance', Icon: Wrench },
  { to: '/tenant/payments', label: 'Payments', Icon: CreditCard },
]

function StatCard({ label, value, sub, Icon, accent = false, loading }) {
  return (
    <div className={`rounded-2xl p-6 border transition-all hover:shadow-md ${
      accent ? 'bg-amber-500 border-amber-400' : 'bg-white border-slate-100'
    }`}>
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className={`h-4 rounded w-1/2 ${accent ? 'bg-amber-400' : 'bg-slate-200'}`} />
          <div className={`h-8 rounded w-2/3 ${accent ? 'bg-amber-400' : 'bg-slate-200'}`} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-amber-100' : 'text-slate-500'}`}>
              {label}
            </p>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              accent ? 'bg-amber-400/50' : 'bg-slate-100'
            }`}>
              <Icon size={17} className={accent ? 'text-white' : 'text-slate-600'} />
            </div>
          </div>
          <p className={`text-3xl font-black leading-none ${accent ? 'text-white' : 'text-slate-900'}`}>
            {value ?? '—'}
          </p>
          {sub && (
            <p className={`text-xs mt-2 ${accent ? 'text-amber-100' : 'text-slate-400'}`}>{sub}</p>
          )}
        </>
      )}
    </div>
  )
}

function StatusBadge({ status, display }) {
  const colors = {
    active: 'bg-emerald-50 text-emerald-700',
    paid: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    assigned: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-blue-50 text-blue-700',
    failed: 'bg-red-50 text-red-700',
    terminated: 'bg-slate-50 text-slate-600',
    vacant: 'bg-slate-50 text-slate-600',
    occupied: 'bg-emerald-50 text-emerald-700',
    resolved: 'bg-emerald-50 text-emerald-700',
    submitted: 'bg-amber-50 text-amber-700',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-slate-50 text-slate-600'}`}>
      {display || status}
    </span>
  )
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
      <Icon size={40} className="text-slate-300 mx-auto mb-3" />
      <p className="text-slate-700 font-semibold mb-1">{title}</p>
      <p className="text-slate-400 text-sm mb-4">{description}</p>
      {action}
    </div>
  )
}

function NewMaintenanceModal({ isOpen, onClose, unitId }) {
  const [createMaintenance, { isLoading }] = useCreateMaintenanceRequestMutation()
  const [form, setForm] = useState({
    unit: unitId || '',
    title: '',
    description: '',
    category: 'plumbing',
    priority: 'medium',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createMaintenance(form).unwrap()
      toast.success('Maintenance request submitted')
      onClose()
      setForm({ unit: unitId || '', title: '', description: '', category: 'plumbing', priority: 'medium' })
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to submit request')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-lg font-bold text-slate-900 mb-4">New Maintenance Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              required
              placeholder="e.g. Broken window latch"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 h-24 resize-none"
              required
              placeholder="Describe the issue..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              >
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="structural">Structural</option>
                <option value="appliance">Appliance</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={14} />
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TenantDashboardContent() {
  const { user } = useSelector(s => s.auth)
  const { data: leases, isLoading: leasesLoading } = useGetLeasesQuery()
  const { data: maintenance, isLoading: maintenanceLoading } = useGetMaintenanceRequestsQuery()
  const { data: invoices, isLoading: invoicesLoading } = useGetInvoicesQuery()
  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery()
  const [stkPush, { isLoading: stkLoading }] = useStkPushMutation()
  const [maintenanceModal, setMaintenanceModal] = useState(false)
  const [payModal, setPayModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '')

  const activeLease = leases?.results?.find(l => l.status === 'active')
  const pendingInvoices = invoices?.results?.filter(i => i.status === 'pending') || []
  const pendingMaintenance = maintenance?.results?.filter(m => 
    ['submitted', 'assigned', 'in_progress'].includes(m.status)
  ) || []

  const handleStkPush = async (invoiceId) => {
    if (!phoneNumber) {
      toast.error('Please enter your M-Pesa phone number')
      return
    }
    try {
      await stkPush({ invoice_id: invoiceId, phone_number: phoneNumber }).unwrap()
      toast.success('M-Pesa STK push sent! Check your phone.')
      setPayModal(false)
    } catch (err) {
      toast.error(err?.data?.detail || 'M-Pesa payment failed. Try again.')
    }
  }

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-amber-600 text-sm font-semibold mb-1">{greeting}</p>
        <h1 className="text-3xl font-black text-slate-900">{user?.first_name}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {now.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="My Unit"
          value={activeLease?.unit_number || '—'}
          sub={activeLease?.property_name}
          Icon={Home}
          loading={leasesLoading}
        />
        <StatCard
          label="Monthly Rent"
          value={activeLease ? `KES ${Number(activeLease.rent_amount).toLocaleString()}` : '—'}
          sub={activeLease ? `Due: ${new Date(activeLease.end_date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}` : null}
          Icon={CreditCard}
          accent
          loading={leasesLoading}
        />
        <StatCard
          label="Pending Bills"
          value={pendingInvoices.length}
          sub={pendingInvoices.length > 0 ? 'Awaiting payment' : 'All paid'}
          Icon={AlertCircle}
          loading={invoicesLoading}
        />
        <StatCard
          label="Open Requests"
          value={pendingMaintenance.length}
          sub={pendingMaintenance.length > 0 ? 'Awaiting resolution' : 'None'}
          Icon={Wrench}
          loading={maintenanceLoading}
        />
      </div>

      {/* Active Lease */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">My Lease</h2>
        {leasesLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
            <div className="h-3 bg-slate-100 rounded w-1/3" />
          </div>
        ) : activeLease ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{activeLease.property_name}</h3>
                <p className="text-slate-500 text-sm">Unit {activeLease.unit_number}</p>
              </div>
              <StatusBadge status={activeLease.status} display={activeLease.status_display} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs">Rent</p>
                <p className="text-slate-900 font-semibold">KES {Number(activeLease.rent_amount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Deposit</p>
                <p className="text-slate-900 font-semibold">KES {Number(activeLease.deposit_amount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Start Date</p>
                <p className="text-slate-900 font-semibold">{new Date(activeLease.start_date).toLocaleDateString('en-KE')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">End Date</p>
                <p className="text-slate-900 font-semibold">{new Date(activeLease.end_date).toLocaleDateString('en-KE')}</p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Home}
            title="No active lease"
            description="You don't have an active lease yet. Browse available properties."
            action={
              <Link to="/properties" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
                Browse Properties
              </Link>
            }
          />
        )}
      </div>

      {/* Invoices & Pay */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Invoices</h2>
          {pendingInvoices.length > 0 && (
            <button
              onClick={() => setPayModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              <Phone size={14} />
              Pay via M-Pesa
            </button>
          )}
        </div>
        {invoicesLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse space-y-3">
            {[1,2].map(i => <div key={i} className="h-4 bg-slate-100 rounded w-full" />)}
          </div>
        ) : invoices?.results?.length > 0 ? (
          <div className="space-y-3">
            {invoices.results.slice(0, 5).map(inv => (
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
                  {inv.status === 'pending' && (
                    <button
                      onClick={() => setPayModal(true)}
                      className="text-amber-600 hover:text-amber-700 text-xs font-semibold"
                    >
                      Pay now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No invoices"
            description="No invoices have been generated for your account yet."
          />
        )}
      </div>

      {/* Maintenance */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Maintenance Requests</h2>
          <button
            onClick={() => setMaintenanceModal(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            <Plus size={14} />
            New Request
          </button>
        </div>
        {maintenanceLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse space-y-3">
            {[1,2].map(i => <div key={i} className="h-4 bg-slate-100 rounded w-full" />)}
          </div>
        ) : maintenance?.results?.length > 0 ? (
          <div className="space-y-3">
            {maintenance.results.slice(0, 5).map(req => (
              <div key={req.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{req.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{req.property_name} — Unit {req.unit_number}</p>
                  </div>
                  <StatusBadge status={req.status} display={req.status_display} />
                </div>
                <p className="text-xs text-slate-500 mb-2">{req.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <AlertCircle size={12} />
                    {req.priority_display}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wrench size={12} />
                    {req.category_display}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(req.created_at).toLocaleDateString('en-KE')}
                  </span>
                </div>
                {req.landlord_notes && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">Landlord note:</span> {req.landlord_notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Wrench}
            title="No maintenance requests"
            description="Everything looks good! Submit a request if something needs fixing."
          />
        )}
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">Recent Payments</h2>
        {paymentsLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse space-y-3">
            {[1,2].map(i => <div key={i} className="h-4 bg-slate-100 rounded w-full" />)}
          </div>
        ) : payments?.results?.length > 0 ? (
          <div className="space-y-3">
            {payments.results.slice(0, 5).map(p => (
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
        ) : (
          <EmptyState
            icon={CreditCard}
            title="No payments"
            description="Your payment history will appear here once you make a payment."
          />
        )}
      </div>

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
            {pendingInvoices.length > 0 && (
              <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Paying for:</p>
                {pendingInvoices.map(inv => (
                  <p key={inv.id} className="text-sm text-slate-900 font-medium">
                    {inv.property_name} — KES {Number(inv.amount).toLocaleString()}
                  </p>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setPayModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStkPush(pendingInvoices[0]?.id)}
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

      {/* Maintenance Modal */}
      <NewMaintenanceModal
        isOpen={maintenanceModal}
        onClose={() => setMaintenanceModal(false)}
        unitId={activeLease?.unit}
      />
    </div>
  )
}

function TenantDashboard() {
  return (
    <DashboardLayout links={TENANT_LINKS}>
      <TenantDashboardContent />
    </DashboardLayout>
  )
}

export default TenantDashboard