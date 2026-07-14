import { useState } from 'react'
import { useGetAllUsersQuery } from '../../features/auth/authApi'
import { Search, Shield, Building2, Home, CheckCircle, XCircle, Users as UsersIcon, UserPlus } from 'lucide-react'

function RoleBadge({ role }) {
  const map = {
    admin: 'bg-surface-container text-secondary',
    landlord: 'bg-warning-container text-warning',
    tenant: 'bg-success-container text-success',
  }
  const icons = { admin: Shield, landlord: Building2, tenant: Home }
  const Icon = icons[role] || Shield
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[role] || 'bg-surface-container-highest text-on-surface-variant'}`}>
      <Icon size={11} />{role}
    </span>
  )
}

function AdminUsers() {
  const { data: users, isLoading } = useGetAllUsersQuery()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = (users || []).filter(u => {
    const matchSearch = search === '' ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const counts = {
    all: (users || []).length,
    admin: (users || []).filter(u => u.role === 'admin').length,
    landlord: (users || []).filter(u => u.role === 'landlord').length,
    tenant: (users || []).filter(u => u.role === 'tenant').length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">User Management</p>
          <h2 className="text-display-lg text-primary tracking-tight">Users</h2>
          <p className="text-body-md text-on-surface-variant mt-2">{(users || []).length} registered users on the platform</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          ['All Users', counts.all, 'bg-primary-container text-on-primary-container'],
          ['Admins', counts.admin, 'bg-secondary/10 text-secondary'],
          ['Landlords', counts.landlord, 'bg-warning-container text-warning'],
          ['Tenants', counts.tenant, 'bg-success-container text-success'],
        ].map(([label, count, bg]) => (
          <div key={label} className={`glass-panel ambient-shadow rounded-2xl p-5 border border-outline-variant/30 ${bg}`}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70">{label}</p>
            <p className="text-3xl font-black">{count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-11 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
          />
        </div>
        <div className="flex gap-1 bg-surface-container rounded-xl p-1">
          {['all', 'admin', 'landlord', 'tenant'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                roleFilter === role
                  ? 'bg-white text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="grid grid-cols-5 bg-surface-container-low border-b border-outline-variant/30 px-6 py-3">
          {['User', 'Email', 'Phone', 'Role', 'Status'].map(h => (
            <p key={h} className="text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</p>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-px">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="grid grid-cols-5 px-6 py-4 animate-pulse gap-4">
                {[1,2,3,4,5].map(j => <div key={j} className="h-4 bg-surface-container rounded" />)}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <UsersIcon size={32} className="text-outline mx-auto mb-2" />
            <p className="text-on-surface-variant text-sm">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {filtered.map(u => (
              <div key={u.id} className="grid grid-cols-5 px-6 py-4 hover:bg-surface-container-low transition-colors items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="text-secondary font-bold text-sm">{u.first_name?.[0] || '?'}</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface truncate">{u.full_name || 'Unnamed'}</p>
                </div>
                <p className="text-sm text-on-surface-variant truncate">{u.email}</p>
                <p className="text-sm text-on-surface-variant">{u.phone_number || '—'}</p>
                <RoleBadge role={u.role} />
                <div className="flex items-center gap-1.5">
                  {u.is_active
                    ? (
                      <>
                        <CheckCircle size={13} className="text-success" />
                        <span className="text-xs text-success font-medium">Active</span>
                      </>
                    )
                    : (
                      <>
                        <XCircle size={13} className="text-error" />
                        <span className="text-xs text-error font-medium">Inactive</span>
                      </>
                    )
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers