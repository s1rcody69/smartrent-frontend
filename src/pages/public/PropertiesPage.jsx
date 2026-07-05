import Navbar from '../../components/layout/Navbar'
import { useGetPropertiesQuery } from '../../features/properties/propertiesApi'
import { Link } from 'react-router-dom'
import { SmartRentInline } from '../../components/layout/SmartRentLogo'
import { MapPin, Mail, Smartphone } from 'lucide-react'

function PropertiesPage() {
  const { data, isLoading } = useGetPropertiesQuery()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        <div className="bg-slate-900 py-14">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-3xl font-bold text-white">All Properties</h1>
            <p className="text-slate-400 mt-2">Browse available properties on SmartRent</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.results?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.results.map(p => (
                <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-48 bg-slate-200 overflow-hidden">
                    {p.cover_image
                      ? <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                    }
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{p.name}</h3>
                        <p className="text-slate-500 text-sm">{p.city}</p>
                      </div>
                      <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-1 rounded-full capitalize">{p.property_type}</span>
                    </div>
                    {p.description && <p className="text-slate-400 text-sm mt-2 line-clamp-2">{p.description}</p>}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <span className="text-slate-500 text-sm">{p.total_units} unit{p.total_units !== 1 ? 's' : ''}</span>
                      <Link to={`/properties/${p.id}`} className="text-amber-600 hover:text-amber-700 text-sm font-medium">Details →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.results?.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400">No properties available at the moment.</p>
            </div>
          )}
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
  )
}

export default PropertiesPage