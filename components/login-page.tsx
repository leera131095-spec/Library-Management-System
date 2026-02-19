"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export function LoginPage() {

  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")

  const handleLogin = () => {

    const success = login(username, password)

    if (!success) {

      setError("Invalid username or password")

    }

  }

  return (

    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }}>

      <h1>Login</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      <p style={{ color: "red" }}>
        {error}
      </p>

    </div>

  )

}
