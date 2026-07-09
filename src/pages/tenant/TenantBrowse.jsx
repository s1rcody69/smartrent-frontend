import { useGetPropertiesQuery } from '../../features/properties/propertiesApi'
import { Link } from 'react-router-dom'
import { MapPin, Home, Building2, ChevronRight } from 'lucide-react'

function TenantBrowse() {
  const { data, isLoading } = useGetPropertiesQuery()
  const properties = data?.results || []

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Browse Properties</h1>
        <p className="text-slate-500 text-sm mt-1">Available properties on SmartRent</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-slate-100" />)}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <Building2 size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No properties available right now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map(p => {
            // 👇 Use vacant_units from the API response
            const totalUnits = p.total_units || 0
            const vacantUnits = p.vacant_units || 0
            
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                {/* Image */}
                <div className="h-48 bg-slate-200 overflow-hidden relative shrink-0">
                  {p.cover_image
                    ? <img src={p.cover_image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center"><Home size={32} className="text-slate-400" /></div>
                  }
                  <span className="absolute top-3 left-3 bg-white/95 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                    {p.property_type}
                  </span>
                  {vacantUnits > 0 ? (
                    <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {vacantUnits} unit{vacantUnits !== 1 ? 's' : ''} available
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-slate-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Fully occupied
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{p.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                    <MapPin size={11} /><span>{p.city}, Kenya</span>
                  </div>
                  
                  {p.description && (
                    <p className="text-slate-400 text-xs line-clamp-2 mb-3 flex-1">{p.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{totalUnits} unit{totalUnits !== 1 ? 's' : ''}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-emerald-600 font-medium">{vacantUnits} vacant</span>
                    </div>
                    <Link
                      to={`/properties/${p.id}`}
                      className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-semibold transition-colors group/link"
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