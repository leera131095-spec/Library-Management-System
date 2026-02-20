"use client"

import { useAuth } from "@/lib/auth-context"
import { issuedBooks } from "@/lib/data"

export function StudentDashboard() {

  const { user } = useAuth()

  const myBooks = issuedBooks.filter(
    b => b.studentId === user.id
  )

  function calculateFine(date: string) {

    const issue = new Date(date)
    const today = new Date()

    const diff =
      (today.getTime() - issue.getTime())
      / (1000*60*60*24)

    const late = diff - 7

    return late > 0 ? late * 5 : 0
  }

  return (

    <div>

      <h1 className="text-3xl mb-5">
        Welcome {user.name}
      </h1>

      {myBooks.map(book => (

        <div
          key={book.bookTitle}
          className="p-4 bg-white shadow mb-3 rounded"
        >

          <h2>{book.bookTitle}</h2>

          <p>
            Fine:
            ₹{calculateFine(book.issueDate)}
          </p>

        </div>

      ))}

    </div>

  )

}
