import { useState } from 'react'
import { Users, Search, Shield, Building2, Home, Loader } from 'lucide-react'
import { useGetAllUsersQuery } from '../../features/auth/authApi'

function RoleBadge({ role }) {
  const map = {
    admin: 'bg-purple-50 text-purple-700',
    landlord: 'bg-amber-50 text-amber-700',
    tenant: 'bg-emerald-50 text-emerald-700',
  }
  const icons = { admin: Shield, landlord: Building2, tenant: Home }
  const Icon = icons[role] || Shield
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[role] || 'bg-slate-100 text-slate-600'}`}>
      <Icon size={11} />{role}
    </span>
  )
}

function AdminUsers() {
  const [search, setSearch] = useState('')
  const { data: users, isLoading, error } = useGetAllUsersQuery()

  // Filter users based on search
  const filteredUsers = users?.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Users</h1>
        <p className="text-slate-500 text-sm mt-1">Manage platform users</p>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={32} className="text-amber-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>Failed to load users</p>
            <p className="text-xs text-slate-400 mt-2">Only admins can view all users.</p>
          </div>
        ) : users?.length === 0 ? (
          <div className="text-center py-20">
            <Users size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No users found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-100 px-6 py-3">
              {['Name', 'Email', 'Role', 'Joined'].map(h => (
                <p key={h} className="text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</p>
              ))}
            </div>

            {filteredUsers.map(user => (
              <div key={user.id} className="grid grid-cols-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 font-bold text-sm">{user.first_name?.[0] || '?'}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{user.full_name || 'Unnamed'}</p>
                </div>
                <p className="text-sm text-slate-500">{user.email}</p>
                <RoleBadge role={user.role} />
                <p className="text-sm text-slate-400">{new Date(user.date_joined).toLocaleDateString()}</p>
              </div>
            ))}

            {filteredUsers.length === 0 && search && (
              <div className="text-center py-10 text-slate-400 text-sm">
                No users found matching "{search}"
              </div>
            )}
          </>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        Showing {filteredUsers.length} of {users?.length || 0} total users
      </p>
    </div>
  )
}

export default AdminUsers