"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

type UserRole = "librarian" | "student" | null

interface AuthContextType {
  isAuthenticated: boolean
  role: UserRole
  user: { name: string; role: string } | null
  login: (username: string, password: string) => boolean
  loginAsStudent: () => void
  logout: () => void
  selectRole: (role: UserRole) => void
  selectedRole: UserRole
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
  const [role, setRole] = useState<UserRole>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)

  const login = useCallback((username: string, password: string) => {
    const found = VALID_USERS.find(
      (u) => u.username === username && u.password === password
    )
    if (found) {
      setUser({ name: found.name, role: found.role })
      setRole("librarian")
      return true
    }
    return false
  }, [])

  const loginAsStudent = useCallback(() => {
    setUser({ name: "Starlight Reader", role: "Student" })
    setRole("student")
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setRole(null)
    setSelectedRole(null)
  }, [])

  const selectRole = useCallback((r: UserRole) => {
    setSelectedRole(r)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        role,
        user,
        login,
        loginAsStudent,
        logout,
        selectRole,
        selectedRole,
      }}
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
