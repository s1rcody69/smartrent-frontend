import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useGetPropertiesQuery } from '../../features/properties/propertiesApi'

function PropertyCard({ property }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="h-48 bg-slate-200 overflow-hidden">
        {property.cover_image
          ? <img src={property.cover_image} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <span className="text-slate-400 text-sm">No image</span>
            </div>
        }
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">{property.name}</h3>
            <p className="text-slate-500 text-sm mt-0.5">{property.city}</p>
          </div>
          <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize shrink-0 ml-2">
            {property.property_type}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-slate-500 text-sm">{property.total_units} unit{property.total_units !== 1 ? 's' : ''}</span>
          <Link
            to={`/properties/${property.id}`}
            className="text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  )
}

function Landing() {
  const { data, isLoading } = useGetPropertiesQuery()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-900 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-600/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-amber-400 text-xs font-medium tracking-wide uppercase">Built for Kenya</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight max-w-4xl mx-auto">
            Property management,{' '}
            <span className="text-amber-400">done right</span>
          </h1>
          <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            Manage properties, leases, rent collection and maintenance requests — all in one platform built for landlords and tenants in Kenya.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-full font-medium text-base transition-colors shadow-lg shadow-amber-900/30"
            >
              Get started free
            </Link>
            <Link
              to="/properties"
              className="text-white border border-slate-700 hover:border-slate-500 px-8 py-3.5 rounded-full font-medium text-base transition-colors"
            >
              Browse properties
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-8 text-center">
            {[['500+', 'Properties managed'], ['1,200+', 'Happy tenants'], ['98%', 'On-time rent collection']].map(([num, label]) => (
              <div key={label}>
                <p className="text-3xl font-bold text-white">{num}</p>
                <p className="text-slate-500 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Available properties</h2>
            <p className="text-slate-500 mt-2">Listings currently on SmartRent</p>
          </div>
          <Link to="/properties" className="text-amber-600 hover:text-amber-700 font-medium text-sm">
            View all →
          </Link>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
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
            {data.results.slice(0, 6).map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}

        {data?.results?.length === 0 && (
          <p className="text-slate-400 text-center py-12">No properties listed yet.</p>
        )}
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">How SmartRent works</h2>
            <p className="text-slate-500 mt-2">Three steps to a better rental experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ['01', 'Create an account', 'Sign up as a landlord or tenant in under a minute. No paperwork.'],
              ['02', 'List or find a unit', 'Landlords list properties with photos. Tenants browse and apply.'],
              ['03', 'Pay rent via M-Pesa', 'Tenants pay securely through M-Pesa. Landlords track everything live.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto font-bold text-lg mb-5">
                  {num}
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">Join hundreds of landlords and tenants already using SmartRent.</p>
          <Link
            to="/register"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-full font-medium text-base transition-colors inline-block"
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-white font-semibold">SmartRent</span>
          </div>
          <p className="text-slate-600 text-sm">© 2026 SmartRent. Built for Kenya.</p>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-400">Home</Link>
            <Link to="/properties" className="hover:text-slate-400">Properties</Link>
            <Link to="/about" className="hover:text-slate-400">About</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

