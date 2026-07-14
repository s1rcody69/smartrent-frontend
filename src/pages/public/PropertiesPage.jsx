import Navbar from '../../components/layout/Navbar'
import { useGetPropertiesQuery } from '../../features/properties/propertiesApi'
import { Link } from 'react-router-dom'
import { SmartRentInline } from '../../components/layout/SmartRentLogo'
import { MapPin, Mail, Smartphone, Building2, ChevronRight, Home } from 'lucide-react'

function PropertiesPage() {
  const { data, isLoading } = useGetPropertiesQuery()
  const properties = data?.results || []

  return (
    <div className="min-h-screen bg-background font-body-md">
      <Navbar />

      {/* Hero Header */}
      <div className="pt-20 bg-primary-container border-b border-white/5">
        <div className="max-w-container-max mx-auto px-margin-desktop py-14">
          <h1 className="text-display-lg text-secondary">All Properties</h1>
          <p className="text-on-primary-container mt-2">Browse available properties on SmartRent</p>
        </div>
      </div>

      {/* Property Grid */}
      <div className="max-w-container-max mx-auto px-margin-desktop py-12">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-panel ambient-shadow rounded-2xl overflow-hidden animate-pulse border border-outline-variant/30">
                <div className="h-48 bg-surface-container" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-surface-container rounded w-3/4" />
                  <div className="h-3 bg-surface-container rounded w-1/2" />
                  <div className="h-3 bg-surface-container rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <div key={p.id} className="glass-panel ambient-shadow rounded-2xl overflow-hidden hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-all duration-300 group border border-outline-variant/30">
                <div className="h-48 bg-surface-container overflow-hidden relative">
                  {p.cover_image
                    ? <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-linear-to-br from-surface-container to-surface-container-highest flex items-center justify-center">
                        <Home size={40} className="text-outline" />
                      </div>
                  }
                  <div className="absolute top-3 right-3">
                    <span className="bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface text-xs font-semibold px-3 py-1.5 rounded-full capitalize shadow-sm border border-outline-variant/20">
                      {p.property_type}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">{p.name}</h3>
                      <p className="text-on-surface-variant text-sm flex items-center gap-1">
                        <MapPin size={14} className="text-secondary" />
                        {p.city}
                      </p>
                    </div>
                  </div>
                  {p.description && (
                    <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">{p.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant/30">
                    <span className="text-on-surface-variant text-sm flex items-center gap-1">
                      <Building2 size={14} />
                      {p.total_units} unit{p.total_units !== 1 ? 's' : ''}
                    </span>
                    <Link 
                      to={`/properties/${p.id}`} 
                      className="text-secondary hover:text-secondary/80 text-sm font-semibold flex items-center gap-1 transition-colors"
                    >
                      Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && properties.length === 0 && (
          <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
            <Building2 size={48} className="text-outline mx-auto mb-3" />
            <p className="text-on-surface-variant">No properties available at the moment.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-primary-container py-16">
        <div className="max-w-container-max mx-auto px-margin-desktop">
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

export default PropertiesPage