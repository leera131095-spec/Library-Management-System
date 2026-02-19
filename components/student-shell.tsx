"use client"

import { useState } from "react"

export function StudentShell(){

const [page,setPage]=useState("dashboard")

if(page==="books"){

return(

<div className="fairytale-bg">

<div className="fairytale-card">

<h1>📚 Available Books</h1>

<p>Cinderella</p>

<p>Harry Potter</p>

<p>Little Women</p>

<button className="magic-button"
onClick={()=>setPage("dashboard")}
>
Back
</button>

</div>

</div>

)

}


if(page==="issued"){

return(

<div className="fairytale-bg">

<div className="fairytale-card">

<h1>⭐ My Books</h1>

<p>Harry Potter</p>

<p>Fine: ₹10</p>

<button
className="magic-button"
onClick={()=>setPage("dashboard")}
>
Back
</button>

</div>

</div>

)

}


return(

<div className="fairytale-bg">

<div className="fairytale-card">

<h1>🌸 Student Library</h1>

<button
className="magic-button"
onClick={()=>setPage("books")}
>
📖 View Books
</button>

<button
className="magic-button"
onClick={()=>setPage("issued")}
>
⭐ My Books
</button>

</div>

</div>

)

}
