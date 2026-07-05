import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCredentials } from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApi'
import { useState } from 'react'
import { SmartRentInline } from './SmartRentLogo' // Imported the logo component

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
        : 'bg-slate-900/95 backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo — Replaced old text/avatar block with modern vector element */}
        <Link to="/" className="flex items-center group hover:opacity-95 transition-opacity">
          <SmartRentInline size={45} theme="dark" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(to)
                  ? 'text-white bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
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
              <Link to="/login" className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
              >
                Get started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-xl px-4 py-2.5 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{user.first_name?.[0]}</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-xs font-semibold leading-none">{user.first_name}</p>
                  <p className="text-amber-400 text-xs mt-0.5 capitalize">{user.role}</p>
                </div>
                <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                  <Link to={dashboardPath} onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                    <span>Dashboard</span>
                  </Link>
                  <div className="border-t border-white/10" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors">
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/5 px-6 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors">
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 mt-3">
            {!user ? (
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-amber-500 text-white px-4 py-3 rounded-xl text-sm font-semibold">
                Log in
              </Link>
            ) : (
              <button onClick={handleLogout}
                className="block w-full text-center text-red-400 text-sm py-2">
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