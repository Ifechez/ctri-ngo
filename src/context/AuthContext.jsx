import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ctri_admin_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ctri_admin_token')
    if (!token) {
      setLoading(false)
      return
    }
    client
      .get('/auth/me')
      .then((res) => {
        setUser(res.data)
        localStorage.setItem('ctri_admin_user', JSON.stringify(res.data))
      })
      .catch(() => {
        localStorage.removeItem('ctri_admin_token')
        localStorage.removeItem('ctri_admin_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await client.post('/auth/login', { email, password })
    localStorage.setItem('ctri_admin_token', res.data.token)
    localStorage.setItem('ctri_admin_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await client.post('/auth/logout')
    } catch {
      // ignore — clear local state regardless
    }
    localStorage.removeItem('ctri_admin_token')
    localStorage.removeItem('ctri_admin_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
