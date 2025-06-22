"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AdminAuthContextType {
  isAdminAuthenticated: boolean
  adminEmail: string
  adminName: string
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logoutAdmin: () => void
  changeAdminPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>
  checkAdminAuth: () => boolean
}

// Mock admin credentials (in real app, this would be in a secure database)
const ADMIN_CREDENTIALS = {
  email: "admin@aivision.com",
  password: "Admin123!",
  name: "System Administrator",
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminName, setAdminName] = useState("")

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem("adminAuthenticated")
    const adminEmailStored = localStorage.getItem("adminEmail")
    const adminNameStored = localStorage.getItem("adminName")

    if (adminAuth === "true" && adminEmailStored && adminNameStored) {
      setIsAdminAuthenticated(true)
      setAdminEmail(adminEmailStored)
      setAdminName(adminNameStored)
    }
  }, [])

  const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get current admin password (might have been changed)
    const currentPassword = localStorage.getItem("adminPassword") || ADMIN_CREDENTIALS.password

    if (email === ADMIN_CREDENTIALS.email && password === currentPassword) {
      setIsAdminAuthenticated(true)
      setAdminEmail(email)
      setAdminName(ADMIN_CREDENTIALS.name)

      // Store in localStorage
      localStorage.setItem("adminAuthenticated", "true")
      localStorage.setItem("adminEmail", email)
      localStorage.setItem("adminName", ADMIN_CREDENTIALS.name)
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", ADMIN_CREDENTIALS.name)

      return { success: true, message: "Admin login successful" }
    } else {
      // Specific error messages
      if (email !== ADMIN_CREDENTIALS.email) {
        return { success: false, message: "Invalid admin email address" }
      } else {
        return { success: false, message: "Incorrect admin password" }
      }
    }
  }

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false)
    setAdminEmail("")
    setAdminName("")

    // Clear localStorage
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminEmail")
    localStorage.removeItem("adminName")
    localStorage.removeItem("userRole")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
  }

  const changeAdminPassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get current stored password
    const storedPassword = localStorage.getItem("adminPassword") || ADMIN_CREDENTIALS.password

    if (currentPassword !== storedPassword) {
      return { success: false, message: "Current password is incorrect" }
    }

    // Validate new password
    if (newPassword.length < 8) {
      return { success: false, message: "New password must be at least 8 characters long" }
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
      return {
        success: false,
        message: "Password must contain uppercase, lowercase, number, and special character",
      }
    }

    if (newPassword === currentPassword) {
      return { success: false, message: "New password must be different from current password" }
    }

    // Store new password
    localStorage.setItem("adminPassword", newPassword)

    return { success: true, message: "Admin password changed successfully" }
  }

  const checkAdminAuth = (): boolean => {
    return isAdminAuthenticated && localStorage.getItem("adminAuthenticated") === "true"
  }

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminEmail,
        adminName,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        checkAdminAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
