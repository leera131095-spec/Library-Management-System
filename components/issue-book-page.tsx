"use client"

import { useState, useEffect } from "react"

export function IssueBookPage() {

  const [students, setStudents] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])

  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedBook, setSelectedBook] = useState("")

  const [message, setMessage] = useState("")



  // Load data safely
  useEffect(() => {

    const s =
      JSON.parse(localStorage.getItem("students") || "[]")

    const b =
      JSON.parse(localStorage.getItem("books") || "[]")

    setStudents(s)

    setBooks(b)

  }, [])



  // Issue function
  const handleIssue = () => {

    if (!selectedStudent || !selectedBook) {

      setMessage("⚠ Please select both student and book")
      return

    }

    const issues =
      JSON.parse(localStorage.getItem("issues") || "[]")

    issues.push({

      studentId: selectedStudent,

      bookTitle: selectedBook,

      issueDate: new Date().toISOString(),

      returned: false

    })

    localStorage.setItem(
      "issues",
      JSON.stringify(issues)
    )


    setMessage("✅ Book Issued Successfully!")

  }



  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold text-purple-700 mb-6">

        📚 Issue Book

      </h1>



      {/* STUDENT */}

      <select

        className="border p-3 rounded-lg mb-4 w-full"

        onChange={(e) =>
          setSelectedStudent(e.target.value)
        }

      >

        <option value="">
          Select Student
        </option>


        {students.map((s) => (

          <option key={s.id} value={s.id}>

            {s.name} (ID: {s.id})

          </option>

        ))}

      </select>



      {/* BOOK */}

      <select

        className="border p-3 rounded-lg mb-4 w-full"

        onChange={(e) =>
          setSelectedBook(e.target.value)
        }

      >

        <option value="">
          Select Book
        </option>


        {books.map((b, index) => (

          <option key={index} value={b.title}>

            {b.title}

          </option>

        ))}

      </select>



      <button

        onClick={handleIssue}

        className="bg-purple-600 text-white px-6 py-3 rounded-xl"

      >

        Issue Book

      </button>



      {message && (

        <p className="mt-4 text-green-600">

          {message}

        </p>

      )}


    </div>

  )

}
