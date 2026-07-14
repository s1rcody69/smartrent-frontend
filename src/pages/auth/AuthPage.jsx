import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation, useRegisterMutation } from '../../features/auth/authApi'
import { setCredentials } from '../../features/auth/authSlice'
import { SmartRentInline } from '../../components/layout/SmartRentLogo'
import toast from 'react-hot-toast'
import { Building2, Home, ArrowLeft, Eye, EyeOff, Phone, Mail, User, Lock, ChevronRight } from 'lucide-react'

const HERO_IMAGE = 'https://res.cloudinary.com/dpel6a1jf/image/upload/v1783193818/stacie-ong-iwgPK6SyM_c-unsplash_ydmzzu.jpg'

function InputField({ label, icon: Icon, type = 'text', name, value, onChange, placeholder, required, minLength, rightElement }) {
  return (
    <div>
      <label className="block text-label-sm text-label-sm text-on-surface-variant font-medium mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant">
            <Icon size={17} />
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
          className={`w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all ${
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
        : {
            email: form.email,
            password: form.password,
            password2: form.confirm_password,
            first_name: form.first_name,
            last_name: form.last_name,
            phone_number: form.phone_number,
            role: form.role,
          }
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
    <button type="button" onClick={toggle} className="text-on-surface-variant hover:text-on-surface transition-colors">
      {show ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  )

  return (
    <div className="min-h-screen flex bg-background">

      {/* Left — form panel */}
      <div className="w-full lg:w-1/2 flex flex-col bg-surface-container-lowest">

        {/* Top bar */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-outline-variant/30">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <SmartRentInline size={32} theme="light" />
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface text-sm font-medium transition-colors">
            <ArrowLeft size={15} />
            Back to home
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-display-lg text-display-lg text-primary leading-tight tracking-tight">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-body-md text-body-md text-on-surface-variant mt-2">
                {mode === 'login'
                  ? 'Log in to your SmartRent account to continue'
                  : 'Get started with SmartRent — free to sign up'}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex bg-surface-container rounded-xl p-1 mb-8">
              {[['login', 'Log in'], ['register', 'Sign up']].map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === m
                      ? 'bg-white text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {mode === 'register' && (
                <>
                  {/* Role selector */}
                  <div>
                    <label className="block text-label-sm text-label-sm text-on-surface-variant font-medium mb-2">
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
                          className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                            form.role === role
                              ? 'border-secondary bg-secondary/5'
                              : 'border-outline-variant hover:border-outline bg-surface-container-lowest'
                          }`}
                        >
                          <Icon
                            size={20}
                            className={form.role === role ? 'text-secondary' : 'text-on-surface-variant'}
                          />
                          <p className={`font-bold text-sm mt-2 ${form.role === role ? 'text-secondary' : 'text-on-surface'}`}>
                            {label}
                          </p>
                          <p className={`text-xs mt-0.5 ${form.role === role ? 'text-secondary/70' : 'text-on-surface-variant'}`}>
                            {desc}
                          </p>
                          {form.role === role && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
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
                    <InputField label="First name" icon={User} name="first_name" value={form.first_name} onChange={handleChange} required placeholder="John" />
                    <InputField label="Last name" icon={User} name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Doe" />
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
                placeholder="••••••••"
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
                  placeholder="••••••••"
                  rightElement={eyeButton(showConfirm, () => setShowConfirm(!showConfirm))}
                />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-3.5 rounded-lg font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5 active:translate-y-0 mt-2"
              >
                {isLoading
                  ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
                  : (mode === 'login' ? 'Log in to SmartRent' : 'Create my account')}
              </button>
            </form>

            <p className="text-center text-xs text-on-surface-variant/60 mt-6">
              By continuing you agree to SmartRent's{' '}
              <span className="text-secondary hover:underline cursor-pointer">Terms of Service</span>
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
        <div className="absolute inset-0 bg-linear-to-br from-primary/70 via-primary/40 to-transparent" />

        {/* Clean hero section - no text overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-12" />
      </div>
     
      

    </div>
  )
}

export default AuthPage