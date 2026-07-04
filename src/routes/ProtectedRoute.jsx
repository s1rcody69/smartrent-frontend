import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, accessToken } = useSelector((state) => state.auth)
  if (!accessToken || !user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute