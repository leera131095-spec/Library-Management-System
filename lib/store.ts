// In-memory store for the library management system
// In production, replace with a proper database

export interface Book {
  id: number
  title: string
  author: string
  copies: number
  totalCopies: number
  addedAt: string
}

export interface Student {
  id: number
  name: string
  registeredAt: string
}

export interface Transaction {
  id: number
  studentId: number
  studentName: string
  bookId: number
  bookTitle: string
  issueDate: string
  returnDate: string | null
  fine: number
}

export interface LibraryStats {
  totalBooks: number
  totalStudents: number
  activeIssues: number
  totalFines: number
  availableBooks: number
}

// In-memory data store
let books: Book[] = [
  { id: 1, title: "Pride and Prejudice", author: "Jane Austen", copies: 3, totalCopies: 5, addedAt: "2025-01-15" },
  { id: 2, title: "The Great Gatsby", author: "F. Scott Fitzgerald", copies: 2, totalCopies: 4, addedAt: "2025-02-10" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", copies: 4, totalCopies: 4, addedAt: "2025-03-05" },
  { id: 4, title: "1984", author: "George Orwell", copies: 1, totalCopies: 3, addedAt: "2025-04-20" },
  { id: 5, title: "Little Women", author: "Louisa May Alcott", copies: 2, totalCopies: 3, addedAt: "2025-05-01" },
]

let students: Student[] = [
  { id: 1, name: "Alice Wonderland", registeredAt: "2025-01-20" },
  { id: 2, name: "Peter Pan", registeredAt: "2025-02-14" },
  { id: 3, name: "Dorothy Gale", registeredAt: "2025-03-10" },
]

let transactions: Transaction[] = [
  { id: 1, studentId: 1, studentName: "Alice Wonderland", bookId: 1, bookTitle: "Pride and Prejudice", issueDate: "2026-02-01", returnDate: null, fine: 0 },
  { id: 2, studentId: 2, studentName: "Peter Pan", bookId: 2, bookTitle: "The Great Gatsby", issueDate: "2026-02-10", returnDate: null, fine: 0 },
  { id: 3, studentId: 3, studentName: "Dorothy Gale", bookId: 4, bookTitle: "1984", issueDate: "2026-01-15", returnDate: "2026-01-28", fine: 30 },
]

let nextBookId = 6
let nextStudentId = 4
let nextTransactionId = 4

// Book operations
export function getBooks(): Book[] {
  return books
}

export function addBook(title: string, author: string, copies: number): Book {
  const book: Book = {
    id: nextBookId++,
    title,
    author,
    copies,
    totalCopies: copies,
    addedAt: new Date().toISOString().split("T")[0],
  }
  books.push(book)
  return book
}

export function deleteBook(id: number): boolean {
  const index = books.findIndex((b) => b.id === id)
  if (index === -1) return false
  books.splice(index, 1)
  return true
}

// Student operations
export function getStudents(): Student[] {
  return students
}

export function addStudent(name: string): Student {
  const student: Student = {
    id: nextStudentId++,
    name,
    registeredAt: new Date().toISOString().split("T")[0],
  }
  students.push(student)
  return student
}

// Transaction operations
export function getTransactions(): Transaction[] {
  return transactions
}

export function issueBook(studentId: number, bookTitle: string): { success: boolean; message: string; transaction?: Transaction } {
  const book = books.find((b) => b.title.toLowerCase() === bookTitle.toLowerCase())
  if (!book) return { success: false, message: "Book not found." }
  if (book.copies <= 0) return { success: false, message: "No copies available." }

  const student = students.find((s) => s.id === studentId)
  if (!student) return { success: false, message: "Student not found." }

  // Check if student already has this book
  const existing = transactions.find(
    (t) => t.studentId === studentId && t.bookId === book.id && !t.returnDate
  )
  if (existing) return { success: false, message: "Student already has this book issued." }

  book.copies -= 1

  const transaction: Transaction = {
    id: nextTransactionId++,
    studentId,
    studentName: student.name,
    bookId: book.id,
    bookTitle: book.title,
    issueDate: new Date().toISOString().split("T")[0],
    returnDate: null,
    fine: 0,
  }
  transactions.push(transaction)
  return { success: true, message: "Book issued successfully!", transaction }
}

export function returnBook(studentId: number, bookTitle: string): { success: boolean; message: string; fine?: number } {
  const book = books.find((b) => b.title.toLowerCase() === bookTitle.toLowerCase())
  if (!book) return { success: false, message: "Book not found." }

  const student = students.find((s) => s.id === studentId)
  if (!student) return { success: false, message: "Student not found." }

  const transaction = transactions.find(
    (t) => t.studentId === studentId && t.bookId === book.id && !t.returnDate
  )
  if (!transaction) return { success: false, message: "No active transaction found for this book and student." }

  const returnDate = new Date()
  const issueDate = new Date(transaction.issueDate)
  const days = Math.floor((returnDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24))
  const fine = days > 7 ? (days - 7) * 5 : 0

  transaction.returnDate = returnDate.toISOString().split("T")[0]
  transaction.fine = fine
  book.copies += 1

  return { success: true, message: `Book returned successfully!`, fine }
}

export function getStats(): LibraryStats {
  const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0)
  const availableBooks = books.reduce((sum, b) => sum + b.copies, 0)
  const totalStudents = students.length
  const activeIssues = transactions.filter((t) => !t.returnDate).length
  const totalFines = transactions.reduce((sum, t) => sum + t.fine, 0)

  return { totalBooks, totalStudents, activeIssues, totalFines, availableBooks }
}
