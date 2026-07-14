import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LayoutDashboard, Home, FileText, Wrench, CreditCard } from 'lucide-react'  // 👈 Removed User
import TenantOverview from './TenantOverview'
import TenantBrowse from './TenantBrowse'
import TenantLease from './TenantLease'
import TenantMaintenance from './TenantMaintenance'
import TenantPayments from './TenantPayments'
import TenantProfile from './TenantProfile'

const NAV_LINKS = [
  { to: '/tenant/dashboard', label: 'Overview', Icon: LayoutDashboard },
  { to: '/tenant/browse', label: 'Browse Properties', Icon: Home },
  { to: '/tenant/lease', label: 'My Lease', Icon: FileText },
  { to: '/tenant/maintenance', label: 'Maintenance', Icon: Wrench },
  { to: '/tenant/payments', label: 'Payments', Icon: CreditCard },
  // 👈 Removed My Profile from here
]

function TenantDashboard() {
  return (
    <DashboardLayout links={NAV_LINKS}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TenantOverview />} />
        <Route path="browse" element={<TenantBrowse />} />
        <Route path="lease" element={<TenantLease />} />
        <Route path="maintenance" element={<TenantMaintenance />} />
        <Route path="payments" element={<TenantPayments />} />
        <Route path="profile" element={<TenantProfile />} /> 
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default TenantDashboard