import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

TITLE_FONT = ("Georgia", 21, "bold")
LABEL_FONT = ("Georgia", 12)
ENTRY_FONT = ("Georgia", 11)
BUTTON_FONT = ("Georgia", 11, "bold")

# ---------------- DATABASE ---------------- #

conn = sqlite3.connect("library.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    copies INTEGER
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    book_id INTEGER,
    issue_date TEXT,
    return_date TEXT,
    fine REAL
)
""")

conn.commit()

# ---------------- FUNCTIONS ---------------- #

def add_book():
    title = book_title.get()
    author = book_author.get()
    copies = book_copies.get()

    if not title or not author or not copies:
        messagebox.showwarning("Missing Info", "Please fill all fields.")
        return

    try:
        copies = int(copies)
    except ValueError:
        messagebox.showerror("Error", "Copies must be a number.")
        return

    cursor.execute(
        "INSERT INTO books (title, author, copies) VALUES (?, ?, ?)",
        (title, author, copies)
    )

    conn.commit()
    messagebox.showinfo("Success", "Book Added Successfully")
    update_stats()


def add_student():
    name = student_name.get()
    print("Student added")

    if not name:
        messagebox.showwarning("Missing Info", "Enter student name.")
        return

    cursor.execute("INSERT INTO students (name) VALUES (?)", (name,))
    conn.commit()
    messagebox.showinfo("Success", "Student Registered")
    update_stats()

def issue_book():
    title = issue_title.get()
    student_id = issue_student_id.get()

    if not title or not student_id:
        messagebox.showwarning("Missing Info", "Enter Book Title and Student ID.")
        return

    # Get book id and copies
    cursor.execute("SELECT id, copies FROM books WHERE title=?", (title,))
    book = cursor.fetchone()

    if not book:
        messagebox.showerror("Error", "Book not found.")
        return

    book_id = book[0]
    copies = book[1]
    print("Current copies:", copies)

    # Check stock
    if copies <= 0:
        messagebox.showerror("Out of Stock", "No copies available.")
        return

    # Reduce copies
    cursor.execute("UPDATE books SET copies = copies - 1 WHERE id=?", (book_id,))

    date = datetime.now().strftime("%Y-%m-%d")

    cursor.execute("""
        INSERT INTO transactions (student_id, book_id, issue_date, fine)
        VALUES (?, ?, ?, ?)
    """, (student_id, book_id, date, 0))

    conn.commit()
    messagebox.showinfo("Success", "Book Issued Successfully")
    update_stats()

def return_book():
    title = return_title.get()
    student_id = return_student_id.get()
    return_date = datetime.now()

    # Step 1: Get book_id from books table
    cursor.execute("SELECT id FROM books WHERE title=?", (title,))
    book = cursor.fetchone()

    if not book:
        messagebox.showerror("Error", "Book not found.")
        return

    book_id = book[0]

    # Step 2: Find active transaction
    cursor.execute("""
    SELECT id, issue_date FROM transactions
    WHERE book_id=? AND student_id=? AND return_date IS NULL
    """, (book_id, student_id))

    data = cursor.fetchone()

    if data:
        transaction_id = data[0]
        issue_date = datetime.strptime(data[1], "%Y-%m-%d")

        days = (return_date - issue_date).days
        fine = 0

        if days > 7:
            fine = (days - 7) * 5

        cursor.execute("""
        UPDATE transactions
        SET return_date=?, fine=?
        WHERE id=?
        """, (return_date.strftime("%Y-%m-%d"), fine, transaction_id))

        cursor.execute("UPDATE books SET copies = copies + 1 WHERE id=?", (book_id,))
        conn.commit()
        messagebox.showinfo("Returned", f"Book returned successfully!\nFine: ₹{fine}")

    else:
        messagebox.showerror("Error", "No active transaction found.")
    update_stats()

def delete_book():
    book_id = book_id_delete.get()

    if not book_id:
        messagebox.showwarning("Missing Info", "Enter Book ID to delete.")
        return

    cursor.execute("DELETE FROM books WHERE id=?", (book_id,))
    conn.commit()

    messagebox.showinfo("Deleted", "Book deleted successfully.")
    book_id_delete.delete(0, tk.END)
    update_stats()

def delete_student():
    student_id_value = student_id_delete.get()

    if not student_id_value:
        messagebox.showwarning("Missing Info", "Enter Student ID to delete.")
        return

    cursor.execute("DELETE FROM students WHERE id=?", (student_id_value,))
    conn.commit()

    messagebox.showinfo("Deleted", "Student deleted successfully.")
    student_id_delete.delete(0, tk.END)
    update_stats()

def show_analytics():
    df = pd.read_sql_query("SELECT * FROM transactions", conn)

    if df.empty:
        messagebox.showinfo("Info", "No Data Available")
        return

    df['issue_date'] = pd.to_datetime(df['issue_date'], errors='coerce')
    df = df.dropna(subset=['issue_date'])

    monthly = df.groupby(df['issue_date'].dt.month).size()

    plt.figure()
    monthly.plot(kind='line')
    plt.title("Monthly Book Issues")
    plt.xlabel("Month")
    plt.ylabel("Number of Issues")
    plt.show()

def update_stats():
    cursor.execute("SELECT COUNT(*) FROM books")
    total_books = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM students")
    total_students = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM transactions WHERE return_date IS NULL")
    active_issues = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(fine) FROM transactions")
    total_fines = cursor.fetchone()[0]
    total_fines = total_fines if total_fines else 0

    # Clear old widgets
    for widget in stats_frame.winfo_children():
        widget.destroy()

    create_stat_card("Total Books", total_books)
    create_stat_card("Students", total_students)
    create_stat_card("Active Issues", active_issues)
    create_stat_card("Total Fines ₹", total_fines)

def create_stat_card(title, value):
    card = tk.Frame(
        stats_frame,
        bg="#DBC2A6",
        padx=30,
        pady=20
    )
    card.pack(side="left", padx=20)

    tk.Label(
        card,
        text=title,
        bg="#DBC2A6",
        fg="#414A37",
        font=("Georgia", 12)
    ).pack()

    tk.Label(
        card,
        text=value,
        bg="#DBC2A6",
        fg="#99744A",
        font=("Georgia", 22, "bold")
    ).pack(pady=(8,0))



def show_table(query, columns, title):
    window = tk.Toplevel(root)
    window.title(title)
    window.geometry("700x400")
    window.configure(bg="#F5F1E8")

    tree = ttk.Treeview(window, columns=columns, show="headings")

    for col in columns:
        tree.heading(col, text=col)
        tree.column(col, width=120)

    cursor.execute(query)
    rows = cursor.fetchall()

    for row in rows:
        tree.insert("", "end", values=row)

    tree.pack(fill="both", expand=True, padx=20, pady=20)
    scrollbar = ttk.Scrollbar(window, orient="vertical", command=tree.yview)
    tree.configure(yscrollcommand=scrollbar.set)
    scrollbar.pack(side="right", fill="y")

def open_library_records():
    records_window = tk.Toplevel(root)
    records_window.title("Library Records")
    records_window.geometry("800x500")
    records_window.configure(bg="#F5F1E8")

    records_window.lift()  # bring to front
    records_window.focus_force()  # force focus

    notebook = ttk.Notebook(records_window)
    notebook.pack(fill="both", expand=True)


    # -------- BOOKS TAB --------
    books_tab = tk.Frame(notebook, bg="#F5F1E8")
    notebook.add(books_tab, text="📖 Books")

    books_tree = ttk.Treeview(
        books_tab,
        columns=("ID", "Title", "Author", "Copies"),
        show="headings"
    )

    for col in ("ID", "Title", "Author", "Copies"):
        books_tree.heading(col, text=col)
        books_tree.column(col, width=150)

    books_tree.pack(fill="both", expand=True, padx=20, pady=20)

    cursor.execute("SELECT id, title, author, copies FROM books")
    for row in cursor.fetchall():
        books_tree.insert("", "end", values=row)

    # -------- STUDENTS TAB --------
    students_tab = tk.Frame(notebook, bg="#F5F1E8")
    notebook.add(students_tab, text="🎓 Students")

    students_tree = ttk.Treeview(
        students_tab,
        columns=("ID", "Name"),
        show="headings"
    )

    for col in ("ID", "Name"):
        students_tree.heading(col, text=col)
        students_tree.column(col, width=200)

    students_tree.pack(fill="both", expand=True, padx=20, pady=20)

    cursor.execute("SELECT id, name FROM students")
    for row in cursor.fetchall():
        students_tree.insert("", "end", values=row)


# ---------------- GUI ---------------- #

root = tk.Tk()
root.title("Cozy Library Management System")
root.geometry("1000x800")
root.configure(bg="#414A37")

# -------- SCROLLABLE LAYOUT -------- #

canvas = tk.Canvas(root, bg="#414A37", highlightthickness=0)
scrollbar = tk.Scrollbar(root, orient="vertical", command=canvas.yview)

scrollbar.pack(side="right", fill="y")
canvas.pack(side="left", fill="both", expand=True)

canvas.configure(yscrollcommand=scrollbar.set)

content = tk.Frame(canvas, bg="#414A37")
stats_frame = tk.Frame(content, bg="#414A37")
stats_frame.pack(pady=20)

canvas_window = canvas.create_window((0, 0), window=content, anchor="nw")

def resize_content(event):
    canvas.itemconfig(canvas_window, width=event.width)

canvas.bind("<Configure>", resize_content)

def configure_scroll(event):
    canvas.configure(scrollregion=canvas.bbox("all"))

content.bind("<Configure>", configure_scroll)

# -------- TITLE -------- #

tk.Label(
    content,
    text="📚Cozy Library Management System",
    font=TITLE_FONT,
    bg="#414A37",
    fg="#DBC2A6"
).pack(pady=(30,10))

tk.Label(
    content,
    text="Manage books, students & analytics in a calm study space✨",
    font=LABEL_FONT,
    bg="#414A37",
    fg="#DBC2A6"
).pack(pady=(0,30))

# -------- CARD FUNCTION -------- #

def create_card(title):
    frame = tk.LabelFrame(
        content,
        text=title,
        font=TITLE_FONT,
        bg="#DBC2A6",
        fg="#414A37",
        padx=30,
        pady=25
    )
    frame.pack(pady=20, fill="x", padx=150)
    return frame

def create_entry(parent):
    entry = tk.Entry(
        parent,
        width=25,
        bg="#F5F1E8",
        fg="#414A37",
        relief="flat",
        font=ENTRY_FONT,
        justify="center"
    )
    entry.pack(pady=5)
    return entry

# -------- BOOK CARD -------- #

book_frame = create_card("📖 Book Corner")

book_inner = tk.Frame(book_frame, bg="#DBC2A6")
book_inner.pack()

tk.Label(book_inner, text="Title:", bg="#DBC2A6", fg="#414A37").pack()
book_title = create_entry(book_inner)

tk.Label(book_inner, text="Author:", bg="#DBC2A6", fg="#414A37").pack()
book_author = create_entry(book_inner)

tk.Label(book_inner, text="Copies:", bg="#DBC2A6", fg="#414A37").pack()
book_copies = create_entry(book_inner)

tk.Label(book_inner, text="Delete Book ID:", bg="#DBC2A6", fg="#414A37").pack()
book_id_delete = create_entry(book_inner)

tk.Button(
    book_inner,
    text="Delete Book",
    bg="#b04a4a",
    fg="white",
    relief="flat",
    cursor="hand2",
    font=BUTTON_FONT,
    command=delete_book
).pack(pady=8)

tk.Button(
    book_inner,
    text="Add Book",
    bg="#99744A",
    fg="white",
    activebackground="#7f5f3a",
    relief="flat",
    cursor="hand2",
    font=BUTTON_FONT,
    command=add_book
).pack(pady=12)

# -------- STUDENT CARD -------- #

student_frame = create_card("🎓 Student Corner")

student_inner = tk.Frame(student_frame, bg="#DBC2A6")
student_inner.pack(pady=10)

tk.Label(student_inner, text="Student Name:", bg="#DBC2A6", fg="#414A37").pack()
student_name = create_entry(student_inner)

tk.Label(student_inner, text="Student ID:", bg="#DBC2A6", fg="#414A37").pack()
student_id = create_entry(student_inner)

tk.Label(student_inner, text="Delete Student ID:", bg="#DBC2A6", fg="#414A37").pack()
student_id_delete = create_entry(student_inner)

tk.Button(
    student_inner,
    text="Delete Student",
    bg="#b04a4a",
    fg="white",
    relief="flat",
    cursor="hand2",
    font=BUTTON_FONT,
    command=delete_student
).pack(pady=8)

tk.Button(
    student_inner,
    text="Add Student",
    bg="#99744A",
    fg="white",
    activebackground="#7f5f3a",
    relief="flat",
    cursor="hand2",
   font=BUTTON_FONT,
    command=add_student
).pack(pady=12)

# -------- ISSUE CARD -------- #

issue_frame = create_card("📚 Issue Book")

issue_inner = tk.Frame(issue_frame, bg="#DBC2A6")
issue_inner.pack(pady=10)

tk.Label(issue_inner, text="Book Title:", bg="#DBC2A6", fg="#414A37").pack()
issue_title = create_entry(issue_inner)

tk.Label(issue_inner, text="Student ID:", bg="#DBC2A6", fg="#414A37").pack()
issue_student_id = create_entry(issue_inner)

tk.Button(
    issue_inner,
    text="Issue Book",
    bg="#99744A",
    fg="white",
    activebackground="#7f5f3a",
    relief="flat",
    cursor="hand2",
    font=BUTTON_FONT,
    command=issue_book
).pack(pady=12)

# -------- RETURN CARD -------- #

return_frame = create_card("🔄 Return Book")

return_inner = tk.Frame(return_frame, bg="#DBC2A6")
return_inner.pack(pady=10)

tk.Label(return_inner, text="Book Title:", bg="#DBC2A6", fg="#414A37").pack()
return_title = create_entry(return_inner)

tk.Label(return_inner, text="Student ID:", bg="#DBC2A6", fg="#414A37").pack()
return_student_id = create_entry(return_inner)

tk.Button(
    return_inner,
    text="Return Book",
    bg="#99744A",
    fg="white",
    activebackground="#7f5f3a",
    relief="flat",
    cursor="hand2",
    font=BUTTON_FONT,
    command=return_book
).pack(pady=12)


# -------- ANALYTICS -------- #

tk.Button(
    content,
    text="📊Open Analytics Dashboard",
    bg="#99744A",
    fg="white",
    relief="flat",
    cursor="hand2",
    font=BUTTON_FONT,
    command=show_analytics
).pack(pady=10)

tk.Button(
    content,
    text="📂 Open Library Records",
    bg="#99744A",
    fg="white",
    relief="flat",
    cursor="hand2",
    font=BUTTON_FONT,
    command=open_library_records
).pack(pady=10)

update_stats()
root.mainloop()
