"use client"

import useSWR from "swr"
import type { Book } from "@/lib/store"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function BooksTable() {
  const { data: books } = useSWR<Book[]>("/api/books", fetcher, { refreshInterval: 3000 })

  return (
    <div className="bg-card rounded-[--radius-lg] fairytale-shadow border border-border/30 overflow-hidden">
      <div className="p-5 border-b border-border/30">
        <h3 className="font-serif text-lg font-semibold text-foreground">Book Catalog</h3>
        <p className="text-xs text-muted-foreground mt-0.5">All books in the library collection</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Author</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody>
            {books?.map((book) => (
              <tr key={book.id} className="border-t border-border/20 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3.5 font-medium text-foreground">{book.title}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{book.author}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    book.copies > 0
                      ? "bg-success/20 text-success-foreground"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {book.copies}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center text-muted-foreground">{book.totalCopies}</td>
              </tr>
            ))}
            {(!books || books.length === 0) && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground text-sm">
                  No books in the catalog yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
