import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Landing from '../pages/public/Landing'
import About from '../pages/public/About'
import PropertiesPage from '../pages/public/PropertiesPage'
import AuthPage from '../pages/auth/AuthPage'
import LandlordDashboard from '../pages/landlord/LandlordDashboard'
import TenantDashboard from '../pages/tenant/TenantDashboard'
import AdminDashboard from '../pages/admin/AdminDashboard'
import PropertyDetail from '../pages/public/PropertyDetail'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
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