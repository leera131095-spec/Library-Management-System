import type { Metadata, Viewport } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Enchanted Library - Management System",
  description: "A dreamy fairytale library management system for managing books, students, and transactions.",
}

export const viewport: Viewport = {
  themeColor: "#FFF5F7",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
