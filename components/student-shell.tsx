"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

type IssuedBook = {

  student: string;
  book: string;
  dueDate: string;
  fine: number;

};

export function StudentShell() {

  const { user, logout } = useAuth();

  const [books, setBooks] = useState<IssuedBook[]>([]);

  useEffect(() => {

    const allIssued = JSON.parse(
      localStorage.getItem("issuedBooks") || "[]"
    );

    const myBooks = allIssued.filter(
      (b: IssuedBook) =>
        b.student === user?.name
    );

    setBooks(myBooks);

  }, [user]);


  const totalFine =
    books.reduce((sum, b) => sum + b.fine, 0);


  return (

    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">


      {/* Sidebar */}

      <div className="w-64 bg-white shadow-xl p-5">

        <h1 className="text-2xl font-bold text-purple-700 mb-10">

          📚 Dream Library

        </h1>


        <button
          onClick={logout}
          className="text-red-500"
        >

          Logout

        </button>

      </div>



      {/* Main */}

      <div className="flex-1 p-10">

        <h2 className="text-3xl font-bold mb-6">

          Welcome, {user?.name} ✨

        </h2>



        {/* Cards */}

        <div className="grid grid-cols-3 gap-6 mb-10">


          <div className="bg-white p-6 rounded-xl">

            Books Issued

            <p className="text-2xl">

              {books.length}

            </p>

          </div>


          <div className="bg-white p-6 rounded-xl">

            Fine Due

            <p className="text-2xl text-red-600">

              ₹ {totalFine}

            </p>

          </div>


          <div className="bg-white p-6 rounded-xl">

            Status

            <p className="text-green-600">

              Active

            </p>

          </div>


        </div>



        {/* Table */}

        <div className="bg-white p-6 rounded-xl">

          <h3 className="text-xl mb-4">

            My Books

          </h3>


          <table className="w-full">

            <thead>

              <tr>

                <th>Book</th>

                <th>Due</th>

                <th>Fine</th>

              </tr>

            </thead>


            <tbody>

              {books.map((b, i) => (

                <tr key={i}>

                  <td>{b.book}</td>

                  <td>{b.dueDate}</td>

                  <td>₹ {b.fine}</td>

                </tr>

              ))}

            </tbody>

          </table>


        </div>


      </div>

    </div>

  );

}
