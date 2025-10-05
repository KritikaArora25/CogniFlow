// src/pages/AuthPage.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  // 1️⃣ State for inputs and messages
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  // 2️⃣ Get login function from context
  const { login } = useAuth()

  // 3️⃣ Form submit handler
  const handleLogin = async (e) => {
    e.preventDefault() // prevent page reload

    try {
      // 4️⃣ Call backend API
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json() // 5️⃣ Convert response to JS object

      // 6️⃣ Success or error
      if (data.success) {
        login(data.token) // store token in context
        setMessage('✅ Login successful!')
      } else {
        setMessage('⚠️ ' + data.message)
      }
    } catch (err) {
      setMessage('❌ Server error: ' + err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 font-sans">
      <div className="bg-white p-10 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="p-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </form>

        {/* Message display */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
