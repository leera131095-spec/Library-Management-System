"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { useAuth } from "@/lib/auth-context"
import {
  BookOpen,
  Search,
  Megaphone,
  User,
  LogOut,
  Sparkles,
  BookCheck,
  Clock,
  Cherry,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function StudentDashboard() {
  const { user, logout } = useAuth()
  const { data: books } = useSWR("/api/books", fetcher, { refreshInterval: 5000 })
  const { data: transactions } = useSWR("/api/transactions", fetcher, { refreshInterval: 5000 })
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"books" | "issued" | "announcements">("books")

  // Filter to "student" issued books (use student id 1 as demo student)
  const myIssuedBooks = useMemo(() => {
    if (!transactions) return []
    return transactions.filter(
      (t: { studentName: string; returnDate: string | null }) =>
        t.studentName === "Alice Wonderland" && !t.returnDate
    )
  }, [transactions])

  const filteredBooks = useMemo(() => {
    if (!books) return []
    if (!searchTerm.trim()) return books
    const q = searchTerm.toLowerCase()
    return books.filter(
      (b: { title: string; author: string }) =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    )
  }, [books, searchTerm])

  const announcements = [
    {
      icon: Sparkles,
      title: "New fantasy books added!",
      desc: "Check out our new collection of magical tales and fairytale stories.",
      time: "2 hours ago",
    },
    {
      icon: Clock,
      title: "Library open till 6 PM",
      desc: "Extended hours this week for exam preparation season.",
      time: "1 day ago",
    },
    {
      icon: Cherry,
      title: "Spring reading challenge",
      desc: "Read 5 books this month and earn a golden bookmark badge!",
      time: "3 days ago",
    },
  ]

  const tabs = [
    { id: "books" as const, label: "Browse Books", icon: BookOpen },
    { id: "issued" as const, label: "My Books", icon: BookCheck },
    { id: "announcements" as const, label: "Announcements", icon: Megaphone },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[5%] right-[5%] w-80 h-80 rounded-full bg-lavender/20 blur-3xl animate-float" />
        <div className="absolute bottom-[10%] left-[5%] w-72 h-72 rounded-full bg-blush/20 blur-3xl animate-float-delayed" />
        <div className="absolute top-[40%] left-[50%] w-60 h-60 rounded-full bg-peach/15 blur-3xl animate-float-slow" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-foreground leading-tight">
                Magical Library
              </h1>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Welcome banner + Profile card row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Welcome banner */}
          <div className="lg:col-span-2 bg-card rounded-2xl p-6 md:p-8 border border-border/30 fairytale-glow relative overflow-hidden">
            <div className="absolute top-3 right-4 opacity-20" aria-hidden="true">
              <Sparkles className="w-20 h-20 text-primary" />
            </div>
            <p className="text-sm text-primary font-medium flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Welcome back
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-balance">
              Welcome to the Magical Library
            </h2>
            <p className="mt-2 text-muted-foreground leading-relaxed max-w-lg">
              Explore our enchanted collection of books, check your issued titles, and stay
              updated with the latest announcements from our storybook shelves.
            </p>
            {/* Quick stats */}
            <div className="flex gap-5 mt-5">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-success-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{books?.length ?? "--"}</p>
                  <p className="text-xs text-muted-foreground">Total Titles</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <BookCheck className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{myIssuedBooks.length}</p>
                  <p className="text-xs text-muted-foreground">My Books</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile card */}
          <div className="bg-card rounded-2xl p-6 border border-border/30 fairytale-glow flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 ring-4 ring-lavender/20">
              <User className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="font-serif text-lg font-bold text-foreground">
              {user?.name || "Starlight Reader"}
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full mt-2">
              Student
            </span>
            <div className="mt-4 pt-4 border-t border-border/30 w-full">
              <div className="flex items-center justify-center gap-2 text-sm">
                <BookCheck className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">{myIssuedBooks.length}</span>
                <span className="text-muted-foreground">books issued</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 bg-card rounded-xl p-1.5 border border-border/30 fairytale-shadow w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === "books" && (
          <div className="flex flex-col gap-5 animate-fade-in">
            {/* Search bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 text-sm fairytale-shadow"
              />
            </div>

            {/* Books grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No books found matching your search.
                </div>
              )}
              {filteredBooks.map(
                (book: {
                  id: number
                  title: string
                  author: string
                  copies: number
                  totalCopies: number
                }) => (
                  <div
                    key={book.id}
                    className="bg-card rounded-xl p-5 border border-border/30 fairytale-shadow hover:fairytale-glow transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif font-bold text-foreground text-sm leading-snug truncate">
                          {book.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {book.author}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-1 rounded-full",
                          book.copies > 0
                            ? "bg-success/15 text-success-foreground"
                            : "bg-destructive/10 text-destructive"
                        )}
                      >
                        {book.copies > 0
                          ? `${book.copies} available`
                          : "Unavailable"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {book.totalCopies} total
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {activeTab === "issued" && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {myIssuedBooks.length === 0 ? (
              <div className="bg-card rounded-xl p-8 border border-border/30 fairytale-shadow text-center">
                <BookCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  No books currently issued
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Browse the library to find your next adventure!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myIssuedBooks.map(
                  (t: {
                    id: number
                    bookTitle: string
                    issueDate: string
                    returnDate: string | null
                  }) => {
                    const issueDate = new Date(t.issueDate)
                    const dueDate = new Date(issueDate)
                    dueDate.setDate(dueDate.getDate() + 7)
                    const isOverdue = new Date() > dueDate
                    return (
                      <div
                        key={t.id}
                        className="bg-card rounded-xl p-5 border border-border/30 fairytale-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                              isOverdue ? "bg-destructive/10" : "bg-accent/20"
                            )}
                          >
                            <BookOpen
                              className={cn(
                                "w-5 h-5",
                                isOverdue ? "text-destructive" : "text-accent-foreground"
                              )}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-serif font-bold text-foreground text-sm">
                              {t.bookTitle}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Issued: {t.issueDate}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Due: {dueDate.toISOString().split("T")[0]}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium px-2.5 py-1 rounded-full",
                              isOverdue
                                ? "bg-destructive/10 text-destructive"
                                : "bg-success/15 text-success-foreground"
                            )}
                          >
                            {isOverdue ? "Overdue" : "On time"}
                          </span>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {announcements.map((a, i) => {
              const Icon = a.icon
              return (
                <div
                  key={i}
                  className="bg-card rounded-xl p-5 border border-border/30 fairytale-shadow flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-warning-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-foreground text-sm">
                      {a.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {a.desc}
                    </p>
                    <p className="text-xs text-muted-foreground/50 mt-2">
                      {a.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
