import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import {
  LayoutDashboard, Building2, FileText,
  Wrench, CreditCard
} from 'lucide-react'
import LandlordOverview from './LandlordOverview'

const NAV_LINKS = [
  { to: '/landlord/dashboard', label: 'Overview', Icon: LayoutDashboard },
  { to: '/landlord/properties', label: 'Properties', Icon: Building2 },
  { to: '/landlord/leases', label: 'Leases', Icon: FileText },
  { to: '/landlord/maintenance', label: 'Maintenance', Icon: Wrench },
  { to: '/landlord/payments', label: 'Payments', Icon: CreditCard },
]

function LandlordDashboard() {
  return (
    <DashboardLayout links={NAV_LINKS}>
      <Routes>
        <Route path="dashboard" element={<LandlordOverview />} />
        <Route path="/" element={<Navigate to="/landlord/dashboard" replace />} />
        <Route path="*" element={<LandlordOverview />} />
      </Routes>
    </DashboardLayout>
  )
}

export default LandlordDashboard