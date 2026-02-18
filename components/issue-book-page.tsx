"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { BookCopy, Check, AlertCircle, UserPlus } from "lucide-react"
import type { Book, Student } from "@/lib/store"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function IssueBookPage() {
  const { data: books } = useSWR<Book[]>("/api/books", fetcher, {
    refreshInterval: 3000,
  })
  const { data: students } = useSWR<Student[]>("/api/students", fetcher, {
    refreshInterval: 3000,
  })
  const [bookTitle, setBookTitle] = useState("")
  const [studentId, setStudentId] = useState("")
  const [toast, setToast] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newStudentName, setNewStudentName] = useState("")
  const [isAddingStudent, setIsAddingStudent] = useState(false)

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "issue",
          studentId: Number(studentId),
          bookTitle,
        }),
      })

      const data = await res.json()

      if (data.success) {
        showToast("success", data.message)
        setBookTitle("")
        setStudentId("")
        mutate("/api/books")
        mutate("/api/transactions")
        mutate("/api/stats")
      } else {
        showToast("error", data.message)
      }
    } catch {
      showToast("error", "Something went wrong.")
    }

    setIsSubmitting(false)
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddingStudent(true)

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newStudentName }),
      })

      if (res.ok) {
        showToast("success", `Student "${newStudentName}" registered!`)
        setNewStudentName("")
        mutate("/api/students")
        mutate("/api/stats")
      }
    } catch {
      showToast("error", "Failed to register student.")
    }

    setIsAddingStudent(false)
  }

  const availableBooks = books?.filter((b) => b.copies > 0) ?? []

  return (
    <div className="flex flex-col gap-8">
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg fairytale-shadow-lg text-sm font-medium",
            toast.type === "success"
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          )}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Issue Book
        </h1>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Issue a book from the collection to a registered student.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Issue form */}
        <div className="xl:col-span-1">
          <div className="bg-card rounded-xl p-6 fairytale-shadow border border-border/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warning/30 flex items-center justify-center">
                <BookCopy className="w-5 h-5 text-warning-foreground" />
              </div>
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Issue a Book
              </h2>
            </div>

            <form onSubmit={handleIssueBook} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="issue-book"
                  className="text-sm font-medium text-foreground"
                >
                  Select Book
                </label>
                <select
                  id="issue-book"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all text-sm"
                  required
                >
                  <option value="">Choose a book...</option>
                  {availableBooks.map((book) => (
                    <option key={book.id} value={book.title}>
                      {book.title} ({book.copies} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="issue-student"
                  className="text-sm font-medium text-foreground"
                >
                  Select Student
                </label>
                <select
                  id="issue-student"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all text-sm"
                  required
                >
                  <option value="">Choose a student...</option>
                  {students?.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} (ID: {student.id})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <BookCopy className="w-4 h-4" />
                    Issue Book
                  </>
                )}
              </button>
            </form>

            {/* Add student mini-form */}
            <div className="mt-6 pt-5 border-t border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="w-4 h-4 text-accent-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Register New Student
                </h3>
              </div>
              <form onSubmit={handleAddStudent} className="flex gap-2">
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Student name"
                  className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={isAddingStudent}
                  className="px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:bg-accent/80 transition-all disabled:opacity-60"
                >
                  {isAddingStudent ? "..." : "Add"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Available books */}
        <div className="xl:col-span-1">
          <div className="bg-card rounded-xl fairytale-shadow border border-border/30 overflow-hidden">
            <div className="p-5 border-b border-border/30">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Available Books
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {availableBooks.length} books available
              </p>
            </div>
            <div className="p-4 flex flex-col gap-2 max-h-[500px] overflow-y-auto">
              {availableBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/20 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {book.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {book.author}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-success/15 text-success-foreground text-xs font-bold">
                    {book.copies}
                  </span>
                </div>
              ))}
              {availableBooks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No books available for issue.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Students list */}
        <div className="xl:col-span-1">
          <div className="bg-card rounded-xl fairytale-shadow border border-border/30 overflow-hidden">
            <div className="p-5 border-b border-border/30">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Registered Students
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {students?.length ?? 0} students
              </p>
            </div>
            <div className="p-4 flex flex-col gap-2 max-h-[500px] overflow-y-auto">
              {students?.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/20"
                >
                  <div className="w-8 h-8 rounded-full bg-lavender/50 flex items-center justify-center text-xs font-bold text-accent-foreground">
                    {student.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {student.id}
                    </p>
                  </div>
                </div>
              ))}
              {(!students || students.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No students registered yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
