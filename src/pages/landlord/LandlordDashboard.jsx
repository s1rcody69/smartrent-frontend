import { Routes, Route } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import LandlordOverview from './LandlordOverview'

function LandlordDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="dashboard" element={<LandlordOverview />} />
          <Route path="*" element={<LandlordOverview />} />
        </Routes>
      </div>
    </div>
  )
}

export default LandlordDashboard