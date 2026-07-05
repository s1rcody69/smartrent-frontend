import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCredentials } from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApi'
import {
  LayoutDashboard, Building2, FileText, Wrench,
  CreditCard, LogOut, ChevronRight, User
} from 'lucide-react'

function DashboardSidebar({ links }) {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, refreshToken } = useSelector(s => s.auth)
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try { if (refreshToken) await logout(refreshToken).unwrap() } catch (e) {}
    dispatch(clearCredentials())
    navigate('/')
  }

  const isActive = (path) => location.pathname === path ||
    (path !== '/landlord/dashboard' && location.pathname.startsWith(path))

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-slate-900 flex flex-col z-40 border-r border-white/5">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-white font-bold text-base">SmartRent</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <span className="text-amber-400 font-bold text-sm">{user?.first_name?.[0]}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.full_name}</p>
            <p className="text-amber-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, Icon }) => {
          const active = isActive(to)
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} className={active ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-white/60" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link
          to={`/${user?.role}/profile`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <User size={17} className="text-slate-500 group-hover:text-white" />
          <span>My Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={17} className="text-slate-500 group-hover:text-red-400" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

export default DashboardSidebar