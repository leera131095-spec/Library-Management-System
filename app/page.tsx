"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { AppShell } from "@/components/app-shell"


export default function Home() {

const { isAuthenticated } = useAuth()

const [showIntro, setShowIntro] = useState(true)

const [role, setRole] = useState<"librarian" | "student" | null>(null)



// 🌸 Magical Intro

useEffect(() => {

const timer = setTimeout(() => {

setShowIntro(false)

}, 3000)

return () => clearTimeout(timer)

}, [])



// 🌸 INTRO SCREEN

if (showIntro) {

return (

<div style={introStyle}>

<h1>✨ Magical Library ✨</h1>

<p>Where every book holds a dream...</p>

</div>

)

}



// 🌸 ROLE SELECTOR

if (!role) {

return (

<div style={containerStyle}>

<div style={cardStyle}>

<h2>Welcome 🌸</h2>

<p>Are you a Librarian or Student?</p>



<button

style={buttonStyle}

onClick={() => setRole("librarian")}

>

Librarian

</button>



<button

style={buttonStyle}

onClick={() => setRole("student")}

>

Student

</button>



</div>

</div>

)

}



// 🌸 LIBRARIAN FLOW

if (role === "librarian") {

if (!isAuthenticated) {

return <LoginPage />

}

return <AppShell />

}



// 🌸 STUDENT DASHBOARD

import { StudentShell } from "@/components/student-shell"

if (role === "student") {

return <StudentShell />

}

return (

<div style={containerStyle}>

<h1>🌸 Student Library</h1>



<div style={cardStyle}>

<h3>Available Books</h3>

<p>Cinderella — Available</p>

<p>Harry Potter — Issued</p>

</div>



<div style={cardStyle}>

<h3>My Books</h3>

<p>Harry Potter</p>

<p style={{color:"red"}}>

Fine: ₹10

</p>

</div>



<div style={cardStyle}>

<h3>Announcements</h3>

<p>New fantasy books added!</p>

<p>Library open till 6 PM</p>

</div>



</div>

)

}



return null

}



// 🌸 STYLES

const introStyle = {

height: "100vh",

display: "flex",

flexDirection: "column" as const,

justifyContent: "center",

alignItems: "center",

background: "linear-gradient(to right, #ffd6ec, #d6e4ff)",

fontSize: "30px",

}



const containerStyle = {

height: "100vh",

display: "flex",

flexDirection: "column" as const,

justifyContent: "center",

alignItems: "center",

background: "linear-gradient(to right, #ffe4f2, #e6f0ff)",

}



const cardStyle = {

background: "white",

padding: "20px",

margin: "10px",

borderRadius: "15px",

boxShadow: "0 0 20px pink",

textAlign: "center" as const

}



const buttonStyle = {

margin: "10px",

padding: "10px 20px",

border: "none",

borderRadius: "10px",

background: "pink",

color: "white",

cursor: "pointer",

fontSize: "16px"

}
