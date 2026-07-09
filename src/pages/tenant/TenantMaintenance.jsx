import { useState } from 'react'
import { useGetMaintenanceRequestsQuery, useCreateMaintenanceRequestMutation } from '../../features/maintenance/maintenanceApi'
import { useGetLeasesQuery } from '../../features/leases/leasesApi'
import { Wrench, Plus, X, AlertCircle, Clock, CheckCircle, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"

function StatusBadge({ status, display }) {
  const colors = {
    submitted: 'bg-amber-50 text-amber-700',
    assigned: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-purple-50 text-purple-700',
    resolved: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-emerald-50 text-emerald-700',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-slate-50 text-slate-600'}`}>
      {display || status}
    </span>
  )
}

function PriorityBadge({ priority }) {
  const colors = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-50 text-blue-700',
    high: 'bg-amber-50 text-amber-700',
    emergency: 'bg-red-50 text-red-600',
  }
  const icons = {
    low: <CheckCircle size={12} />,
    medium: <Clock size={12} />,
    high: <AlertCircle size={12} />,
    emergency: <Zap size={12} />,
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${colors[priority] || 'bg-slate-50 text-slate-600'}`}>
      {icons[priority]} {priority}
    </span>
  )
}

function TenantMaintenance() {
  const { data, isLoading } = useGetMaintenanceRequestsQuery()
  const { data: leasesData } = useGetLeasesQuery()
  const [createMaintenance, { isLoading: creating }] = useCreateMaintenanceRequestMutation()
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    unit: '',
    title: '',
    description: '',
    category: 'plumbing',
    priority: 'medium',
  })

  const requests = data?.results || []
  const activeLease = leasesData?.results?.find(l => l.status === 'active')
  
  const filtered = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter)

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createMaintenance(form).unwrap()
      toast.success('Maintenance request submitted')
      setShowCreate(false)
      setForm({ unit: '', title: '', description: '', category: 'plumbing', priority: 'medium' })
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to submit request')
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-slate-100" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Maintenance</h1>
          <p className="text-slate-500 text-sm mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)} 
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/25 hover:-translate-y-0.5"
        >
          <Plus size={16} /> New Request
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit flex-wrap">
        {[['all', 'All'], ['submitted', 'Submitted'], ['assigned', 'Assigned'], ['in_progress', 'In Progress'], ['resolved', 'Resolved']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === val ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <Wrench size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No maintenance requests</p>
          <p className="text-slate-400 text-sm mt-1">Everything looks good!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-sm">{req.title}</h3>
                    <StatusBadge status={req.status} display={req.status_display} />
                  </div>
                  <p className="text-slate-500 text-xs">{req.property_name} — Unit {req.unit_number}</p>
                  <p className="text-slate-700 text-sm mt-2">{req.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <PriorityBadge priority={req.priority} />
                    <span className="text-slate-400">{req.category_display}</span>
                    <span className="text-slate-400">
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">New Maintenance Request</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Unit</label>
                <select 
                  value={form.unit} 
                  onChange={(e) => setForm({ ...form, unit: e.target.value })} 
                  required 
                  className={inputCls}
                >
                  <option value="">Select your unit</option>
                  {activeLease && (
                    <option value={activeLease.unit}>
                      {activeLease.property_name} — Unit {activeLease.unit_number}
                    </option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Title</label>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  required 
                  className={inputCls} 
                  placeholder="e.g. Broken window latch"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  required 
                  rows={3} 
                  className={inputCls} 
                  placeholder="Describe the issue in detail..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
                  <select 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })} 
                    className={inputCls}
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="structural">Structural</option>
                    <option value="appliance">Appliance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Priority</label>
                  <select 
                    value={form.priority} 
                    onChange={(e) => setForm({ ...form, priority: e.target.value })} 
                    className={inputCls}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
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