import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation, useRegisterMutation } from '../../features/auth/authApi'
import { setCredentials } from '../../features/auth/authSlice'
import toast from 'react-hot-toast'

function AuthPage() {
  const [mode, setMode] = useState('login')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading: loginLoading }] = useLoginMutation()
  const [register, { isLoading: registerLoading }] = useRegisterMutation()
  const isLoading = loginLoading || registerLoading

  const [form, setForm] = useState({
    email: '', password: '', confirm_password: '',
    first_name: '', last_name: '', phone_number: '', role: 'tenant',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const redirectByRole = (role) => {
    if (role === 'admin') navigate('/admin/dashboard')
    else if (role === 'landlord') navigate('/landlord/dashboard')
    else navigate('/tenant/dashboard')
  }

  const parseError = (err) => {
    if (!err?.data) return 'Something went wrong. Please try again.'
    if (err.data.error) return err.data.error
    if (err.data.detail) return err.data.detail
    const first = Object.values(err.data)[0]
    return Array.isArray(first) ? first[0] : first
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const fn = mode === 'login' ? login : register
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : form
      const res = await fn(payload).unwrap()
      dispatch(setCredentials(res))
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
      redirectByRole(res.user.role)
    } catch (err) {
      toast.error(parseError(err))
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Top bar */}
      <div className="px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <span className="text-amber-400 font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-slate-900">SmartRent</span>
        </Link>
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">← Back to home</Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login' ? 'Log in to your SmartRent account' : 'Get started in under a minute'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

            {/* Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-7">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'login' ? 'Log in' : 'Sign up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {mode === 'register' && (
                <>
                  {/* Role selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">I am a</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['landlord', 'tenant'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setForm({ ...form, role: r })}
                          className={`py-3 px-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                            form.role === r
                              ? 'border-amber-500 bg-amber-50 text-amber-800'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span className="block text-base mb-0.5">{r === 'landlord' ? '🏢' : '🏠'}</span>
                          <span className="capitalize">{r}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[['first_name', 'First name'], ['last_name', 'Last name']].map(([name, label]) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                        <input name={name} value={form[name]} onChange={handleChange} required
                          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone number</label>
                    <input name="phone_number" value={form.phone_number} onChange={handleChange}
                      placeholder="0712345678"
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
                  <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} required minLength={8}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 mt-2"
              >
                {isLoading
                  ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
                  : (mode === 'login' ? 'Log in' : 'Create account')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage