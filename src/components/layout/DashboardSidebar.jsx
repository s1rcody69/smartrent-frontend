import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCredentials } from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApi'
import { SmartRentWordmark } from './SmartRentLogo'
import {
  LayoutDashboard, Building2, FileText, Wrench,
  CreditCard, LogOut, ChevronRight, User, Settings, HelpCircle
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
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-surface-container glass-panel flex flex-col z-40 border-r border-outline-variant/30 shadow-custom">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-outline-variant/20">
        <Link to="/" className="flex items-center group hover:opacity-90 transition-opacity">
          <SmartRentWordmark size={40} theme="light" />
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-outline-variant/20">
        <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-3 py-3 border border-outline-variant/20">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
            <span className="text-secondary font-bold text-sm">{user?.first_name?.[0]}</span>
          </div>
          <div className="min-w-0">
            <p className="text-on-surface text-sm font-semibold truncate">{user?.full_name}</p>
            <p className="text-on-surface-variant text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scrollbar">
        {links.map(({ to, label, Icon }) => {
          const active = isActive(to)
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <Icon size={17} className={active ? 'text-white' : 'text-on-surface-variant group-hover:text-on-surface'} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-white/60" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-outline-variant/20 space-y-1">
        <Link
          to={`/${user?.role}/profile`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all group"
        >
          <User size={17} className="text-on-surface-variant group-hover:text-on-surface" />
          <span>My Profile</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error-container transition-all group"
        >
          <LogOut size={17} className="text-on-surface-variant group-hover:text-error" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

export default DashboardSidebar