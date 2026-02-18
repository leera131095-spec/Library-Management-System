"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: { name: string; role: string } | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const VALID_USERS = [
  {
    username: "librarian",
    password: "library123",
    name: "Rose Librarian",
    role: "Admin",
  },
  { username: "admin", password: "admin123", name: "Admin", role: "Admin" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  const login = useCallback((username: string, password: string) => {
    const found = VALID_USERS.find(
      (u) => u.username === username && u.password === password
    )
    if (found) {
      setUser({ name: found.name, role: found.role })
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
