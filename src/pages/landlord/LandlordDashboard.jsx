import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LayoutDashboard, Building2, FileText, Wrench, CreditCard } from 'lucide-react'
import LandlordOverview from './LandlordOverview'
import LandlordProperties from './LandlordProperties'
import LandlordLeases from './LandlordLeases'
import LandlordMaintenance from './LandlordMaintenance'
import LandlordPayments from './LandlordPayments'

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
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<LandlordOverview />} />
        <Route path="properties" element={<LandlordProperties />} />
        <Route path="leases" element={<LandlordLeases />} />
        <Route path="maintenance" element={<LandlordMaintenance />} />
        <Route path="payments" element={<LandlordPayments />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default LandlordDashboard