import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../../components/layout/Navbar'
import { useGetPropertiesQuery } from '../../features/properties/propertiesApi'
import { SmartRentInline } from '../../components/layout/SmartRentLogo'
import { 
  Building2, 
  Smile, 
  CheckCircle2, 
  Home, 
  UserPlus, 
  Smartphone, 
  MapPin, 
  Mail, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'

const HERO_IMAGE = 'https://res.cloudinary.com/dpel6a1jf/image/upload/v1783193818/stacie-ong-iwgPK6SyM_c-unsplash_ydmzzu.jpg'

function PropertyCard({ property }) {
  return (
    <div className="group glass-panel ambient-shadow rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-all duration-500 hover:-translate-y-1 border border-outline-variant/30">
      <div className="relative h-52 overflow-hidden bg-surface-container">
        {property.cover_image ? (
          <img
            src={property.cover_image}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-surface-container to-surface-container-highest flex items-center justify-center">
            <Building2 size={48} className="text-outline" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface text-xs font-semibold px-3 py-1.5 rounded-full capitalize shadow-sm border border-outline-variant/20">
            {property.property_type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
            property.is_active ? 'bg-success-container text-success' : 'bg-surface-container-highest text-on-surface-variant'
          }`}>
            {property.is_active ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-headline-md text-headline-md text-on-surface truncate">{property.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={14} className="text-secondary shrink-0" />
              <span className="text-on-surface-variant text-xs">{property.city}, Kenya</span>
            </div>
          </div>
        </div>

        {property.description && (
          <p className="text-on-surface-variant text-xs leading-relaxed mb-4 line-clamp-2">{property.description}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Building2 size={14} />
              {property.total_units} unit{property.total_units !== 1 ? 's' : ''}
            </span>
          </div>
          <Link
            to={`/properties/${property.id}`}
            className="text-secondary hover:text-secondary/80 text-xs font-semibold flex items-center gap-1 group/link"
          >
            View details
            <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function PropertySkeleton() {
  return (
    <div className="glass-panel ambient-shadow rounded-2xl overflow-hidden border border-outline-variant/30 animate-pulse">
      <div className="h-52 bg-surface-container" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-surface-container rounded-lg w-3/4" />
        <div className="h-3 bg-surface-container rounded-lg w-1/2" />
        <div className="h-3 bg-surface-container rounded-lg w-full" />
        <div className="h-3 bg-surface-container rounded-lg w-2/3" />
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
    <div className="min-h-screen bg-background font-body-md">

      {/* Navbar */}
      <Navbar transparent={!scrolled} />

      {/* HERO */}
      <section className="relative h-screen min-h-175 flex items-end hero-gradient">

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="SmartRent Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-primary/30" />
        </div>

        {/* Hero content */}
        <div className="relative max-w-container-max mx-auto px-margin-desktop pb-28 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 text-secondary mb-6">
              <span className="text-label-sm font-semibold">NEW: AI-POWERED LEASING</span>
              <Zap size={14} />
            </div>

            <h1 className="text-display-lg md:text-[64px] md:leading-18 text-white leading-[1.05] tracking-tight mb-6">
              The Future of Rental <br />
              <span className="text-secondary">Management</span> is Here
            </h1>

            <p className="text-body-lg text-white/70 leading-relaxed mb-8 max-w-xl">
              Automate your entire portfolio lifecycle. From instant lease generation to intelligent payment reconciliation, SmartRent gives you total control without the manual overhead.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-secondary/30 hover:shadow-secondary/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Your Free Trial
              </Link>
              <Link
                to="/properties"
                className="flex items-center gap-2 text-white border border-white/20 hover:border-white/40 hover:bg-white/5 px-7 py-4 rounded-xl font-semibold text-base transition-all"
              >
                <span>Browse properties</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING STATS CARD */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 -mt-16">
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 grid grid-cols-3 divide-x divide-outline-variant/30">
          {[
            { value: '500+', label: 'Properties managed', icon: <Building2 className="w-6 h-6 text-secondary mx-auto" /> },
            { value: '1,200+', label: 'Happy tenants', icon: <Smile className="w-6 h-6 text-secondary mx-auto" /> },
            { value: '98%', label: 'On-time payments', icon: <CheckCircle2 className="w-6 h-6 text-success mx-auto" /> },
          ].map(({ value, label, icon }) => (
            <div key={label} className="px-8 py-6 text-center">
              <div className="mb-2">{icon}</div>
              <p className="text-3xl font-black text-on-surface">{value}</p>
              <p className="text-on-surface-variant text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROPERTIES */}
      <section className="max-w-container-max mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-label-md text-secondary font-bold uppercase tracking-widest mb-2">Available now</p>
            <h2 className="text-display-lg text-primary leading-tight">
              Discover your<br />next home
            </h2>
          </div>
          <Link
            to="/properties"
            className="hidden md:flex items-center gap-2 text-on-surface-variant hover:text-on-surface font-semibold text-sm group transition-colors"
          >
            View all properties
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
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
          <div className="text-center py-20 glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center">
            <Home size={40} className="text-outline mb-3" />
            <p className="text-on-surface-variant font-medium">No properties listed yet.</p>
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link to="/properties" className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold text-sm inline-block shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all">
            View all properties
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-primary-container py-24">
        <div className="max-w-container-max mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-label-md text-secondary font-bold uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-display-lg text-secondary">How SmartRent works</h2>
            <p className="text-on-primary-container mt-3 max-w-xl mx-auto">From listing to lease to rent collection — everything in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create your account',
                desc: 'Sign up as a landlord or tenant in under a minute. Choose your role and get instant access.',
                icon: <UserPlus className="w-8 h-8 text-secondary" />,
              },
              {
                step: '02',
                title: 'List or find a unit',
                desc: 'Landlords list properties with photos. Tenants browse real listings and connect with landlords.',
                icon: <Home className="w-8 h-8 text-secondary" />,
              },
              {
                step: '03',
                title: 'Pay rent via M-Pesa',
                desc: 'Tenants receive an STK push directly on their phone. Landlords track every payment in real time.',
                icon: <Smartphone className="w-8 h-8 text-secondary" />,
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="relative">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full hover:border-secondary/30 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div>{icon}</div>
                    <span className="text-on-primary-container text-5xl font-black leading-none">{step}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                  <p className="text-on-primary-container text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-secondary py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to automate your property management?</h2>
          <p className="text-secondary/80 mb-8 text-lg">Join thousands of landlords who have regained their time and increased their yields with SmartRent.</p>
          <Link
            to="/register"
            className="bg-white text-secondary hover:bg-secondary/10 px-8 py-4 rounded-xl font-bold text-base inline-block transition-all shadow-2xl shadow-secondary/20 hover:-translate-y-0.5"
          >
            Start Your 14-Day Free Trial
          </Link>
          <p className="text-secondary/70 text-sm mt-4">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary-container py-16">
        <div className="max-w-container-max mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <SmartRentInline size={32} theme="dark" />
              </div>
              <p className="text-on-primary-container text-sm leading-relaxed max-w-xs">
                A modern property management platform built specifically for landlords and tenants in Kenya. Powered by M-Pesa.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-secondary font-semibold text-sm mb-4">Platform</p>
              <div className="space-y-3">
                {[['/', 'Home'], ['/properties', 'Properties'], ['/about', 'About Us'], ['/login', 'Log in']].map(([to, label]) => (
                  <Link key={to} to={to} className="block text-on-primary-container hover:text-white text-sm transition-colors">{label}</Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-secondary font-semibold text-sm mb-4">Contact</p>
              <div className="space-y-3 text-sm text-on-primary-container">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 shrink-0" /> Nairobi, Kenya
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 shrink-0" /> hello@smartrent.co.ke
                </p>
                <p className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 shrink-0" /> M-Pesa integrated
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-on-primary-container text-sm">© 2026 SmartRent. All rights reserved.</p>
            <p className="text-on-primary-container text-sm">Built for Kenya</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing