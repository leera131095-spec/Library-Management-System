"use client"

import { useState, useEffect } from "react"

export function IssueBookPage() {

  const [students, setStudents] = useState<any[]>([])

  const [books, setBooks] = useState<any[]>([])

  const [studentId, setStudentId] = useState("")

  const [bookTitle, setBookTitle] = useState("")

  const [message, setMessage] = useState("")


  useEffect(() => {

    const storedStudents =
      JSON.parse(localStorage.getItem("students") || "[]")

    const storedBooks =
      JSON.parse(localStorage.getItem("books") || "[]")

    setStudents(storedStudents)

    setBooks(storedBooks)

  }, [])



  const issueBook = () => {

    if (!studentId || !bookTitle) {

      setMessage("Please select student and book")

      return

    }


    const issues =
      JSON.parse(localStorage.getItem("issues") || "[]")


    issues.push({

      studentId: studentId,

      bookTitle: bookTitle,

      issueDate: new Date().toISOString(),

      returned: false

    })


    localStorage.setItem(

      "issues",

      JSON.stringify(issues)

    )


    setMessage("Book Issued Successfully 🌸")

  }



  return (

    <div className="p-6">


      <h1 className="text-3xl font-bold mb-6
