"use client"

import useSWR from "swr"
import type { Transaction } from "@/lib/store"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function RecentTransactions() {
  const { data: transactions } = useSWR<Transaction[]>(
    "/api/transactions",
    fetcher,
    { refreshInterval: 3000 }
  )

  const sorted = transactions?.slice().sort((a, b) => {
    const dateA = a.returnDate || a.issueDate
    const dateB = b.returnDate || b.issueDate
    return dateB.localeCompare(dateA)
  })

  return (
    <div className="bg-card rounded-xl fairytale-shadow border border-border/30 overflow-hidden">
      <div className="p-5 border-b border-border/30">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          Recent Transactions
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Latest issue and return activity
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
                Status
              </th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Fine
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted?.map((tx) => (
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
                <td className="px-5 py-3.5 text-center">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      tx.returnDate
                        ? "bg-success/15 text-success-foreground"
                        : "bg-warning/30 text-warning-foreground"
                    }`}
                  >
                    {tx.returnDate ? "Returned" : "Issued"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center text-muted-foreground">
                  {tx.fine > 0 ? `$${tx.fine}` : "-"}
                </td>
              </tr>
            ))}
            {(!sorted || sorted.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-muted-foreground text-sm"
                >
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
