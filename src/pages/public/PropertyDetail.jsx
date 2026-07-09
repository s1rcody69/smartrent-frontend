import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetPropertyByIdQuery } from '../../features/properties/propertiesApi'
import { useCreateLeaseMutation } from '../../features/leases/leasesApi'
import Navbar from '../../components/layout/Navbar'
import { MapPin, Home, Users, Calendar, ArrowLeft, Check, X, AlertCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

function StatusBadge({ status }) {
  const colors = {
    vacant: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    occupied: 'bg-slate-50 text-slate-600 border-slate-200',
    maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function ApplyModal({ isOpen, onClose, unit, onApply }) {
  const { user } = useSelector(s => s.auth)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!startDate) {
      toast.error('Please select a start date')
      return
    }
    setLoading(true)
    try {
      await onApply({
        start_date: startDate,
        end_date: endDate || null,
      })
      onClose()
    } catch (err) {
      // Error handled in parent
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-lg">Apply for Unit {unit?.unit_number}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Property:</span> {unit?.property_name}
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Unit:</span> {unit?.unit_number}
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Rent:</span> KES {unit?.rent_amount?.toLocaleString()}/mo
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              End Date <span className="text-slate-400 text-xs font-normal">(Optional - leave blank for open-ended)</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            />
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
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
              {loading ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function UnitCard({ unit, onApply }) {
  const isVacant = unit.status === 'vacant'

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-slate-900">Unit {unit.unit_number}</h4>
          <p className="text-xs text-slate-400 capitalize">{unit.unit_type_display || 'Unit'}</p>
        </div>
        <StatusBadge status={unit.status} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm mb-4">
        <div className="bg-slate-50 rounded-xl p-2 text-center">
          <p className="text-xs text-slate-400">Bedrooms</p>
          <p className="font-semibold text-slate-900">{unit.bedrooms}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-2 text-center">
          <p className="text-xs text-slate-400">Bathrooms</p>
          <p className="font-semibold text-slate-900">{unit.bathrooms}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-2 text-center">
          <p className="text-xs text-slate-400">Floor</p>
          <p className="font-semibold text-slate-900">{unit.floor || '—'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <p className="font-bold text-slate-900">KES {Number(unit.rent_amount).toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span></p>
        {isVacant ? (
          <button
            onClick={() => onApply(unit)}
            className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            Apply Now
          </button>
        ) : (
          <span className="text-slate-400 text-sm font-medium">Not available</span>
        )}
      </div>
    </div>
  )
}

function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const { data, isLoading, error } = useGetPropertyByIdQuery(id)
  const [createLease, { isLoading: creating }] = useCreateLeaseMutation()

  const [selectedUnit, setSelectedUnit] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleApply = (unit) => {
    if (!user) {
      toast.error('Please log in to apply for a unit')
      navigate('/login')
      return
    }
    setSelectedUnit(unit)
    setShowModal(true)
  }

  const handleApplySubmit = async (formData) => {
    try {
      // 👇 No tenant field - backend will auto-set it for tenants
      const leaseData = {
        unit: selectedUnit.id,
        rent_amount: selectedUnit.rent_amount,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
      }

      console.log('Creating lease with data:', leaseData)

      await createLease(leaseData).unwrap()
      
      toast.success(`Application submitted for Unit ${selectedUnit.unit_number}!`)
      navigate('/tenant/leases')
    } catch (err) {
      console.error('Lease creation error:', err)
      const errorData = err?.data
      let errorMsg = 'Failed to apply. Please try again.'
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMsg = errorData
        } else if (errorData.unit) {
          errorMsg = `Unit: ${errorData.unit.join(', ')}`
        } else if (errorData.start_date) {
          errorMsg = `Start date: ${errorData.start_date.join(', ')}`
        } else if (errorData.non_field_errors) {
          errorMsg = errorData.non_field_errors.join(', ')
        } else {
          errorMsg = Object.values(errorData).flat().join(', ')
        }
      }
      toast.error(errorMsg)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-20 max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-20 max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
            <AlertCircle size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Property not found</p>
            <Link to="/properties" className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-semibold inline-block">
              ← Back to properties
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const property = data
  const units = property.units || []

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-20 max-w-7xl mx-auto px-6 py-12">
        {/* Back button */}
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to properties
        </Link>

        {/* Property header */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-8">
          <div className="h-64 bg-slate-200">
            {property.cover_image ? (
              <img src={property.cover_image} alt={property.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <Home size={48} className="text-slate-400" />
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900">{property.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-slate-500">{property.address}, {property.city}</span>
                </div>
              </div>
              <span className="bg-amber-50 text-amber-700 text-sm font-semibold px-3 py-1.5 rounded-full capitalize">
                {property.property_type}
              </span>
            </div>

            {property.description && (
              <p className="text-slate-600 text-sm leading-relaxed">{property.description}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Home size={16} className="text-slate-400" />
                <span>{property.total_units} total units</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users size={16} className="text-slate-400" />
                <span>{property.units?.filter(u => u.status === 'occupied').length || 0} occupied</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Check size={16} className="text-slate-400" />
                <span>{property.units?.filter(u => u.status === 'vacant').length || 0} vacant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Units section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Available Units</h2>
          {units.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 py-12 text-center">
              <AlertCircle size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No units listed for this property</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {units.map(unit => (
                <UnitCard key={unit.id} unit={unit} onApply={handleApply} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedUnit(null)
        }}
        unit={selectedUnit}
        onApply={handleApplySubmit}
      />
    </div>
  )
}

export default PropertyDetail