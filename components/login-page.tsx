"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {

  const { login } = useAuth()

  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleLogin() {

    const success = login(id, password)

    if (!success) {
      setError("Invalid ID or Password")
    }

  }

  return (

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-4">
          Dream Library 📚
        </h1>

        <input
          placeholder="ID"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e)=>setId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-500 text-white p-2 rounded"
        >
          Login
        </button>

        <p className="text-red-500 text-center mt-2">
          {error}
        </p>

      </div>

    </div>
  )
}
