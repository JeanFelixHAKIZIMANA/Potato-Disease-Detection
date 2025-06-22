"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  EyeOff,
  Loader2,
  Shield,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Key,
  User,
  Mail,
  Calendar,
} from "lucide-react"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [] as string[],
  })

  const router = useRouter()
  const { changeAdminPassword, checkAdminAuth, adminEmail, adminName, logoutAdmin } = useAdminAuth()

  useEffect(() => {
    // Check admin authentication
    if (!checkAdminAuth()) {
      router.push("/admin/login")
    }
  }, [checkAdminAuth, router])

  useEffect(() => {
    // Check password strength
    if (newPassword) {
      const strength = checkPasswordStrength(newPassword)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ score: 0, feedback: [] })
    }
  }, [newPassword])

  const checkPasswordStrength = (password: string) => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("At least 8 characters")
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Lowercase letter")
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Uppercase letter")
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("Number")
    }

    if (/[@$!%*?&]/.test(password)) {
      score += 1
    } else {
      feedback.push("Special character (@$!%*?&)")
    }

    return { score, feedback }
  }

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return "bg-red-500"
    if (score <= 3) return "bg-yellow-500"
    if (score <= 4) return "bg-blue-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return "Weak"
    if (score <= 3) return "Fair"
    if (score <= 4) return "Good"
    return "Strong"
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validation
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (passwordStrength.score < 4) {
      setMessage({ type: "error", text: "Password does not meet security requirements" })
      return
    }

    setIsLoading(true)

    try {
      const result = await changeAdminPassword(currentPassword, newPassword)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Clear form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")

        // Auto-hide success message after 5 seconds
        setTimeout(() => setMessage(null), 5000)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }))
  }

  const handleLogout = () => {
    logoutAdmin()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground">Manage your administrator account</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <LanguageToggle />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <Shield className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Admin Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Administrator Profile</span>
            </CardTitle>
            <CardDescription>Your administrator account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{adminName}</h3>
                    <Badge variant="default">System Administrator</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{adminEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Last login: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Key className="w-4 h-4" />
                    <span>Password last changed: {localStorage.getItem("adminPassword") ? "Recently" : "Default"}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Security Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">Two-Factor Auth:</span>
                    <Badge variant="outline" className="text-blue-700">
                      Recommended
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">Password Strength:</span>
                    <Badge variant="outline" className="text-blue-700">
                      {localStorage.getItem("adminPassword") ? "Custom" : "Default"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">Session Timeout:</span>
                    <Badge variant="outline" className="text-blue-700">
                      24 hours
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>Change Password</span>
            </CardTitle>
            <CardDescription>Update your administrator password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Message Alert */}
            {message && (
              <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-6">
                {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("current")}
                    disabled={isLoading}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("new")}
                    disabled={isLoading}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Password Strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.score <= 2
                            ? "text-red-600"
                            : passwordStrength.score <= 3
                              ? "text-yellow-600"
                              : passwordStrength.score <= 4
                                ? "text-blue-600"
                                : "text-green-600"
                        }`}
                      >
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <span>Missing: </span>
                        {passwordStrength.feedback.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("confirm")}
                    disabled={isLoading}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Password Requirements:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span>At least 8 characters long</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${/[a-z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span>Contains lowercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${/[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span>Contains uppercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${/\d/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span>Contains number</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${/[@$!%*?&]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span>Contains special character (@$!%*?&)</span>
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || passwordStrength.score < 4 || newPassword !== confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security Best Practices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Password Security:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use a unique password for admin access</li>
                  <li>• Change password regularly (every 90 days)</li>
                  <li>• Never share your admin credentials</li>
                  <li>• Use a password manager if possible</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Account Security:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Always logout when finished</li>
                  <li>• Don't access admin panel on public computers</li>
                  <li>• Monitor login attempts regularly</li>
                  <li>• Report suspicious activity immediately</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
