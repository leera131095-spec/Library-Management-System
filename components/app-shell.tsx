"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Dashboard } from "./dashboard"
import { AddBookPage } from "./add-book-page"
import { IssueBookPage } from "./issue-book-page"
import { ReturnBookPage } from "./return-book-page"

export function AppShell() {
  const [activePage, setActivePage] = useState("dashboard")

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />
      case "add-book":
        return <AddBookPage />
      case "issue-book":
        return <IssueBookPage />
      case "return-book":
        return <ReturnBookPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="lg:pl-64">
        <div className="p-6 pt-16 lg:pt-8 lg:p-8 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
