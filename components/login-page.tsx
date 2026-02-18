"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { BookOpen, Eye, EyeOff, Sparkles } from "lucide-react"

export function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600))

    const success = login(username, password)
    if (!success) {
      setError("Invalid credentials. Try librarian / library123")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-lavender/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blush/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-peach/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[--radius-xl] bg-primary/10 mb-6 fairytale-shadow">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground tracking-tight text-balance">
            Enchanted Library
          </h1>
          <p className="mt-2 text-muted-foreground text-base leading-relaxed">
            Step into a world of stories and wonder
          </p>
        </div>

        {/* Login card */}
        <div className="bg-card rounded-[--radius-xl] p-8 fairytale-shadow-lg border border-border/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-[--radius-md] bg-input border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all text-sm"
                required
                autoComplete="username"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-[--radius-md] bg-input border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all text-sm"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 rounded-[--radius-md] px-4 py-3 border border-destructive/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-[--radius-md] bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Enter the Library
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Demo credentials: <span className="font-medium text-foreground">librarian</span> / <span className="font-medium text-foreground">library123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          Enchanted Library Management System
        </p>
      </div>
    </div>
  )
}
