import { useState } from 'react'
import { useGetMaintenanceRequestsQuery, useUpdateMaintenanceRequestMutation } from '../../features/maintenance/maintenanceApi'
import { Wrench, X, Clock, AlertTriangle, Zap, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"

function LandlordMaintenance() {
  const { data, isLoading } = useGetMaintenanceRequestsQuery()
  const [updateRequest] = useUpdateMaintenanceRequestMutation()
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const requests = data?.results || []
  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  const priorityIcon = (p) => {
    if (p === 'emergency') return <Zap size={14} className="text-red-500" />
    if (p === 'high') return <AlertTriangle size={14} className="text-amber-500" />
    if (p === 'medium') return <Clock size={14} className="text-blue-500" />
    return <CheckCircle size={14} className="text-slate-400" />
  }

  const statusColor = (s) => ({
    pending: 'bg-amber-50 text-amber-700',
    assigned: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-purple-50 text-purple-700',
    completed: 'bg-emerald-50 text-emerald-700',
  }[s] || 'bg-slate-100 text-slate-600')

  const handleStatusUpdate = async (id, newStatus, notes) => {
    try {
      await updateRequest({ id, status: newStatus, landlord_notes: notes }).unwrap()
      toast.success('Status updated')
      setSelected(null)
    } catch { toast.error('Failed to update') }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Maintenance</h1>
        <p className="text-slate-500 text-sm mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit flex-wrap">
        {[['all', 'All'], ['pending', 'Pending'], ['assigned', 'Assigned'], ['in_progress', 'In Progress'], ['completed', 'Completed']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === val ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-slate-100" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <Wrench size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => (
            <div key={req.id} onClick={() => setSelected(req)} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{priorityIcon(req.priority)}</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{req.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{req.tenant_name} · {req.property_name} Unit {req.unit_number}</p>
                    <p className="text-slate-400 text-xs mt-1 capitalize">{req.category_display}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor(req.status)}`}>{req.status_display}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Tenant</p>
                  <p className="font-semibold text-slate-900">{selected.tenant_name}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Unit</p>
                  <p className="font-semibold text-slate-900">{selected.property_name} · {selected.unit_number}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Priority</p>
                  <p className="font-semibold text-slate-900 capitalize">{selected.priority_display}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">Category</p>
                  <p className="font-semibold text-slate-900">{selected.category_display}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-slate-700 text-sm">{selected.description}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Update Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['pending', 'Pending'], ['assigned', 'Assigned'], ['in_progress', 'In Progress'], ['completed', 'Completed']].map(([val, label]) => (
                    <button key={val} onClick={() => handleStatusUpdate(selected.id, val, selected.landlord_notes)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${selected.status === val ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandlordMaintenance