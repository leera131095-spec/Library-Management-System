"use client";

import { useAuth } from "@/lib/auth-context";

export function StudentShell() {

  const { user, logout } = useAuth();

  return (

    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">

      {/* Sidebar */}

      <div className="w-64 bg-white shadow-xl p-5">

        <h1 className="text-2xl font-bold text-purple-700 mb-10">

          📚 Dream Library

        </h1>

        <nav className="space-y-4">

          <button className="block w-full text-left hover:text-purple-600">

            Dashboard

          </button>

          <button className="block w-full text-left hover:text-purple-600">

            My Books

          </button>

          <button className="block w-full text-left hover:text-purple-600">

            Fine

          </button>

          <button
            onClick={logout}
            className="block w-full text-left text-red-500 hover:text-red-700"
          >

            Logout

          </button>

        </nav>

      </div>


      {/* Main content */}

      <div className="flex-1 p-10">

        <h2 className="text-3xl font-bold text-purple-800 mb-6">

          Welcome, {user?.name} ✨

        </h2>


        {/* Cards */}

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-lg">

            <h3 className="text-lg font-semibold">

              Books Issued

            </h3>

            <p className="text-2xl mt-2">

              2

            </p>

          </div>


          <div className="bg-white p-6 rounded-2xl shadow-lg">

            <h3 className="text-lg font-semibold">

              Fine Due

            </h3>

            <p className="text-2xl mt-2">

              ₹50

            </p>

          </div>


          <div className="bg-white p-6 rounded-2xl shadow-lg">

            <h3 className="text-lg font-semibold">

              Status

            </h3>

            <p className="text-2xl mt-2 text-green-600">

              Active

            </p>

          </div>

        </div>


        {/* Table */}

        <div className="mt-10 bg-white p-6 rounded-2xl shadow-lg">

          <h3 className="text-xl font-semibold mb-4">

            My Issued Books

          </h3>


          <table className="w-full">

            <thead>

              <tr className="text-left">

                <th>Book</th>

                <th>Due Date</th>

                <th>Status</th>

              </tr>

            </thead>


            <tbody>

              <tr>

                <td>Harry Potter</td>

                <td>20 Feb 2026</td>

                <td className="text-green-600">

                  On Time

                </td>

              </tr>


              <tr>

                <td>Alchemist</td>

                <td>15 Feb 2026</td>

                <td className="text-red-600">

                  Late

                </td>

              </tr>

            </tbody>

          </table>

        </div>


      </div>

    </div>

  );

}
