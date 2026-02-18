"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { BookPlus, Trash2, Check, AlertCircle } from "lucide-react"
import type { Book } from "@/lib/store"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AddBookPage() {
  const { data: books } = useSWR<Book[]>("/api/books", fetcher, {
    refreshInterval: 3000,
  })
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [copies, setCopies] = useState("")
  const [toast, setToast] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, copies: Number(copies) }),
      })

      if (res.ok) {
        showToast("success", `"${title}" has been added to the library!`)
        setTitle("")
        setAuthor("")
        setCopies("")
        mutate("/api/books")
        mutate("/api/stats")
      } else {
        const data = await res.json()
        showToast("error", data.error || "Failed to add book.")
      }
    } catch {
      showToast("error", "Something went wrong.")
    }

    setIsSubmitting(false)
  }

  const handleDeleteBook = async (id: number, bookTitle: string) => {
    try {
      const res = await fetch(`/api/books?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        showToast("success", `"${bookTitle}" has been removed.`)
        mutate("/api/books")
        mutate("/api/stats")
      }
    } catch {
      showToast("error", "Failed to delete book.")
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Toast notification */}
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
          Add Book
        </h1>
        <p className="text-muted-foreground mt-1 leading-relaxed">
          Add new books to the enchanted collection.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Add book form */}
        <div className="xl:col-span-2">
          <div className="bg-card rounded-xl p-6 fairytale-shadow border border-border/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookPlus className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-serif text-lg font-semibold text-foreground">
                New Book
              </h2>
            </div>

            <form onSubmit={handleAddBook} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="book-title"
                  className="text-sm font-medium text-foreground"
                >
                  Book Title
                </label>
                <input
                  id="book-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="book-author"
                  className="text-sm font-medium text-foreground"
                >
                  Author
                </label>
                <input
                  id="book-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="book-copies"
                  className="text-sm font-medium text-foreground"
                >
                  Number of Copies
                </label>
                <input
                  id="book-copies"
                  type="number"
                  min="1"
                  value={copies}
                  onChange={(e) => setCopies(e.target.value)}
                  placeholder="Enter number of copies"
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition-all text-sm"
                  required
                />
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
                    <BookPlus className="w-4 h-4" />
                    Add to Collection
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Book list */}
        <div className="xl:col-span-3">
          <div className="bg-card rounded-xl fairytale-shadow border border-border/30 overflow-hidden">
            <div className="p-5 border-b border-border/30">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Library Collection
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {books?.length ?? 0} books in catalog
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      ID
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Author
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Copies
                    </th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books?.map((book) => (
                    <tr
                      key={book.id}
                      className="border-t border-border/20 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-3 text-muted-foreground">
                        #{book.id}
                      </td>
                      <td className="px-5 py-3 font-medium text-foreground">
                        {book.title}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {book.author}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="text-foreground font-medium">
                          {book.copies}
                        </span>
                        <span className="text-muted-foreground">
                          /{book.totalCopies}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() =>
                            handleDeleteBook(book.id, book.title)
                          }
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                          aria-label={`Delete ${book.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!books || books.length === 0) && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-muted-foreground text-sm"
                      >
                        No books yet. Add your first book above!
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
