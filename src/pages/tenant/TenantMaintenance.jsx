import { useState } from 'react'
import { useGetMaintenanceRequestsQuery, useCreateMaintenanceRequestMutation } from '../../features/maintenance/maintenanceApi'
import { Plus, X, Wrench, Zap, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"

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
    emergency: <Zap size={14} className="text-red-500" />,
    high: <AlertTriangle size={14} className="text-amber-500" />,
    medium: <Clock size={14} className="text-blue-500" />,
    low: <CheckCircle size={14} className="text-slate-400" />,
  }[p])

  const statusColor = (s) => ({
    pending: 'bg-amber-50 text-amber-700',
    assigned: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-purple-50 text-purple-700',
    completed: 'bg-emerald-50 text-emerald-700',
  }[s] || 'bg-slate-100 text-slate-600')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Maintenance</h1>
          <p className="text-slate-500 text-sm mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/25 hover:-translate-y-0.5">
          <Plus size={16} /> New Request
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-slate-100" />)}</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <Wrench size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No maintenance requests</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-amber-600 text-sm font-semibold">Submit your first request →</button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{priorityIcon(r.priority)}</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{r.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{r.category_display} · {new Date(r.created_at).toLocaleDateString()}</p>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-1">{r.description}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ml-3 ${statusColor(r.status)}`}>{r.status_display}</span>
              </div>
              {r.landlord_notes && (
                <div className="mt-3 bg-slate-50 rounded-xl px-4 py-2.5">
                  <p className="text-xs text-slate-400 mb-0.5">Landlord note</p>
                  <p className="text-slate-700 text-xs">{r.landlord_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">New Maintenance Request</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className={inputCls} placeholder="e.g. Leaking pipe in bathroom" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    {['plumbing','electrical','structural','appliances','security','cleaning','other'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className={inputCls}>
                    {['low','medium','high','emergency'].map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3} className={inputCls} placeholder="Describe the issue in detail..." />
              </div>
              <button type="submit" disabled={creating} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
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