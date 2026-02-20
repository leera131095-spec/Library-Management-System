const issues =
  JSON.parse(
    localStorage.getItem("issues") || "[]"
  )

issues.push({

  studentId: selectedStudent.id,

  bookTitle: selectedBook.title,

  issueDate: new Date(),

  returned: false

})

localStorage.setItem(
  "issues",
  JSON.stringify(issues)
)
