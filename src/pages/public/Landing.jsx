import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import { useGetPropertiesQuery } from '../../features/properties/propertiesApi'
import { 
  Building2, 
  Smile, 
  CheckCircle2, 
  Home, 
  UserPlus, 
  Smartphone, 
  MapPin, 
  Mail, 
  ArrowRight 
} from 'lucide-react'

const HERO_IMAGE = 'https://res.cloudinary.com/dpel6a1jf/image/upload/v1783193818/stacie-ong-iwgPK6SyM_c-unsplash_ydmzzu.jpg'

function PropertyCard({ property }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-slate-100">
      <div className="relative h-52 overflow-hidden bg-slate-200">
        {property.cover_image ? (
          <img
            src={property.cover_image}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full capitalize shadow-sm">
            {property.property_type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
            property.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
          }`}>
            {property.is_active ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base truncate">{property.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-500 text-xs">{property.city}, Kenya</span>
            </div>
          </div>
        </div>

        {property.description && (
          <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">{property.description}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
              </svg>
              {property.total_units} unit{property.total_units !== 1 ? 's' : ''}
            </span>
          </div>
          <Link
            to={`/properties/${property.id}`}
            className="text-amber-600 hover:text-amber-700 text-xs font-semibold flex items-center gap-1 group/link"
          >
            View details
            <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function PropertySkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
      <div className="h-52 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
        <div className="h-3 bg-slate-100 rounded-lg w-full" />
        <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
      </div>
    </div>
  )
}

function Landing() {
  const { data, isLoading } = useGetPropertiesQuery()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Navbar — transparent on hero, solid after scroll */}
      <div className={`transition-all duration-300 ${scrolled ? '' : ''}`}>
        <Navbar transparent={!scrolled} />
      </div>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative h-screen min-h-175 flex items-end">

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="SmartRent Hero"
            className="w-full h-full object-cover"
          />
          {/* Multi-layer overlay for readability */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-slate-900/30" />
        </div>

        {/* Hero content */}
        <div className="relative max-w-7xl mx-auto px-6 pb-28 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 text-xs font-semibold tracking-widest uppercase">Built for Kenya</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Elevating{' '}
              <span className="relative">
                <span className="text-amber-400">rental</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 0 100 4 Q150 8 200 2" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              {' '}living<br />in Kenya
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
              One platform for landlords and tenants. Manage properties, sign leases, collect rent via M-Pesa, and resolve maintenance — all in one place.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="bg-amber-500 hover:bg-amber-400 text-white px-7 py-4 rounded-2xl font-bold text-base transition-all shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get started free
              </Link>
              <Link
                to="/properties"
                className="flex items-center gap-2 text-white border border-white/20 hover:border-white/40 hover:bg-white/5 px-7 py-4 rounded-2xl font-semibold text-base transition-all"
              >
                <span>Browse properties</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLOATING STATS CARD ─────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/15 border border-slate-100 grid grid-cols-3 divide-x divide-slate-100">
          {[
            { value: '500+', label: 'Properties managed', icon: <Building2 className="w-6 h-6 text-amber-500 mx-auto" /> },
            { value: '1,200+', label: 'Happy tenants', icon: <Smile className="w-6 h-6 text-amber-500 mx-auto" /> },
            { value: '98%', label: 'On-time payments', icon: <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" /> },
          ].map(({ value, label, icon }) => (
            <div key={label} className="px-8 py-6 text-center">
              <div className="mb-2">{icon}</div>
              <p className="text-3xl font-black text-slate-900">{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROPERTIES ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-600 text-sm font-bold uppercase tracking-widest mb-2">Available now</p>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              Discover your<br />next home
            </h2>
          </div>
          <Link
            to="/properties"
            className="hidden md:flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm group transition-colors"
          >
            View all properties
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <PropertySkeleton key={i} />)}
          </div>
        ) : data?.results?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.results.slice(0, 6).map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
            <Home className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-slate-400 font-medium">No properties listed yet.</p>
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link to="/properties" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold text-sm inline-block">
            View all properties
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-4xl font-black text-white">How SmartRent works</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">From listing to lease to rent collection — everything in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your account',
                desc: 'Sign up as a landlord or tenant in under a minute. Choose your role and get instant access.',
                icon: <UserPlus className="w-8 h-8 text-amber-400" />,
              },
              {
                step: '02',
                title: 'List or find a unit',
                desc: 'Landlords list properties with photos. Tenants browse real listings and connect with landlords.',
                icon: <Home className="w-8 h-8 text-amber-400" />,
              },
              {
                step: '03',
                title: 'Pay rent via M-Pesa',
                desc: 'Tenants receive an STK push directly on their phone. Landlords track every payment in real time.',
                icon: <Smartphone className="w-8 h-8 text-amber-400" />,
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="relative">
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/5 h-full hover:border-amber-500/20 hover:bg-slate-800/80 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div>{icon}</div>
                    <span className="text-slate-600 text-5xl font-black leading-none">{step}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-amber-500 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to transform<br />how you manage property?</h2>
          <p className="text-amber-100 mb-8 text-lg">Join SmartRent today — free to get started.</p>
          <Link
            to="/register"
            className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 rounded-2xl font-bold text-base inline-block transition-all shadow-2xl shadow-amber-900/20 hover:-translate-y-0.5"
          >
            Create your free account
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
                  <span className="text-white font-black text-base">S</span>
                </div>
                <span className="text-white font-bold text-xl">SmartRent</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                A modern property management platform built specifically for landlords and tenants in Kenya. Powered by M-Pesa.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">Platform</p>
              <div className="space-y-3">
                {[['/', 'Home'], ['/properties', 'Properties'], ['/about', 'About Us'], ['/login', 'Log in']].map(([to, label]) => (
                  <Link key={to} to={to} className="block text-slate-500 hover:text-slate-300 text-sm transition-colors">{label}</Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-white font-semibold text-sm mb-4">Contact</p>
              <div className="space-y-3 text-sm text-slate-500">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-500" /> Nairobi, Kenya
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 shrink-0 text-slate-500" /> hello@smartrent.co.ke
                </p>
                <p className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 shrink-0 text-slate-500" /> M-Pesa integrated
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">© 2026 SmartRent. All rights reserved.</p>
            <p className="text-slate-600 text-sm">Built for Kenya </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing