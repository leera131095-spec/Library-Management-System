import { NextResponse } from "next/server"
import { getStudents, addStudent } from "@/lib/store"

export async function GET() {
  return NextResponse.json(getStudents())
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name } = body

  if (!name) {
    return NextResponse.json(
      { error: "Student name is required." },
      { status: 400 }
    )
  }

  const student = addStudent(name)
  return NextResponse.json(student, { status: 201 })
}
