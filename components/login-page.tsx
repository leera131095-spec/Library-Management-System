"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export function LoginPage() {

  const { login } = useAuth()

  const [role, setRole] =
    useState<"librarian" | "student" | null>(null)

  const [id, setId] = useState("")

  const [password, setPassword] = useState("")

  const [error, setError] = useState("")


  const handleLogin = () => {

    if (!role) return

    const success =
      login(id, password, role)

    if (!success)
      setError("Invalid credentials")

  }


  if (!role)

    return (

      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">

        <h1 className="text-5xl font-bold mb-10 text-purple-800">

          Dream Library 🌸

        </h1>


        <button
          onClick={() => setRole("librarian")}
          className="mb-4 bg-purple-500 text-white px-8 py-3 rounded-xl"
        >

          Librarian Login

        </button>


        <button
          onClick={() => setRole("student")}
          className="bg-pink-500 text-white px-8 py-3 rounded-xl"
        >

          Student Login

        </button>

      </div>

    )


  return (

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">


      <div className="bg-white p-10 rounded-3xl shadow-xl">

        <h2 className="text-3xl mb-5">

          {role} Login

        </h2>


        <input

          placeholder="ID"

          onChange={(e) => setId(e.target.value)}

          className="block mb-3 border p-2"

        />


        <input

          placeholder="Password"

          type="password"

          onChange={(e) => setPassword(e.target.value)}

          className="block mb-3 border p-2"

        />


        <button

          onClick={handleLogin}

          className="bg-purple-500 text-white px-5 py-2"

        >

          Enter Library

        </button>


        <p className="text-red-500">

          {error}

        </p>

      </div>

    </div>

  )

}
