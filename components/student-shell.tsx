"use client"

import { useState } from "react"

export function StudentShell() {

const [page, setPage] = useState("dashboard")

return (

<div className="flex h-screen">

{/* Sidebar */}

<div className="w-64 bg-white border-r p-4">

<h2 className="text-xl font-bold mb-6">

🌸 Student Library

</h2>


<button
className="block mb-2"
onClick={() => setPage("dashboard")}
>

Dashboard

</button>


<button
className="block mb-2"
onClick={() => setPage("books")}
>

Browse Books

</button>


<button
className="block mb-2"
onClick={() => setPage("mybooks")}
>

My Books

</button>


</div>


{/* Main Content */}

<div className="flex-1 p-6">


{page === "dashboard" && (

<div>

<h1 className="text-2xl mb-4">

Dashboard

</h1>


<div className="grid grid-cols-3 gap-4">


<div className="bg-white p-4 rounded">

Books Available

</div>


<div className="bg-white p-4 rounded">

My Books: 1

</div>


<div className="bg-white p-4 rounded">

Fine: ₹10

</div>


</div>


</div>

)}



{page === "books" && (

<div>

<h1>Browse Books</h1>

<p>Harry Potter</p>

<p>1984</p>

</div>

)}



{page === "mybooks" && (

<div>

<h1>My Books</h1>

<p>Harry Potter</p>

</div>

)}


</div>


</div>

)

}
