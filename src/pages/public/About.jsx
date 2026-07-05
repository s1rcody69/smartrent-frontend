import Navbar from "../../components/layout/Navbar";
import { Link } from 'react-router-dom'
import { SmartRentInline } from '../../components/layout/SmartRentLogo'
import { MapPin, Mail, Smartphone } from 'lucide-react'


function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">
            About SmartRent
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            SmartRent is a property management platform built specifically for
            the Kenyan rental market. We connect landlords and tenants through a
            secure, modern system that replaces spreadsheets and paper records.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            From listing properties to signing leases, collecting rent via
            M-Pesa, and managing maintenance requests — SmartRent handles every
            part of the rental relationship in one place.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-12">
            {[
              ["500+", "Properties"],
              ["1,200+", "Tenants"],
              ["98%", "Satisfaction"],
            ].map(([n, l]) => (
              <div
                key={l}
                className="bg-white rounded-2xl p-6 text-center border border-slate-100"
              >
                <p className="text-3xl font-bold text-amber-600">{n}</p>
                <p className="text-slate-500 text-sm mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────── */}
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
  );
}

export default About;
