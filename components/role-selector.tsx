"use client"

import { useAuth } from "@/lib/auth-context"
import { BookOpen, GraduationCap, Sparkles } from "lucide-react"
import { useState } from "react"

export function RoleSelector() {
  const { selectRole, loginAsStudent } = useAuth()
  const [hovered, setHovered] = useState<string | null>(null)
  const [leaving, setLeaving] = useState(false)

  const handleLibrarian = () => {
    setLeaving(true)
    setTimeout(() => selectRole("librarian"), 400)
  }

  const handleStudent = () => {
    setLeaving(true)
    setTimeout(() => loginAsStudent(), 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[10%] left-[8%] w-64 h-64 rounded-full bg-lavender/40 blur-3xl animate-float" />
        <div className="absolute top-[60%] right-[5%] w-80 h-80 rounded-full bg-blush/40 blur-3xl animate-float-delayed" />
        <div className="absolute bottom-[10%] left-[30%] w-72 h-72 rounded-full bg-peach/30 blur-3xl animate-float-slow" />
        <div className="absolute top-[20%] right-[25%] w-48 h-48 rounded-full bg-sage/30 blur-3xl animate-float-delayed" />

        {/* Tiny sparkle particles */}
        <div className="absolute top-[15%] left-[20%] w-2 h-2 rounded-full bg-primary/60 animate-twinkle" />
        <div className="absolute top-[35%] right-[15%] w-1.5 h-1.5 rounded-full bg-accent/60 animate-twinkle-delayed" />
        <div className="absolute bottom-[25%] left-[45%] w-2 h-2 rounded-full bg-peach/80 animate-twinkle" />
        <div className="absolute top-[70%] left-[12%] w-1 h-1 rounded-full bg-lavender/80 animate-twinkle-delayed" />
        <div className="absolute top-[50%] right-[30%] w-1.5 h-1.5 rounded-full bg-primary/50 animate-twinkle" />
      </div>

      <div
        className={`relative z-10 flex flex-col items-center px-4 transition-all duration-500 ${
          leaving ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-fade-in-up"
        }`}
      >
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-card fairytale-glow flex items-center justify-center mb-6 border border-border/40">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary/70" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            Welcome to the
          </span>
          <Sparkles className="w-4 h-4 text-primary/70" />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-center text-balance leading-tight">
          Magical Library
        </h1>
        <p className="mt-3 text-muted-foreground text-center text-base md:text-lg leading-relaxed max-w-md">
          Are you a Librarian or a Student?
        </p>

        {/* Role cards */}
        <div className="flex flex-col sm:flex-row gap-5 mt-10 w-full max-w-lg">
          {/* Librarian card */}
          <button
            onClick={handleLibrarian}
            onMouseEnter={() => setHovered("librarian")}
            onMouseLeave={() => setHovered(null)}
            className="group flex-1 relative bg-card rounded-2xl p-8 border border-border/40 transition-all duration-300 hover:border-primary/50 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-ring/40 text-left"
            style={{
              boxShadow:
                hovered === "librarian"
                  ? "0 8px 48px -8px rgba(232,160,191,0.35), 0 0 20px -4px rgba(232,160,191,0.2)"
                  : "0 4px 24px -2px rgba(232,160,191,0.12)",
            }}
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 transition-colors group-hover:bg-primary/20">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">
              Librarian
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manage books, issue and return, view all records and students.
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              <span>Login required</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          {/* Student card */}
          <button
            onClick={handleStudent}
            onMouseEnter={() => setHovered("student")}
            onMouseLeave={() => setHovered(null)}
            className="group flex-1 relative bg-card rounded-2xl p-8 border border-border/40 transition-all duration-300 hover:border-accent/50 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-ring/40 text-left"
            style={{
              boxShadow:
                hovered === "student"
                  ? "0 8px 48px -8px rgba(200,182,255,0.35), 0 0 20px -4px rgba(200,182,255,0.2)"
                  : "0 4px 24px -2px rgba(200,182,255,0.12)",
            }}
          >
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-5 transition-colors group-hover:bg-accent/30">
              <GraduationCap className="w-7 h-7 text-accent-foreground" />
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">
              Student
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Browse available books, check your issued books and more.
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-accent-foreground">
              <span>No login needed</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/50">
          Enchanted Library Management System
        </p>
      </div>
    </div>
  )
}
