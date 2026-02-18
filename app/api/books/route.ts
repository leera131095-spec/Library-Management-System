import { NextResponse } from "next/server"
import { getBooks, addBook, deleteBook } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getBooks())
}

export async function POST(request: Request) {
  const body = await request.json()
  const { title, author, copies } = body

  if (!title || !author || !copies) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    )
  }

  const book = addBook(title, author, Number(copies))
  return NextResponse.json(book, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Book ID is required." },
      { status: 400 }
    )
  }

  const success = deleteBook(Number(id))
  if (!success) {
    return NextResponse.json({ error: "Book not found." }, { status: 404 })
  }

  return NextResponse.json({ message: "Book deleted." })
}
