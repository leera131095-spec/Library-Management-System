"use client"

import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"

export function StudentDashboard() {

  const { user } = useAuth()

  const [issuedBooks, setIssuedBooks] = useState<any[]>([])
  const [fine, setFine] = useState(0)

  useEffect(() => {

    const issues =
      JSON.parse(localStorage.getItem("issues") || "[]")

    const myBooks =
      issues.filter(
        (issue: any) =>
          issue.studentId === user?.id &&
          !issue.returned
      )

    setIssuedBooks(myBooks)

    let totalFine = 0

    myBooks.forEach((book: any) => {

      const issueDate =
        new Date(book.issueDate)

      const today = new Date()

      const days =
        Math.floor(
          (today.getTime() - issueDate.getTime())
          /
          (1000 * 60 * 60 * 24)
        )

      if (days > 7)
        totalFine += (days - 7) * 5

    })

    setFine(totalFine)

  }, [user])

  return (

    <div className="min-h-screen p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">

      <h1 className="text-4xl font-bold text-purple-800 mb-6">

        📚 My Library

      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">

          Issued Books

        </h2>

        {issuedBooks.length === 0 && (

          <p>No books issued</p>

        )}

        {issuedBooks.map((book, index) => (

          <div key={index}
            className="flex justify-between p-3 border-b">

            <span>{book.bookTitle}</span>

            <span className="text-red-500">

              Fine ₹

              {

                Math.max(
                  0,
                  Math.floor(
                    (new Date().getTime() -
                    new Date(book.issueDate).getTime())
                    /
                    (1000*60*60*24)
                  ) - 7
                ) * 5

              }

            </span>

          </div>

        ))}

      </div>


      <div className="bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-xl font-semibold mb-2">

          Total Fine

        </h2>

        <p className="text-3xl font-bold text-red-600">

          ₹{fine}

        </p>

      </div>

    </div>

  )

}
