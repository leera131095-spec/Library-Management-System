"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function LoginPage() {

  const { login } = useAuth()
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {

    const success = login(username, password)

    if (success) {

      router.refresh()

    } else {

      setError("Invalid credentials ✨")

    }

  }

  return (

    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(to bottom right, #fbc2eb, #a6c1ee)",
      fontFamily: "serif"
    }}>

      <div style={{

        padding: "40px",
        borderRadius: "20px",

        background: "rgba(255,255,255,0.8)",

        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",

        textAlign: "center",

        width: "300px"

      }}>

        <h1 style={{
          marginBottom: "20px"
        }}>
          📚 Enchanted Library
        </h1>


        <input

          placeholder="Username"

          value={username}

          onChange={(e) => setUsername(e.target.value)}

          style={{

            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "1px solid pink"

          }}

        />


        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) => setPassword(e.target.value)}

          style={{

            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid pink"

          }}

        />


        <button

          onClick={handleLogin}

          style={{

            width: "100%",
            padding: "10px",

            borderRadius: "10px",

            border: "none",

            background:
              "linear-gradient(to right, #ff9a9e, #fad0c4)",

            cursor: "pointer",

            fontWeight: "bold"

          }}

        >

          Enter ✨

        </button>


        <p style={{
          color: "red",
          marginTop: "10px"
        }}>
          {error}
        </p>


        <p style={{
          fontSize: "12px",
          marginTop: "15px",
          opacity: 0.6
        }}>
          Welcome to your magical library
        </p>


      </div>

    </div>

  )

}
