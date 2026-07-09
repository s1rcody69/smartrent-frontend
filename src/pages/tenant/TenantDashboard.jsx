import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LayoutDashboard, FileText, Wrench, CreditCard } from 'lucide-react'
import TenantOverview from './TenantOverview'
import TenantLeases from './TenantLeases'
import TenantMaintenance from './TenantMaintenance'
import TenantPayments from './TenantPayments'

const TENANT_LINKS = [
  { to: '/tenant/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/tenant/leases', label: 'My Lease', Icon: FileText },
  { to: '/tenant/maintenance', label: 'Maintenance', Icon: Wrench },
  { to: '/tenant/payments', label: 'Payments', Icon: CreditCard },
]

function TenantDashboard() {
  return (
    <DashboardLayout links={TENANT_LINKS}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TenantOverview />} />
        <Route path="leases" element={<TenantLeases />} />
        <Route path="maintenance" element={<TenantMaintenance />} />
        <Route path="payments" element={<TenantPayments />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default TenantDashboard