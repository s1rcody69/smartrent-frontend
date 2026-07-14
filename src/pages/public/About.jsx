import Navbar from '../../components/layout/Navbar'
import { Link } from 'react-router-dom'
import { Shield, Smartphone, BarChart3, Wrench, FileText, Building2, MapPin, Mail, Smartphone as PhoneIcon, ChevronRight, Zap } from 'lucide-react'
import { SmartRentInline } from '../../components/layout/SmartRentLogo'

const HERO_IMAGE = 'https://res.cloudinary.com/dpel6a1jf/image/upload/v1783193818/stacie-ong-iwgPK6SyM_c-unsplash_ydmzzu.jpg'

function About() {
  return (
    <div className="min-h-screen bg-background font-body-md">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20 bg-primary-container overflow-hidden hero-gradient">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="About SmartRent" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-linear-to-r from-primary-container via-primary-container/95 to-primary-container/80" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary text-xs font-semibold tracking-widest uppercase">Our Story</span>
          </div>
          <h1 className="text-display-lg md:text-[64px] md:leading-18 text-secondary leading-tight mb-6">
            Built for Kenya's<br />
            <span className="text-secondary">rental market</span>
          </h1>
          <p className="text-body-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            SmartRent was built to solve a real problem — most Kenyan landlords still manage properties through spreadsheets, WhatsApp groups, and paper receipts. We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 grid grid-cols-3 divide-x divide-outline-variant/30">
          {[
            ['500+', 'Properties managed'],
            ['1,200+', 'Tenants served'],
            ['98%', 'On-time payments'],
          ].map(([n, l]) => (
            <div key={l} className="px-8 py-6 text-center">
              <p className="text-3xl font-black text-secondary">{n}</p>
              <p className="text-on-surface-variant text-sm mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-container-max mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-label-md text-secondary font-bold uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="text-display-lg text-primary leading-tight mb-6">
              Digitalising the Kenyan rental experience
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">
              We connect landlords and tenants through a secure, modern platform that handles every part of the rental relationship — from signing leases to collecting rent via M-Pesa to resolving maintenance requests.
            </p>
            <p className="text-body-md text-on-surface-variant leading-relaxed mb-8">
              No more chasing tenants for rent. No more lost maintenance requests. No more spreadsheets. Just a clean, professional system that works for everyone involved.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5">
              Get started free <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              [Shield, 'Secure by default', 'JWT authentication with role-based access control for every endpoint.'],
              [Smartphone, 'M-Pesa native', 'Pay rent directly from your phone. No card, no bank, just M-Pesa.'],
              [BarChart3, 'Real analytics', 'Landlords see revenue, occupancy, and payment history in real time.'],
              [Wrench, 'Maintenance tracking', 'Tenants submit requests. Landlords track them from pending to complete.'],
              [FileText, 'Digital leases', 'Sign and manage lease agreements digitally, with full history.'],
              [Building2, 'Any property type', 'Apartments, houses, bedsitters, and commercial units — all supported.'],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 p-5 hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-shadow">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                  <Icon size={17} className="text-secondary" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface text-sm mb-1">{title}</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to modernise your rental business?</h2>
          <p className="text-secondary/80 mb-8 text-lg">Join SmartRent today — free to get started.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="bg-white text-secondary hover:bg-secondary/10 px-7 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5">
              Create account
            </Link>
            <Link to="/properties" className="border border-white/30 hover:border-white/50 text-white px-7 py-3.5 rounded-xl font-semibold transition-all hover:bg-white/5">
              Browse properties
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                  <PhoneIcon className="w-4 h-4 shrink-0" /> M-Pesa integrated
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

export default About
