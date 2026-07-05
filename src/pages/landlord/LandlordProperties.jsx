import { useState } from 'react'
import { useGetPropertiesQuery, useCreatePropertyMutation, useUpdatePropertyMutation, useDeletePropertyMutation, useGetUnitsQuery, useCreateUnitMutation, useDeleteUnitMutation } from '../../features/properties/propertiesApi'
import { Plus, Pencil, Trash2, X, Building2, MapPin, Home, ChevronDown, ChevronUp, Image } from 'lucide-react'
import toast from 'react-hot-toast'

const STOCK_IMAGES = {
  apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  house: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
  bedsitter: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

function FieldGroup({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"

function LandlordProperties() {
  const { data, isLoading } = useGetPropertiesQuery()
  const { data: unitsData } = useGetUnitsQuery()
  const [createProperty, { isLoading: creating }] = useCreatePropertyMutation()
  const [updateProperty, { isLoading: updating }] = useUpdatePropertyMutation()
  const [deleteProperty] = useDeletePropertyMutation()
  const [createUnit, { isLoading: creatingUnit }] = useCreateUnitMutation()
  const [deleteUnit] = useDeleteUnitMutation()

  const [showCreate, setShowCreate] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [expandedProperty, setExpandedProperty] = useState(null)
  const [showUnitForm, setShowUnitForm] = useState(null)

  const [form, setForm] = useState({ name: '', property_type: 'apartment', address: '', city: '', description: '', cover_image: null })
  const [unitForm, setUnitForm] = useState({ unit_number: '', unit_type: 'apartment_unit', floor: '', bedrooms: 1, bathrooms: 1, rent_amount: '', status: 'vacant', description: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleUnitChange = (e) => setUnitForm({ ...unitForm, [e.target.name]: e.target.value })

  const resetForm = () => setForm({ name: '', property_type: 'apartment', address: '', city: '', description: '', cover_image: null })

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      if (!payload.cover_image) payload.cover_image = STOCK_IMAGES[payload.property_type]
      await createProperty(payload).unwrap()
      toast.success('Property created')
      resetForm()
      setShowCreate(false)
    } catch (err) {
      toast.error(err.data?.error || 'Failed to create property')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const payload = { id: editingProperty.id, ...form }
      const isNewFile = form.cover_image instanceof File
      const isChangedUrl = typeof form.cover_image === 'string' && form.cover_image !== editingProperty.cover_image
      if (!isNewFile && !isChangedUrl) delete payload.cover_image
      await updateProperty(payload).unwrap()
      toast.success('Property updated')
      setEditingProperty(null)
    } catch (err) {
      toast.error(err.data?.error || 'Failed to update property')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProperty(deletingId).unwrap()
      toast.success('Property deleted')
    } catch (err) {
      toast.error(err.data?.error || 'Cannot delete — active leases exist')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreateUnit = async (e) => {
    e.preventDefault()
    try {
      await createUnit({ ...unitForm, property: showUnitForm }).unwrap()
      toast.success('Unit added')
      setUnitForm({ unit_number: '', unit_type: 'apartment_unit', floor: '', bedrooms: 1, bathrooms: 1, rent_amount: '', status: 'vacant', description: '' })
      setShowUnitForm(null)
    } catch (err) {
      toast.error(err.data?.error || 'Failed to add unit')
    }
  }

  const openEdit = (property) => {
    setForm({ name: property.name, property_type: property.property_type, address: property.address, city: property.city, description: property.description || '', cover_image: property.cover_image || null })
    setEditingProperty(property)
  }

  const properties = data?.results || []
  const units = unitsData?.results || []
  const getPropertyUnits = (id) => units.filter(u => u.property === id)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Properties</h1>
          <p className="text-slate-500 text-sm mt-1">{properties.length} listing{properties.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/25 hover:-translate-y-0.5">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100" />)}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <Building2 size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No properties yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-semibold">Add your first property →</button>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map(property => {
            const propertyUnits = getPropertyUnits(property.id)
            const isExpanded = expandedProperty === property.id
            return (
              <div key={property.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 p-5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {property.cover_image
                      ? <img src={property.cover_image} alt={property.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Image size={24} className="text-slate-300" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate">{property.name}</h3>
                      <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full capitalize shrink-0">{property.property_type}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${property.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {property.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <MapPin size={12} />
                      <span>{property.address}, {property.city}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">{property.total_units} unit{property.total_units !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(property)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                      <Pencil size={15} className="text-slate-600" />
                    </button>
                    <button onClick={() => setDeletingId(property.id)} className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                      <Trash2 size={15} className="text-red-500" />
                    </button>
                    <button onClick={() => setExpandedProperty(isExpanded ? null : property.id)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                      {isExpanded ? <ChevronUp size={15} className="text-slate-600" /> : <ChevronDown size={15} className="text-slate-600" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-slate-700">Units</h4>
                      <button onClick={() => setShowUnitForm(property.id)} className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700">
                        <Plus size={13} /> Add unit
                      </button>
                    </div>
                    {propertyUnits.length === 0 ? (
                      <p className="text-slate-400 text-sm">No units yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {propertyUnits.map(unit => (
                          <div key={unit.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">Unit {unit.unit_number}</p>
                              <p className="text-xs text-slate-500">{unit.bedrooms}bd · {unit.bathrooms}ba · KES {Number(unit.rent_amount).toLocaleString()}/mo</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                unit.status === 'vacant' ? 'bg-emerald-50 text-emerald-700' :
                                unit.status === 'occupied' ? 'bg-blue-50 text-blue-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>{unit.status}</span>
                              <button onClick={async () => { try { await deleteUnit(unit.id).unwrap(); toast.success('Unit removed') } catch { toast.error('Cannot delete — lease attached') }}} className="text-red-400 hover:text-red-600">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create Property Modal */}
      {showCreate && (
        <Modal title="Add New Property" onClose={() => { setShowCreate(false); resetForm() }}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Property Name">
                <input name="name" value={form.name} onChange={handleChange} required className={inputCls} placeholder="Sunset Apartments" />
              </FieldGroup>
              <FieldGroup label="Type">
                <select name="property_type" value={form.property_type} onChange={handleChange} className={inputCls}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="bedsitter">Bedsitter</option>
                  <option value="commercial">Commercial</option>
                </select>
              </FieldGroup>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="City">
                <input name="city" value={form.city} onChange={handleChange} required className={inputCls} placeholder="Nairobi" />
              </FieldGroup>
              <FieldGroup label="Address">
                <input name="address" value={form.address} onChange={handleChange} required className={inputCls} placeholder="123 Ngong Road" />
              </FieldGroup>
            </div>
            <FieldGroup label="Description">
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={inputCls} placeholder="Brief description..." />
            </FieldGroup>
            <FieldGroup label="Cover Image URL (optional)">
              <input name="cover_image" value={form.cover_image || ''} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className={inputCls} placeholder="https://... or leave blank for auto stock photo" />
            </FieldGroup>
            <button type="submit" disabled={creating} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
              {creating ? 'Creating...' : 'Create Property'}
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <Modal title="Edit Property" onClose={() => setEditingProperty(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Property Name">
                <input name="name" value={form.name} onChange={handleChange} required className={inputCls} />
              </FieldGroup>
              <FieldGroup label="Type">
                <select name="property_type" value={form.property_type} onChange={handleChange} className={inputCls}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="bedsitter">Bedsitter</option>
                  <option value="commercial">Commercial</option>
                </select>
              </FieldGroup>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="City">
                <input name="city" value={form.city} onChange={handleChange} required className={inputCls} />
              </FieldGroup>
              <FieldGroup label="Address">
                <input name="address" value={form.address} onChange={handleChange} required className={inputCls} />
              </FieldGroup>
            </div>
            <FieldGroup label="Description">
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={inputCls} />
            </FieldGroup>
            <FieldGroup label="Cover Image URL">
              <input value={form.cover_image || ''} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className={inputCls} />
            </FieldGroup>
            <button type="submit" disabled={updating} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </Modal>
      )}

      {/* Add Unit Modal */}
      {showUnitForm && (
        <Modal title="Add Unit" onClose={() => setShowUnitForm(null)}>
          <form onSubmit={handleCreateUnit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Unit Number">
                <input name="unit_number" value={unitForm.unit_number} onChange={handleUnitChange} required className={inputCls} placeholder="A1" />
              </FieldGroup>
              <FieldGroup label="Unit Type">
                <select name="unit_type" value={unitForm.unit_type} onChange={handleUnitChange} className={inputCls}>
                  <option value="apartment_unit">Apartment Unit</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="bedsitter">Bedsitter</option>
                  <option value="office">Office</option>
                  <option value="shop">Shop</option>
                </select>
              </FieldGroup>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FieldGroup label="Bedrooms">
                <input type="number" name="bedrooms" value={unitForm.bedrooms} onChange={handleUnitChange} min={0} className={inputCls} />
              </FieldGroup>
              <FieldGroup label="Bathrooms">
                <input type="number" name="bathrooms" value={unitForm.bathrooms} onChange={handleUnitChange} min={0} className={inputCls} />
              </FieldGroup>
              <FieldGroup label="Floor">
                <input name="floor" value={unitForm.floor} onChange={handleUnitChange} className={inputCls} placeholder="G" />
              </FieldGroup>
            </div>
            <FieldGroup label="Rent Amount (KES)">
              <input type="number" name="rent_amount" value={unitForm.rent_amount} onChange={handleUnitChange} required className={inputCls} placeholder="25000" />
            </FieldGroup>
            <button type="submit" disabled={creatingUnit} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
              {creatingUnit ? 'Adding...' : 'Add Unit'}
            </button>
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {deletingId && (
        <Modal title="Delete Property" onClose={() => setDeletingId(null)}>
          <p className="text-slate-500 text-sm mb-6">This will permanently delete this property and all its units. This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeletingId(null)} className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default LandlordProperties