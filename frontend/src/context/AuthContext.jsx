// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

// 1. Create the context
const AuthContext = createContext()

// 2. Provide context to children
export const AuthProvider = ({ children }) => {
  // Store token and auth state
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)
  const navigate = useNavigate(); // allow navigation from context

  // Login function
  const login = (jwtToken) => {
    localStorage.setItem('token', jwtToken) // save in browser
    setToken(jwtToken)
    setIsAuthenticated(true)
    navigate('/'); // redirect to dashboard
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setIsAuthenticated(false)
    navigate('/auth'); // redirect to login
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook for easier access
export const useAuth = () => useContext(AuthContext)
