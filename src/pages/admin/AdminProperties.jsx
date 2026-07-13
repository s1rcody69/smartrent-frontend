import { useGetPropertiesQuery, useDeletePropertyMutation } from '../../features/properties/propertiesApi'
import { Building2, MapPin, Trash2, Image, Home, User, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'

function AdminProperties() {
  const { data, isLoading } = useGetPropertiesQuery()
  const [deleteProperty] = useDeletePropertyMutation()
  const [deletingId, setDeletingId] = useState(null)

  const properties = data?.results || []

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id).unwrap()
      toast.success('Property deleted')
    } catch {
      toast.error('Cannot delete — active leases exist')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-label-md text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Property Management</p>
          <h2 className="text-display-lg text-display-lg text-primary tracking-tight">All Properties</h2>
          <p className="text-body-md text-body-md text-on-surface-variant mt-2">{properties.length} properties across all landlords</p>
        </div>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="glass-panel ambient-shadow rounded-2xl h-24 animate-pulse border border-outline-variant/30" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
          <Building2 size={40} className="text-outline mx-auto mb-3" />
          <p className="text-on-surface-variant">No properties yet</p>
        </div>
      ) : (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 bg-surface-container-low border-b border-outline-variant/30 px-6 py-3">
            {['Property', 'Landlord', 'Location', 'Units', 'Actions'].map(h => (
              <p key={h} className="text-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</p>
            ))}
          </div>

          {/* Table Body */}
          <div className="divide-y divide-outline-variant/20">
            {properties.map(p => (
              <div key={p.id} className="grid grid-cols-5 px-6 py-4 hover:bg-surface-container-low transition-colors items-center">
                {/* Property */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0">
                    {p.cover_image
                      ? <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">
                          <Image size={14} className="text-outline" />
                        </div>
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{p.name}</p>
                    <span className="text-xs text-on-surface-variant capitalize">{p.property_type}</span>
                  </div>
                </div>

                {/* Landlord */}
                <div>
                  <p className="text-sm text-on-surface font-medium">{p.landlord_name}</p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                  <MapPin size={11} />{p.city}
                </div>

                {/* Units */}
                <div>
                  <p className="text-sm font-semibold text-on-surface">{p.total_units}</p>
                  <p className="text-xs text-on-surface-variant">units</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    p.is_active
                      ? 'bg-success-container text-success'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {deletingId === p.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-xs bg-error text-white px-2 py-1 rounded-lg font-semibold hover:bg-error/90 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-xs bg-surface-container text-on-surface-variant px-2 py-1 rounded-lg font-semibold hover:bg-surface-container-high transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(p.id)}
                      className="w-8 h-8 rounded-lg bg-error-container hover:bg-error/20 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={13} className="text-error" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProperties