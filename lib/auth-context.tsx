"use client"

import { createContext, useContext, useState } from "react"
import { students } from "./data"

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: any) {

  const [user, setUser] = useState<any>(null)

  function login(id: string, password: string) {

    if (id === "admin" && password === "admin") {
      setUser({ role: "librarian", name: "Librarian" })
      return true
    }

    const student = students.find(
      s => s.id === id && s.password === password
    )

    if (student) {
      setUser({
        role: "student",
        name: student.name,
        id: student.id
      })
      return true
    }

    return false
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
