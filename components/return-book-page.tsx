"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { RotateCcw, Check, AlertCircle, Clock, DollarSign } from "lucide-react"
import type { Transaction, Student } from "@/lib/store"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ReturnBookPage() {
  const { data: transactions } = useSWR<Transaction[]>(
    "/api/transactions",
    fetcher,
    { refreshInterval: 3000 }
  )
  const { data: students } = useSWR<Student[]>("/api/students", fetcher)
  const [studentId, setStudentId] = useState("")
  const [bookTitle, setBookTitle] = useState("")
  const [toast, setToast] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastFine, setLastFine] = useState<number | null>(null)

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const activeTransactions = transactions?.filter((t) => !t.returnDate) ?? []

  const studentActiveBooks = activeTransactions.filter(
    (t) => t.studentId === Number(studentId)
  )

  const handleReturnBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLastFine(null)

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "return",
          studentId: Number(studentId),
          bookTitle,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setLastFine(data.fine ?? 0)
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

  const getDaysOverdue = (issueDate: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(issueDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    return days
  }

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
          Return Book
        </h1>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Process book returns and calculate any overdue fines.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Return form */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-card rounded-xl p-6 fairytale-shadow border border-border/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-sage/50 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-success-foreground" />
              </div>
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Return a Book
              </h2>
            </div>

            <form
              onSubmit={handleReturnBook}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="return-student"
                  className="text-sm font-medium text-foreground"
                >
                  Select Student
                </label>
                <select
                  id="return-student"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value)
                    setBookTitle("")
                  }}
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

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="return-book"
                  className="text-sm font-medium text-foreground"
                >
                  Select Book to Return
                </label>
                <select
                  id="return-book"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all text-sm"
                  required
                  disabled={!studentId}
                >
                  <option value="">
                    {studentId
                      ? "Choose a book..."
                      : "Select student first..."}
                  </option>
                  {studentActiveBooks.map((tx) => (
                    <option key={tx.id} value={tx.bookTitle}>
                      {tx.bookTitle} (issued {tx.issueDate})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !studentId || !bookTitle}
                className="mt-2 w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Return Book
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Fine result */}
          {lastFine !== null && (
            <div
              className={cn(
                "rounded-xl p-6 fairytale-shadow border",
                lastFine > 0
                  ? "bg-peach/30 border-peach"
                  : "bg-sage/30 border-sage"
              )}
            >
              <div className="flex items-center gap-3">
                <DollarSign
                  className={cn(
                    "w-6 h-6",
                    lastFine > 0
                      ? "text-warning-foreground"
                      : "text-success-foreground"
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {lastFine > 0 ? "Fine Applied" : "No Fine"}
                  </p>
                  <p className="text-2xl font-bold font-serif text-foreground">
                    ${lastFine}
                  </p>
                </div>
              </div>
              {lastFine > 0 && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  The book was returned past the 7-day loan period. Fine:
                  $5/day overdue.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Active issues table */}
        <div className="xl:col-span-2">
          <div className="bg-card rounded-xl fairytale-shadow border border-border/30 overflow-hidden">
            <div className="p-5 border-b border-border/30">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Active Issues
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeTransactions.length} books currently issued
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Student
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Book
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Issued
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Days
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeTransactions.map((tx) => {
                    const days = getDaysOverdue(tx.issueDate)
                    const isOverdue = days > 7
                    return (
                      <tr
                        key={tx.id}
                        className="border-t border-border/20 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-medium text-foreground">
                          {tx.studentName}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">
                          {tx.bookTitle}
                        </td>
                        <td className="px-5 py-3.5 text-center text-muted-foreground text-xs">
                          {tx.issueDate}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-medium",
                              isOverdue
                                ? "text-destructive"
                                : "text-foreground"
                            )}
                          >
                            <Clock className="w-3 h-3" />
                            {days}d
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={cn(
                              "inline-flex px-2.5 py-1 rounded-full text-xs font-semibold",
                              isOverdue
                                ? "bg-destructive/10 text-destructive"
                                : "bg-success/15 text-success-foreground"
                            )}
                          >
                            {isOverdue ? "Overdue" : "On Time"}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  {activeTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-muted-foreground text-sm"
                      >
                        No books currently issued.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
