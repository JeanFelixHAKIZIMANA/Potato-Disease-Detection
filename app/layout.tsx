import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { AdminAuthProvider } from "@/contexts/admin-auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Vision - Image Analysis App",
  description: "AI-powered image analysis with personalized recommendations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AdminAuthProvider>
            <div className="min-h-screen">{children}</div>
          </AdminAuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
