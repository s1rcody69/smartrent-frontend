import { useState } from 'react'
import { useGetMaintenanceRequestsQuery, useUpdateMaintenanceRequestMutation } from '../../features/maintenance/maintenanceApi'
import { Wrench, X, Clock, AlertTriangle, Zap, CheckCircle, Filter, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"

function LandlordMaintenance() {
  const { data, isLoading } = useGetMaintenanceRequestsQuery()
  const [updateRequest] = useUpdateMaintenanceRequestMutation()
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  const requests = data?.results || []
  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)

  const priorityIcon = (p) => {
    if (p === 'emergency') return <Zap size={14} className="text-error" />
    if (p === 'high') return <AlertTriangle size={14} className="text-warning" />
    if (p === 'medium') return <Clock size={14} className="text-secondary" />
    return <CheckCircle size={14} className="text-on-surface-variant" />
  }

  const statusColor = (s) => ({
    pending: 'bg-warning-container text-warning',
    assigned: 'bg-secondary/10 text-secondary',
    in_progress: 'bg-secondary/10 text-secondary',
    completed: 'bg-success-container text-success',
  }[s] || 'bg-surface-container-highest text-on-surface-variant')

  const handleStatusUpdate = async (id, newStatus, notes) => {
    try {
      await updateRequest({ id, status: newStatus, landlord_notes: notes }).unwrap()
      toast.success('Status updated')
      setSelected(null)
    } catch { toast.error('Failed to update') }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Maintenance Management</p>
        <h1 className="text-display-lg text-primary tracking-tight">Maintenance</h1>
        <p className="text-body-md text-on-surface-variant mt-2">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
      </header>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit flex-wrap">
        {[['all', 'All'], ['pending', 'Pending'], ['assigned', 'Assigned'], ['in_progress', 'In Progress'], ['completed', 'Completed']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === val ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass-panel ambient-shadow rounded-2xl h-24 animate-pulse border border-outline-variant/30" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
          <Wrench size={40} className="text-outline mx-auto mb-3" />
          <p className="text-on-surface-variant font-medium">No requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => (
            <div key={req.id} onClick={() => setSelected(req)} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5 hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{priorityIcon(req.priority)}</div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{req.title}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">{req.tenant_name} · {req.property_name} Unit {req.unit_number}</p>
                    <p className="text-on-surface-variant text-xs mt-1 capitalize">{req.category_display}</p>
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
        <div className="fixed inset-0 bg-primary/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-surface-container-lowest glass-panel rounded-2xl w-full max-w-lg shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30 sticky top-0 bg-surface-container-lowest/95 backdrop-blur-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-on-surface-variant hover:text-on-surface transition-colors"><X size={20} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-xs text-on-surface-variant mb-1">Tenant</p>
                  <p className="font-semibold text-on-surface">{selected.tenant_name}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-xs text-on-surface-variant mb-1">Unit</p>
                  <p className="font-semibold text-on-surface">{selected.property_name} · {selected.unit_number}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-xs text-on-surface-variant mb-1">Priority</p>
                  <p className="font-semibold text-on-surface capitalize">{selected.priority_display}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-xs text-on-surface-variant mb-1">Category</p>
                  <p className="font-semibold text-on-surface">{selected.category_display}</p>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-4">
                <p className="text-xs text-on-surface-variant mb-1">Description</p>
                <p className="text-on-surface text-sm">{selected.description}</p>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant font-medium mb-2">Update Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['pending', 'Pending'], ['assigned', 'Assigned'], ['in_progress', 'In Progress'], ['completed', 'Completed']].map(([val, label]) => (
                    <button key={val} onClick={() => handleStatusUpdate(selected.id, val, selected.landlord_notes)}
                      className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${selected.status === val ? 'bg-secondary text-white border-secondary' : 'border-outline-variant text-on-surface-variant hover:border-outline'}`}>
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