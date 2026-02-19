"use client"

import { useState } from "react"

interface Props {
  onLogin: () => void
}

export function StudentLogin({ onLogin }: Props) {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleLogin() {

    if (username === "student" && password === "1234") {

      onLogin()

    } else {

      alert("Invalid student login")

    }

  }

  return (

    <div className="fairytale-bg">

      <div className="fairytale-card">

        <h1>🌸 Student Login</h1>

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

        <button
          className="magic-button"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>

    </div>

  )

}
