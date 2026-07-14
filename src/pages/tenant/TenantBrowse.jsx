import { useGetPropertiesQuery } from '../../features/properties/propertiesApi'
import { Link } from 'react-router-dom'
import { MapPin, Home, Building2, ChevronRight, Search } from 'lucide-react'

function TenantBrowse() {
  const { data, isLoading } = useGetPropertiesQuery()
  const properties = data?.results || []

  return (
    <div className="space-y-8">
      <header>
        <p className="text-label-md text-secondary font-bold uppercase tracking-[0.2em] mb-1">Property Search</p>
        <h1 className="text-display-lg text-primary tracking-tight">Browse Properties</h1>
        <p className="text-body-md text-on-surface-variant mt-2">Available properties on SmartRent</p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-panel ambient-shadow rounded-2xl h-72 animate-pulse border border-outline-variant/30" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 py-20 text-center">
          <Building2 size={40} className="text-outline mx-auto mb-3" />
          <p className="text-on-surface-variant font-medium">No properties available right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map(p => {
            const totalUnits = p.total_units || 0
            const vacantUnits = p.vacant_units || 0
            
            return (
              <div key={p.id} className="glass-panel ambient-shadow rounded-2xl border border-outline-variant/30 overflow-hidden hover:shadow-[0_10px_30px_-5px_rgba(15,23,42,0.1)] transition-all duration-300 group flex flex-col">
                {/* Image */}
                <div className="h-48 bg-surface-container overflow-hidden relative shrink-0">
                  {p.cover_image
                    ? <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-linear-to-br from-surface-container to-surface-container-highest flex items-center justify-center">
                        <Home size={32} className="text-outline" />
                      </div>
                  }
                  <span className="absolute top-3 left-3 bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface text-xs font-semibold px-2.5 py-1 rounded-full capitalize border border-outline-variant/20">
                    {p.property_type}
                  </span>
                  {vacantUnits > 0 ? (
                    <span className="absolute top-3 right-3 bg-success-container text-success text-xs font-semibold px-2.5 py-1 rounded-full">
                      {vacantUnits} unit{vacantUnits !== 1 ? 's' : ''} available
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-surface-container-highest text-on-surface-variant text-xs font-semibold px-2.5 py-1 rounded-full">
                      Fully occupied
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{p.name}</h3>
                  <div className="flex items-center gap-1 text-on-surface-variant text-xs mb-3">
                    <MapPin size={11} className="text-secondary" />
                    <span>{p.city}, Kenya</span>
                  </div>
                  
                  {p.description && (
                    <p className="text-on-surface-variant text-xs line-clamp-2 mb-3 flex-1">{p.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Building2 size={12} />
                        {totalUnits} unit{totalUnits !== 1 ? 's' : ''}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span className="text-success font-medium">{vacantUnits} vacant</span>
                    </div>
                    <Link
                      to={`/properties/${p.id}`}
                      className="flex items-center gap-1 text-secondary hover:text-secondary/80 text-sm font-semibold transition-colors group/link"
                    >
                      View Details
                      <ChevronRight size={16} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TenantBrowse