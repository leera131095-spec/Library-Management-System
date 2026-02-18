import { NextResponse } from "next/server"
import { getTransactions, issueBook, returnBook } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getTransactions())
}

export async function POST(request: Request) {
  const body = await request.json()
  const { action, studentId, bookTitle } = body

  if (!action || !studentId || !bookTitle) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 })
  }

  if (action === "issue") {
    const result = issueBook(Number(studentId), bookTitle)
    return NextResponse.json(result, { status: result.success ? 201 : 400 })
  }

  if (action === "return") {
    const result = returnBook(Number(studentId), bookTitle)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 })
}
