"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { AppShell } from "@/components/app-shell"

export default function Home() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <AppShell />
}
