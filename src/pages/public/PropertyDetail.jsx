import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetPropertyByIdQuery } from '../../features/properties/propertiesApi'
import { useCreateLeaseMutation } from '../../features/leases/leasesApi'
import Navbar from '../../components/layout/Navbar'
import { MapPin, Home, Building2, ArrowLeft, Bed, Bath, DollarSign, Check, X, AlertCircle, Loader, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

function StatusBadge({ status }) {
  const colors = {
    vacant: 'bg-success-container text-success border-success/20',
    occupied: 'bg-surface-container-highest text-on-surface-variant border-outline-variant/20',
    maintenance: 'bg-warning-container text-warning border-warning/20',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status] || 'bg-surface-container-highest text-on-surface-variant border-outline-variant/20'}`}>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm">
      <div className="bg-surface-container-lowest glass-panel rounded-2xl w-full max-w-md mx-4 shadow-2xl border border-outline-variant/30">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <h3 className="font-headline-md text-headline-md text-on-surface">Apply for Unit {unit?.unit_number}</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="bg-surface-container-low rounded-lg p-4 space-y-2 border border-outline-variant/20">
            <p className="text-sm text-on-surface">
              <span className="font-semibold">Property:</span> {unit?.property_name}
            </p>
            <p className="text-sm text-on-surface">
              <span className="font-semibold">Unit:</span> {unit?.unit_number}
            </p>
            <p className="text-sm text-on-surface">
              <span className="font-semibold">Rent:</span> KES {unit?.rent_amount?.toLocaleString()}/mo
            </p>
          </div>

          <div>
            <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">
              Start Date <span className="text-error">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>

          <div>
            <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">
              End Date <span className="text-on-surface-variant text-xs font-normal">(Optional - leave blank for open-ended)</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-secondary hover:bg-secondary/90 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
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

function UnitCard({ unit, propertyName, onApply }) {
  const isVacant = unit.status === 'vacant'

  return (
    <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5 hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-headline-md text-headline-md text-on-surface">Unit {unit.unit_number}</h4>
          <p className="text-xs text-on-surface-variant capitalize">{unit.unit_type_display || 'Unit'}</p>
        </div>
        <StatusBadge status={unit.status} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm mb-4">
        <div className="bg-surface-container-low rounded-lg p-2 text-center border border-outline-variant/20">
          <p className="text-xs text-on-surface-variant">Bedrooms</p>
          <p className="font-semibold text-on-surface">{unit.bedrooms}</p>
        </div>
        <div className="bg-surface-container-low rounded-lg p-2 text-center border border-outline-variant/20">
          <p className="text-xs text-on-surface-variant">Bathrooms</p>
          <p className="font-semibold text-on-surface">{unit.bathrooms}</p>
        </div>
        <div className="bg-surface-container-low rounded-lg p-2 text-center border border-outline-variant/20">
          <p className="text-xs text-on-surface-variant">Floor</p>
          <p className="font-semibold text-on-surface">{unit.floor || '—'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
        <p className="font-bold text-on-surface">KES {Number(unit.rent_amount).toLocaleString()}<span className="text-xs font-normal text-on-surface-variant">/mo</span></p>
        {isVacant ? (
          <button
            onClick={() => onApply(unit)}
            className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-secondary/20 hover:shadow-secondary/30"
          >
            Apply Now
          </button>
        ) : (
          <span className="text-on-surface-variant text-sm font-medium">Not available</span>
        )}
      </div>
    </div>
  )
}

function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const { data: property, isLoading, error } = useGetPropertyByIdQuery(id)
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
      const leaseData = {
        unit: selectedUnit.id,
        rent_amount: selectedUnit.rent_amount,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
      }

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 max-w-container-max mx-auto px-margin-desktop py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-surface-container rounded w-1/3" />
            <div className="h-64 bg-surface-container rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-48 bg-surface-container rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 max-w-container-max mx-auto px-margin-desktop py-12">
          <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
            <AlertCircle size={40} className="text-outline mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">Property not found</p>
            <Link to="/properties" className="mt-4 text-secondary hover:text-secondary/80 text-sm font-semibold inline-block">
              ← Back to properties
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const units = property.units || []
  const vacantUnits = units.filter(u => u.status === 'vacant').length

  return (
    <div className="min-h-screen bg-background font-body-md">
      <Navbar />

      {/* Hero image */}
      <div className="h-80 bg-surface-container relative overflow-hidden pt-16">
        {property.cover_image
          ? <img src={property.cover_image} alt={property.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-linear-to-br from-surface-container to-surface-container-highest flex items-center justify-center">
              <Building2 size={48} className="text-outline" />
            </div>
        }
        <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <span className="bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface text-xs font-semibold px-3 py-1.5 rounded-full capitalize border border-outline-variant/20">
            {property.property_type}
          </span>
          {vacantUnits > 0 ? (
            <span className="bg-success-container text-success text-xs font-semibold px-3 py-1.5 rounded-full">
              {vacantUnits} unit{vacantUnits !== 1 ? 's' : ''} available
            </span>
          ) : (
            <span className="bg-surface-container-highest text-on-surface-variant text-xs font-semibold px-3 py-1.5 rounded-full">
              Fully occupied
            </span>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/properties" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface text-sm font-medium mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to properties
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="md:col-span-2">
            <h1 className="text-display-lg text-primary mb-2">{property.name}</h1>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-sm mb-6">
              <MapPin size={14} className="text-secondary" />
              <span>{property.address}, {property.city}, Kenya</span>
            </div>

            {property.description && (
              <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6 mb-6">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-3">About this property</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Units with Apply buttons */}
            <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                Available Units ({vacantUnits} vacant)
              </h3>
              {units.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No units listed yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {units.map(unit => (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      propertyName={property.name}
                      onApply={handleApply}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-primary-container rounded-2xl p-6">
              <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-3">Property Summary</p>
              {[
                ['Type', property.property_type, true],
                ['City', property.city, false],
                ['Total Units', property.total_units, false],
                ['Vacant Units', vacantUnits, false],
                ['Status', property.is_active ? 'Active' : 'Inactive', false],
              ].map(([label, value, cap]) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <p className="text-on-primary-container text-xs">{label}</p>
                  <p className={`text-white text-xs font-semibold ${cap ? 'capitalize' : ''}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-5">
              <h3 className="font-bold text-secondary text-sm mb-2">Interested in this property?</h3>
              <p className="text-secondary/70 text-xs mb-4">Create an account or log in to apply for a unit.</p>
              <Link to="/register" className="block w-full text-center bg-secondary hover:bg-secondary/90 text-white py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-secondary/20">
                Get started
              </Link>
              <Link to="/login" className="block w-full text-center text-secondary hover:text-secondary/80 py-2 text-sm font-medium mt-2">
                Already have an account? Log in
              </Link>
            </div>
          </div>
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