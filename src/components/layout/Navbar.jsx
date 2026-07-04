import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCredentials } from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApi'
import { useState } from 'react'

function Navbar() {
  const { user, refreshToken } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logout] = useLogoutMutation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      if (refreshToken) await logout(refreshToken).unwrap()
    } catch (e) {}
    dispatch(clearCredentials())
    navigate('/')
  }

  const dashboardPath = user?.role === 'landlord'
    ? '/landlord/dashboard'
    : user?.role === 'tenant'
    ? '/tenant/dashboard'
    : '/admin/dashboard'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">SmartRent</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
            Home
          </Link>
          <Link to="/properties" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
            Properties
          </Link>
          <Link to="/about" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
            About Us
          </Link>
          {user && (
            <Link to={dashboardPath} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <Link
              to="/login"
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Log in
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white text-sm font-medium leading-none">{user.full_name}</p>
                <p className="text-amber-500 text-xs mt-0.5 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-current"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-6 py-4 space-y-3">
          <Link to="/" className="block text-slate-400 hover:text-white text-sm py-1" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/properties" className="block text-slate-400 hover:text-white text-sm py-1" onClick={() => setMenuOpen(false)}>Properties</Link>
          <Link to="/about" className="block text-slate-400 hover:text-white text-sm py-1" onClick={() => setMenuOpen(false)}>About Us</Link>
          {user && <Link to={dashboardPath} className="block text-slate-400 hover:text-white text-sm py-1" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {!user
            ? <Link to="/login" className="block text-amber-500 text-sm py-1 font-medium" onClick={() => setMenuOpen(false)}>Log in</Link>
            : <button onClick={handleLogout} className="block text-slate-400 text-sm py-1">Log out</button>
          }
        </div>
      )}
    </nav>
  )
}

export default Navbar