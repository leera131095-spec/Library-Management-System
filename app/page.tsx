"use client"

import LoginPage from "@/components/login-page"
import { useAuth } from "@/lib/auth-context"
import { AppShell } from "@/components/app-shell"
import { StudentDashboard } from "@/components/student-dashboard"

export default function Home() {

  const { user } = useAuth()

  if (!user)
    return <LoginPage />

  if (user.role === "student")
    return <StudentDashboard />

  return <AppShell />

}
