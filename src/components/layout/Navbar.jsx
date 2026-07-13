import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCredentials } from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApi'
import { useState } from 'react'
import { SmartRentInline } from './SmartRentLogo'
import { LayoutDashboard, LogOut, Menu, X, User, ChevronDown } from 'lucide-react'

function Navbar({ transparent = false }) {
  const { user, refreshToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()
  const [logout] = useLogoutMutation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try { if (refreshToken) await logout(refreshToken).unwrap() } catch (e) {}
    dispatch(clearCredentials())
    setDropdownOpen(false)
  }

  const dashboardPath = user?.role === 'landlord'
    ? '/landlord/dashboard'
    : user?.role === 'tenant'
    ? '/tenant/dashboard'
    : '/admin/dashboard'

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/about', label: 'About Us' },
    ...(user ? [{ to: dashboardPath, label: 'Dashboard' }] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent
        ? 'bg-transparent'
        : 'bg-white/80 backdrop-blur-md border-b border-outline-variant/30'
    }`}>
      <div className="max-w-container-max mx-auto px-margin-desktop h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center group hover:opacity-90 transition-opacity">
          <SmartRentInline size={42} theme={transparent ? 'dark' : 'light'} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(to)
                  ? 'bg-secondary text-white'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-on-surface-variant hover:text-on-surface text-sm font-medium px-4 py-2 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5"
              >
                Get started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-surface-container hover:bg-surface-container-high rounded-xl px-4 py-2.5 transition-colors border border-outline-variant/30"
              >
                <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <span className="text-secondary font-bold text-xs">{user.first_name?.[0]}</span>
                </div>
                <div className="text-left">
                  <p className="text-on-surface text-xs font-semibold leading-none">{user.first_name}</p>
                  <p className="text-on-surface-variant text-xs mt-0.5 capitalize">{user.role}</p>
                </div>
                <ChevronDown size={14} className="text-on-surface-variant" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest glass-panel rounded-xl border border-outline-variant/30 shadow-custom overflow-hidden">
                  <Link
                    to={dashboardPath}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <LayoutDashboard size={16} className="text-secondary" />
                    <span>Dashboard</span>
                  </Link>
                  <div className="border-t border-outline-variant/20" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error-container transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-on-surface p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-outline-variant/30 px-6 py-4 space-y-1 shadow-custom">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-outline-variant/20 mt-3">
            {!user ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-secondary text-white px-4 py-3 rounded-lg text-sm font-semibold"
              >
                Log in
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-center text-error text-sm py-2"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar