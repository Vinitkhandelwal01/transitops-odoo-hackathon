/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { authApi } from '../services/api.js'

const AuthContext = createContext(null)

const storageKeys = {
  user: 'transitops_user',
  token: 'transitops_token',
}

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.user))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem(storageKeys.token))
  const [loading, setLoading] = useState(false)

  const login = async (credentials) => {
    setLoading(true)

    try {
      const response = await authApi.login(credentials)
      const session = response.data

      if (session?.token) {
        localStorage.setItem(storageKeys.token, session.token)
        setToken(session.token)
      }

      if (session?.user) {
        localStorage.setItem(storageKeys.user, JSON.stringify(session.user))
        setUser(session.user)
      }

      return session
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(storageKeys.token)
    localStorage.removeItem(storageKeys.user)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [loading, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
