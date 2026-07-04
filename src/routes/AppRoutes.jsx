import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Landing from '../pages/public/Landing'
import AuthPage from '../pages/auth/AuthPage'
import LandlordDashboard from '../pages/landlord/LandlordDashboard'
import TenantDashboard from '../pages/tenant/TenantDashboard'
import AdminDashboard from '../pages/admin/AdminDashboard'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/landlord/*" element={
        <ProtectedRoute allowedRoles={['landlord']}>
          <LandlordDashboard />
        </ProtectedRoute>
      } />
      <Route path="/tenant/*" element={
        <ProtectedRoute allowedRoles={['tenant']}>
          <TenantDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default AppRoutes