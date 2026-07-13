import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LayoutDashboard, Users, Building2, FileText, CreditCard, BarChart3 } from 'lucide-react'  
import AdminOverview from './AdminOverview'
import AdminUsers from './AdminUsers'
import AdminProperties from './AdminProperties'
import AdminLeases from './AdminLeases'
import AdminPayments from './AdminPayments'
import AdminReports from './AdminReports'  

const NAV_LINKS = [
  { to: '/admin/dashboard', label: 'Overview', Icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', Icon: Users },
  { to: '/admin/properties', label: 'Properties', Icon: Building2 },
  { to: '/admin/leases', label: 'Leases', Icon: FileText },
  { to: '/admin/payments', label: 'Payments', Icon: CreditCard },
  { to: '/admin/reports', label: 'Reports', Icon: BarChart3 },  
]

function AdminDashboard() {
  return (
    <DashboardLayout links={NAV_LINKS}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="leases" element={<AdminLeases />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reports" element={<AdminReports />} />  
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default AdminDashboard