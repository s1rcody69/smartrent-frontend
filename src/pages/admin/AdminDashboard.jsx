import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LayoutDashboard, Users, Building2, FileText, CreditCard } from 'lucide-react'  // 👈 Kept all imports
import AdminOverview from './AdminOverview'
import AdminUsers from './AdminUsers'
// 👈 Import admin components here when created
// import AdminProperties from './AdminProperties'
// import AdminLeases from './AdminLeases'
// import AdminPayments from './AdminPayments'

const NAV_LINKS = [
  { to: '/admin/dashboard', label: 'Overview', Icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', Icon: Users },
  // 👇 Commented out - uncomment when components exist
  // { to: '/admin/properties', label: 'Properties', Icon: Building2 },
  // { to: '/admin/leases', label: 'Leases', Icon: FileText },
  // { to: '/admin/payments', label: 'Payments', Icon: CreditCard },
]

function AdminDashboard() {
  return (
    <DashboardLayout links={NAV_LINKS}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        {/* 👇 Commented out - uncomment when components exist */}
        {/* <Route path="properties" element={<AdminProperties />} /> */}
        {/* <Route path="leases" element={<AdminLeases />} /> */}
        {/* <Route path="payments" element={<AdminPayments />} /> */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default AdminDashboard