import { useState } from 'react'
import { useGetMaintenanceRequestsQuery, useCreateMaintenanceRequestMutation } from '../../features/maintenance/maintenanceApi'
import { Plus, X, Wrench, Zap, AlertTriangle, Clock, CheckCircle, Filter, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"

function TenantMaintenance() {
  const { data, isLoading } = useGetMaintenanceRequestsQuery()
  const [createRequest, { isLoading: creating }] = useCreateMaintenanceRequestMutation()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: 'plumbing', priority: 'medium' })

  const requests = data?.results || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createRequest(form).unwrap()
      toast.success('Maintenance request submitted')
      setShowForm(false)
      setForm({ title: '', description: '', category: 'plumbing', priority: 'medium' })
    } catch (err) {
      toast.error(err.data?.error || err.data?.non_field_errors?.[0] || 'Failed to submit request')
    }
  }

  const priorityIcon = (p) => ({
    emergency: <Zap size={14} className="text-error" />,
    high: <AlertTriangle size={14} className="text-warning" />,
    medium: <Clock size={14} className="text-secondary" />,
    low: <CheckCircle size={14} className="text-on-surface-variant" />,
  }[p])

  const statusColor = (s) => ({
    pending: 'bg-warning-container text-warning',
    assigned: 'bg-secondary/10 text-secondary',
    in_progress: 'bg-secondary/10 text-secondary',
    completed: 'bg-success-container text-success',
  }[s] || 'bg-surface-container-highest text-on-surface-variant')

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Maintenance Management</p>
          <h1 className="text-display-lg text-primary tracking-tight">Maintenance</h1>
          <p className="text-body-md text-on-surface-variant mt-2">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5">
          <Plus size={16} /> New Request
        </button>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="glass-panel ambient-shadow rounded-2xl h-20 animate-pulse border border-outline-variant/30" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
          <Wrench size={40} className="text-outline mx-auto mb-3" />
          <p className="text-on-surface-variant font-medium">No maintenance requests</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-secondary hover:underline text-sm font-semibold">Submit your first request →</button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5 hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{priorityIcon(r.priority)}</div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{r.title}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">{r.category_display} · {new Date(r.created_at).toLocaleDateString()}</p>
                    <p className="text-on-surface-variant text-xs mt-1 line-clamp-1">{r.description}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ml-3 ${statusColor(r.status)}`}>{r.status_display}</span>
              </div>
              {r.landlord_notes && (
                <div className="mt-3 bg-surface-container-low rounded-lg px-4 py-2.5 border border-outline-variant/20">
                  <p className="text-xs text-on-surface-variant mb-0.5">Landlord note</p>
                  <p className="text-on-surface text-xs">{r.landlord_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-surface-container-lowest glass-panel rounded-2xl w-full max-w-lg shadow-2xl border border-outline-variant/30">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
              <h3 className="font-headline-md text-headline-md text-on-surface">New Maintenance Request</h3>
              <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-on-surface transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className={inputCls} placeholder="e.g. Leaking pipe in bathroom" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    {['plumbing','electrical','structural','appliances','security','cleaning','other'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className={inputCls}>
                    {['low','medium','high','emergency'].map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3} className={inputCls} placeholder="Describe the issue in detail..." />
              </div>
              <button type="submit" disabled={creating} className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-lg font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-secondary/20">
                {creating ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TenantMaintenance