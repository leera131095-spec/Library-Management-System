"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { AppShell } from "@/components/app-shell"
import { StudentShell } from "@/components/student-shell"

export default function Home() {

  const { isAuthenticated } = useAuth()

  const [role, setRole] = useState<"student" | "librarian" | null>(null)

  // STEP 1: Show role selection popup
  if (!role) {

    return (

      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #fbc2eb, #a6c1ee)"
      }}>

        <h1>📚 Welcome to Library</h1>

        <button onClick={() => setRole("student")}>
          Student
        </button>

        <button onClick={() => setRole("librarian")}>
          Librarian
        </button>

      </div>

    )
  }

  // STEP 2: Student goes directly
  if (role === "student") {

    return <StudentShell />

  }

  // STEP 3: Librarian must login
  if (!isAuthenticated) {

    return <LoginPage />

  }

  return <AppShell />

}
