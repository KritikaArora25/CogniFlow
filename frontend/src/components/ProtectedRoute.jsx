import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth() // get auth status from context

  // ✅ If user is authenticated, show the children component
  // ❌ Otherwise, redirect to /auth (login page)
  return isAuthenticated ? children : <Navigate to="/auth" />
}
