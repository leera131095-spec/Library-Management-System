"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: any) {

  const [user, setUser] = useState<any>(null)

  useEffect(() => {

    const savedUser =
      localStorage.getItem("user")

    if (savedUser)
      setUser(JSON.parse(savedUser))

  }, [])


  const login = (
    id: string,
    password: string,
    role: "librarian" | "student"
  ) => {

    if (role === "librarian") {

      if (id === "admin" && password === "admin") {

        const librarian = {

          id: "admin",
          role: "librarian",
          name: "Rose Librarian"

        }

        setUser(librarian)

        localStorage.setItem(
          "user",
          JSON.stringify(librarian)
        )

        return true
      }

      return false
    }


    if (role === "student") {

      const students =
        JSON.parse(
          localStorage.getItem("students") || "[]"
        )

      const student =
        students.find(
          (s: any) =>
            s.id === id &&
            s.password === password
        )

      if (student) {

        const studentUser = {

          ...student,
          role: "student"

        }

        setUser(studentUser)

        localStorage.setItem(
          "user",
          JSON.stringify(studentUser)
        )

        return true
      }

      return false
    }

  }


  const logout = () => {

    setUser(null)

    localStorage.removeItem("user")

  }


  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  )

}

export const useAuth =
  () => useContext(AuthContext)
