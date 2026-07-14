import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetTenantProfileQuery, useUpdateTenantProfileMutation } from '../../features/auth/authApi'
import { Save, User, Mail, Phone, Briefcase, Users, Shield, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"

function TenantProfile() {
  const { user } = useSelector(s => s.auth)
  const { data: profile, isLoading } = useGetTenantProfileQuery()
  const [updateProfile, { isLoading: saving }] = useUpdateTenantProfileMutation()
  const [form, setForm] = useState({ 
    first_name: '',
    last_name: '',
    phone_number: '',
    national_id: '', 
    occupation: '', 
    emergency_contact_name: '', 
    emergency_contact_phone: '', 
    emergency_contact_relationship: '' 
  })
  const [initialized, setInitialized] = useState(false)

  if (profile && !initialized) {
    setForm({
      first_name: profile.first_name || user?.first_name || '',
      last_name: profile.last_name || user?.last_name || '',
      phone_number: profile.phone_number || user?.phone_number || '',
      national_id: profile.national_id || '',
      occupation: profile.occupation || '',
      emergency_contact_name: profile.emergency_contact_name || '',
      emergency_contact_phone: profile.emergency_contact_phone || '',
      emergency_contact_relationship: profile.emergency_contact_relationship || '',
    })
    setInitialized(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(form).unwrap()
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.data?.national_id?.[0] || err.data?.emergency_contact_phone?.[0] || 'Failed to update')
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-100">
      <div className="glass-panel ambient-shadow rounded-2xl p-8 w-full max-w-2xl animate-pulse border border-outline-variant/30">
        <div className="h-8 bg-surface-container rounded w-32 mb-4" />
        <div className="h-4 bg-surface-container rounded w-48 mb-6" />
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-surface-container" />
          <div className="space-y-2">
            <div className="h-6 bg-surface-container rounded w-32" />
            <div className="h-4 bg-surface-container rounded w-24" />
          </div>
        </div>
        <div className="space-y-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-12 bg-surface-container rounded-lg" />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Profile</p>
        <h1 className="text-display-lg text-primary tracking-tight">My Profile</h1>
        <p className="text-body-md text-on-surface-variant mt-2">Manage your tenant profile</p>
      </header>

      {/* User card */}
      <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <span className="text-secondary font-black text-4xl">{user?.first_name?.[0]}</span>
          </div>
          <div className="flex-1">
            <p className="font-headline-md text-headline-md text-on-surface">{user?.full_name}</p>
            <p className="text-secondary text-sm font-semibold capitalize">{user?.role}</p>
            <div className="flex flex-col gap-0.5 mt-1">
              <p className="text-on-surface-variant text-sm flex items-center gap-2">
                <Mail size={14} className="text-on-surface-variant" />
                {user?.email}
              </p>
              {user?.phone_number && (
                <p className="text-on-surface-variant text-sm flex items-center gap-2">
                  <Phone size={14} className="text-on-surface-variant" />
                  {user.phone_number}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-6">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-5">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">First Name</label>
              <input 
                name="first_name"
                value={form.first_name} 
                onChange={e => setForm({ ...form, first_name: e.target.value })} 
                className={inputCls} 
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Last Name</label>
              <input 
                name="last_name"
                value={form.last_name} 
                onChange={e => setForm({ ...form, last_name: e.target.value })} 
                className={inputCls} 
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Phone Number</label>
            <input 
              name="phone_number"
              value={form.phone_number} 
              onChange={e => setForm({ ...form, phone_number: e.target.value })} 
              className={inputCls} 
              placeholder="0712345678"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">National ID</label>
              <input 
                name="national_id"
                value={form.national_id} 
                onChange={e => setForm({ ...form, national_id: e.target.value })} 
                className={inputCls} 
                placeholder="12345678" 
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant font-medium mb-1.5">Occupation</label>
              <input 
                name="occupation"
                value={form.occupation} 
                onChange={e => setForm({ ...form, occupation: e.target.value })} 
                className={inputCls} 
                placeholder="Software Engineer" 
              />
            </div>
          </div>

          <div className="border-t border-outline-variant/30 pt-4">
            <p className="text-label-sm text-on-surface-variant font-medium mb-3 flex items-center gap-2">
              <Users size={15} className="text-secondary" />
              Emergency Contact
            </p>
            <div className="space-y-3">
              <input 
                name="emergency_contact_name"
                value={form.emergency_contact_name} 
                onChange={e => setForm({ ...form, emergency_contact_name: e.target.value })} 
                className={inputCls} 
                placeholder="Full name" 
              />
              <input 
                name="emergency_contact_phone"
                value={form.emergency_contact_phone} 
                onChange={e => setForm({ ...form, emergency_contact_phone: e.target.value })} 
                className={inputCls} 
                placeholder="Phone number e.g. 0712345678" 
              />
              <input 
                name="emergency_contact_relationship"
                value={form.emergency_contact_relationship} 
                onChange={e => setForm({ ...form, emergency_contact_relationship: e.target.value })} 
                className={inputCls} 
                placeholder="Relationship e.g. Sister" 
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5">
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default TenantProfile