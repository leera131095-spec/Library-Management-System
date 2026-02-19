"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { AppShell } from "@/components/app-shell"
import { StudentShell } from "@/components/student-shell"
import { StudentLogin } from "@/components/student-login"

export default function Home() {

  const { isAuthenticated } = useAuth()

  const [role, setRole] = useState<"student" | "librarian" | null>(null)

  if (!role) {

    return (

      <div className="fairytale-bg">

        <div className="fairytale-card">

          <h1 className="title">
            📚 Dream Library
          </h1>

          <p className="subtitle">
            Choose your destiny
          </p>

          <button
            className="magic-button"
            onClick={() => setRole("student")}
          >
            🌸 Enter as Student
          </button>

          <button
            className="magic-button"
            onClick={() => setRole("librarian")}
          >
            🔐 Enter as Librarian
          </button>

        </div>

      </div>

    )
  }

const [studentLogged,setStudentLogged]=useState(false)

if(role==="student" && !studentLogged){

return <StudentLogin onLogin={()=>setStudentLogged(true)} />

}

if(role==="student" && studentLogged){

return <StudentShell />

}

  if (!isAuthenticated) {

    return <LoginPage />

  }

  return <AppShell />

}
