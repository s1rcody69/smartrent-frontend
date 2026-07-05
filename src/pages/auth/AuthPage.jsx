import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation, useRegisterMutation } from '../../features/auth/authApi'
import { setCredentials } from '../../features/auth/authSlice'
import toast from 'react-hot-toast'
import { Building2, Home, ArrowLeft, Eye, EyeOff, Phone, Mail, User, Lock } from 'lucide-react'

const HERO_IMAGE = 'https://res.cloudinary.com/dpel6a1jf/image/upload/v1783193818/stacie-ong-iwgPK6SyM_c-unsplash_ydmzzu.jpg'

function InputField({ label, icon: Icon, type = 'text', name, value, onChange, placeholder, required, minLength, rightElement }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={15} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all ${
            Icon ? 'pl-10' : 'pl-4'
          } ${rightElement ? 'pr-11' : 'pr-4'}`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  )
}

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
    return Array.isArray(first) ? first[0] : String(first)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : form
      const fn = mode === 'login' ? login : register
      const res = await fn(payload).unwrap()
      dispatch(setCredentials(res))
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created successfully!')
      redirectByRole(res.user.role)
    } catch (err) {
      toast.error(parseError(err))
    }
  }

  const eyeButton = (show, toggle) => (
    <button type="button" onClick={toggle} className="text-slate-400 hover:text-slate-600 transition-colors">
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  )

  return (
    <div className="min-h-screen flex">

      {/* Left — form panel */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">

        {/* Top bar */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-bold text-slate-900 text-lg">SmartRent</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">
            <ArrowLeft size={15} />
            Back to home
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                {mode === 'login'
                  ? 'Log in to your SmartRent account to continue'
                  : 'Get started with SmartRent — free to sign up'}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
              {[['login', 'Log in'], ['register', 'Sign up']].map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    mode === m
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {mode === 'register' && (
                <>
                  {/* Role selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      I am a
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { role: 'tenant', label: 'Tenant', desc: 'Looking to rent', Icon: Home },
                        { role: 'landlord', label: 'Landlord', desc: 'I own property', Icon: Building2 },
                      ].map(({ role, label, desc, Icon }) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setForm({ ...form, role })}
                          className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                            form.role === role
                              ? 'border-amber-500 bg-amber-50'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <Icon
                            size={20}
                            className={form.role === role ? 'text-amber-600' : 'text-slate-400'}
                          />
                          <p className={`font-bold text-sm mt-2 ${form.role === role ? 'text-amber-800' : 'text-slate-700'}`}>
                            {label}
                          </p>
                          <p className={`text-xs mt-0.5 ${form.role === role ? 'text-amber-600' : 'text-slate-400'}`}>
                            {desc}
                          </p>
                          {form.role === role && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="First name" icon={User} name="first_name" value={form.first_name} onChange={handleChange} required />
                    <InputField label="Last name" icon={User} name="last_name" value={form.last_name} onChange={handleChange} required />
                  </div>

                  <InputField
                    label="Phone number"
                    icon={Phone}
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="0712 345 678"
                  />
                </>
              )}

              <InputField
                label="Email address"
                icon={Mail}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />

              <InputField
                label="Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                rightElement={eyeButton(showPassword, () => setShowPassword(!showPassword))}
              />

              {mode === 'register' && (
                <InputField
                  label="Confirm password"
                  icon={Lock}
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  rightElement={eyeButton(showConfirm, () => setShowConfirm(!showConfirm))}
                />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5 active:translate-y-0 mt-2"
              >
                {isLoading
                  ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
                  : (mode === 'login' ? 'Log in to SmartRent' : 'Create my account')}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-6">
              By continuing you agree to SmartRent's{' '}
              <span className="text-slate-600 underline cursor-pointer">Terms of Service</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right — image panel (desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="SmartRent property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/70 via-slate-900/40 to-transparent" />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-sm">
            <p className="text-white font-bold text-lg leading-snug mb-3">
              "SmartRent made managing my 3 properties so much easier."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">James Kamau</p>
                <p className="text-white/60 text-xs">Landlord, Nairobi</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-white/70 text-xs ml-1">Trusted by 1,200+ tenants</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage