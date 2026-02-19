"use client"

import { createContext, useContext, useState } from "react"


type User = {
  username: string
  password: string
  role: "librarian" | "student"
  name: string
}


type AuthContextType = {

  user: User | null

  login: (username: string, password: string) => boolean

  logout: () => void

}


const AuthContext = createContext<AuthContextType | null>(null)



// USERS
const users: User[] = [

  {
    username: "admin",
    password: "admin123",
    role: "librarian",
    name: "Rose Librarian",
  },

  {
    username: "alice",
    password: "111",
    role: "student",
    name: "Alice Wonderland",
  },

  {
    username: "peter",
    password: "222",
    role: "student",
    name: "Peter Pan",
  },

  {
    username: "dorothy",
    password: "333",
    role: "student",
    name: "Dorothy Gale",
  },

]



export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null)



  const login = (username: string, password: string) => {

    const found = users.find(

      u => u.username === username && u.password === password

    )

    if (found) {

      setUser(found)

      return true

    }

    return false

  }



  const logout = () => {

    setUser(null)

  }



  return (

    <AuthContext.Provider value={{ user, login, logout }}>

      {children}

    </AuthContext.Provider>

  )

}



export function useAuth() {

  const context = useContext(AuthContext)

  if (!context) {

    throw new Error("useAuth must be used inside AuthProvider")

  }

  return context

}
