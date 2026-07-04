import Navbar from '../../components/layout/Navbar'

function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">About SmartRent</h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            SmartRent is a property management platform built specifically for the Kenyan rental market. We connect landlords and tenants through a secure, modern system that replaces spreadsheets and paper records.
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            From listing properties to signing leases, collecting rent via M-Pesa, and managing maintenance requests — SmartRent handles every part of the rental relationship in one place.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-12">
            {[['500+', 'Properties'], ['1,200+', 'Tenants'], ['98%', 'Satisfaction']].map(([n, l]) => (
              <div key={l} className="bg-white rounded-2xl p-6 text-center border border-slate-100">
                <p className="text-3xl font-bold text-amber-600">{n}</p>
                <p className="text-slate-500 text-sm mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About