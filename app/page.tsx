"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { AppShell } from "@/components/app-shell"
import { StudentShell } from "@/components/student-shell"

export default function Home() {

  const { user } = useAuth()

  if (!user) {

    return <LoginPage />

  }

  if (user.role === "student") {

    return <StudentShell />

  }

  return <AppShell />

}
