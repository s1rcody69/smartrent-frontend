import Navbar from '../../components/layout/Navbar'
import { Link } from 'react-router-dom'
import { Shield, Smartphone, BarChart3, Wrench, FileText, Building2, MapPin, Mail, Smartphone as PhoneIcon } from 'lucide-react'
import { SmartRentInline } from '../../components/layout/SmartRentLogo'

const HERO_IMAGE = 'https://res.cloudinary.com/dpel6a1jf/image/upload/v1783193818/stacie-ong-iwgPK6SyM_c-unsplash_ydmzzu.jpg'

function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="About SmartRent" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300 text-xs font-semibold tracking-widest uppercase">Our Story</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Built for Kenya's<br />
            <span className="text-amber-400">rental market</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            SmartRent was built to solve a real problem — most Kenyan landlords still manage properties through spreadsheets, WhatsApp groups, and paper receipts. We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 grid grid-cols-3 divide-x divide-slate-100">
          {[
            ['500+', 'Properties managed'],
            ['1,200+', 'Tenants served'],
            ['98%', 'On-time payments'],
          ].map(([n, l]) => (
            <div key={l} className="px-8 py-6 text-center">
              <p className="text-3xl font-black text-amber-600">{n}</p>
              <p className="text-slate-500 text-sm mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-600 text-sm font-bold uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="text-4xl font-black text-slate-900 leading-tight mb-6">
              Digitalising the Kenyan rental experience
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We connect landlords and tenants through a secure, modern platform that handles every part of the rental relationship — from signing leases to collecting rent via M-Pesa to resolving maintenance requests.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              No more chasing tenants for rent. No more lost maintenance requests. No more spreadsheets. Just a clean, professional system that works for everyone involved.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/25">
              Get started free
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
              <div key={title} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                  <Icon size={17} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to modernise your rental business?</h2>
          <p className="text-slate-400 mb-8">Join SmartRent today — free to get started.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="bg-amber-500 hover:bg-amber-400 text-white px-7 py-3.5 rounded-xl font-bold transition-all">
              Create account
            </Link>
            <Link to="/properties" className="border border-slate-700 hover:border-slate-500 text-white px-7 py-3.5 rounded-xl font-semibold transition-all">
              Browse properties
            </Link>
          </div>
        </div>
      </section>

      {/* ── UPDATED FOOTER ──────────────────────────────────── */}
      <footer className="bg-slate-950 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <SmartRentInline size={32} theme="dark" />
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
                  <PhoneIcon className="w-4 h-4 shrink-0 text-slate-500" /> M-Pesa integrated
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

export default About
