import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetLandlordProfileQuery, useUpdateLandlordProfileMutation } from '../../features/auth/authApi'
import { Save, User } from 'lucide-react'
import toast from 'react-hot-toast'

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"

function LandlordProfile() {
  const { user } = useSelector(s => s.auth)
  const { data: profile, isLoading } = useGetLandlordProfileQuery()
  const [updateProfile, { isLoading: saving }] = useUpdateLandlordProfileMutation()
  const [form, setForm] = useState({ 
    first_name: '', 
    last_name: '', 
    phone_number: '', 
    bio: '' 
  })
  const [initialized, setInitialized] = useState(false)

  if (profile && !initialized) {
    setForm({ 
      first_name: profile.first_name || user?.first_name || '',
      last_name: profile.last_name || user?.last_name || '',
      phone_number: profile.phone_number || user?.phone_number || '',
      bio: profile.bio || '',
    })
    setInitialized(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(form).unwrap()
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.data?.error || 'Failed to update profile')
    }
  }

  if (isLoading) return <div className="p-8"><div className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100" /></div>

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your landlord profile</p>
      </div>

      {/* User card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center">
            <span className="text-amber-600 font-black text-3xl">{user?.first_name?.[0]}</span>
          </div>
          <div>
            <p className="font-black text-slate-900 text-xl">{user?.full_name}</p>
            <p className="text-amber-600 text-sm font-semibold capitalize">{user?.role}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            {user?.phone_number && <p className="text-slate-400 text-sm">{user.phone_number}</p>}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-bold text-slate-900 mb-5">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">First Name</label>
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
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Last Name</label>
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
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
            <input 
              name="phone_number"
              value={form.phone_number} 
              onChange={e => setForm({ ...form, phone_number: e.target.value })} 
              className={inputCls} 
              placeholder="0712345678"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Bio</label>
            <textarea 
              name="bio"
              value={form.bio} 
              onChange={e => setForm({ ...form, bio: e.target.value })} 
              rows={4} 
              className={inputCls} 
              placeholder="Tell tenants about yourself..."
            />
          </div>

          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-50 transition-all">
            <Save size={15} />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LandlordProfile