"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Activity, TrendingUp, LogOut, MessageSquare, Settings, ArrowLeft, TestTube } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { LanguageToggle } from "@/components/language-toggle"
import { ReportGenerator } from "@/components/report-generator"
import { ReportTest } from "@/components/report-test"
import Link from "next/link"

interface LocationData {
  name: string
  users: number
  diseases: { name: string; count: number; severity: "low" | "medium" | "high" }[]
  coordinates: [number, number]
}

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0)
  const [locationData, setLocationData] = useState<LocationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTestSuite, setShowTestSuite] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const { checkAdminAuth, logoutAdmin, adminName } = useAdminAuth()

  useEffect(() => {
    // Check if user is admin
    if (!checkAdminAuth()) {
      router.push("/admin/login")
      return
    }

    // Simulate loading admin data
    setTimeout(() => {
      setTotalUsers(1247)
      setLocationData([
        {
          name: "New York",
          users: 324,
          diseases: [
            { name: "Skin Condition", count: 45, severity: "medium" },
            { name: "Eye Infection", count: 23, severity: "low" },
            { name: "Respiratory Issue", count: 12, severity: "high" },
            { name: "Allergic Reaction", count: 18, severity: "medium" },
            { name: "Dermatitis", count: 31, severity: "low" },
          ],
          coordinates: [40.7128, -74.006],
        },
        {
          name: "Los Angeles",
          users: 298,
          diseases: [
            { name: "Allergic Reaction", count: 67, severity: "medium" },
            { name: "Skin Rash", count: 34, severity: "low" },
            { name: "Fungal Infection", count: 19, severity: "medium" },
            { name: "Sun Damage", count: 28, severity: "high" },
            { name: "Acne", count: 42, severity: "low" },
          ],
          coordinates: [34.0522, -118.2437],
        },
        {
          name: "Chicago",
          users: 187,
          diseases: [
            { name: "Cold Symptoms", count: 89, severity: "low" },
            { name: "Skin Irritation", count: 45, severity: "medium" },
            { name: "Eye Strain", count: 23, severity: "low" },
            { name: "Respiratory Issue", count: 15, severity: "high" },
            { name: "Eczema", count: 27, severity: "medium" },
          ],
          coordinates: [41.8781, -87.6298],
        },
        {
          name: "Houston",
          users: 156,
          diseases: [
            { name: "Heat Rash", count: 78, severity: "medium" },
            { name: "Insect Bite", count: 56, severity: "low" },
            { name: "Sun Damage", count: 34, severity: "high" },
            { name: "Dehydration Signs", count: 21, severity: "medium" },
            { name: "Skin Condition", count: 39, severity: "low" },
          ],
          coordinates: [29.7604, -95.3698],
        },
        {
          name: "Phoenix",
          users: 142,
          diseases: [
            { name: "Sun Damage", count: 92, severity: "high" },
            { name: "Heat Rash", count: 67, severity: "medium" },
            { name: "Dehydration Signs", count: 45, severity: "medium" },
            { name: "Skin Condition", count: 33, severity: "low" },
            { name: "Eye Irritation", count: 28, severity: "low" },
          ],
          coordinates: [33.4484, -112.074],
        },
        {
          name: "Philadelphia",
          users: 98,
          diseases: [
            { name: "Allergic Reaction", count: 43, severity: "medium" },
            { name: "Respiratory Issue", count: 29, severity: "high" },
            { name: "Skin Irritation", count: 35, severity: "low" },
            { name: "Eye Infection", count: 18, severity: "medium" },
            { name: "Cold Symptoms", count: 52, severity: "low" },
          ],
          coordinates: [39.9526, -75.1652],
        },
      ])
      setIsLoading(false)
    }, 1500)
  }, [checkAdminAuth, router])

  const handleLogout = () => {
    logoutAdmin()
    router.push("/admin/login")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {adminName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTestSuite(!showTestSuite)}
            className={showTestSuite ? "bg-blue-100" : ""}
          >
            <TestTube className="w-4 h-4 mr-2" />
            {showTestSuite ? "Hide Tests" : "Test Suite"}
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
          <LanguageToggle />
          <Link href="/chat">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Community
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </div>

      {/* Test Suite (conditionally shown) */}
      {showTestSuite && (
        <div className="mb-6">
          <ReportTest />
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total {t("users")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active {t("locations")}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locationData.length}</div>
            <p className="text-xs text-muted-foreground">Across major cities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {locationData
                .reduce(
                  (sum, location) =>
                    sum + location.diseases.reduce((diseaseSum, disease) => diseaseSum + disease.count, 0),
                  0,
                )
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+23% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generator */}
      <div className="mb-6">
        <ReportGenerator totalUsers={totalUsers} locationData={locationData} />
      </div>

      {/* Quick Navigation */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <CardDescription>Access different parts of the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="h-20 flex-col space-y-2 w-full">
                <Users className="w-6 h-6" />
                <span className="text-sm">User Dashboard</span>
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="h-20 flex-col space-y-2 w-full">
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">Community</span>
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="h-20 flex-col space-y-2 w-full">
                <Settings className="w-6 h-6" />
                <span className="text-sm">Admin Settings</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Activity className="w-6 h-6" />
              <span className="text-sm">System Health</span>
            </Button>
            <Link href="/admin/users">
              <Button variant="outline" className="h-20 flex-col space-y-2 w-full">
                <Users className="w-6 h-6" />
                <span className="text-sm">User Management</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Location-based Disease Analytics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Disease Analytics by Location</span>
          </CardTitle>
          <CardDescription>Real-time disease detection patterns across different locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {locationData.map((location, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">{location.users} active users</p>
                  </div>
                  <Badge variant="outline">
                    {location.diseases.reduce((sum, disease) => sum + disease.count, 0)} cases
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {location.diseases.slice(0, 3).map((disease, diseaseIndex) => (
                    <div key={diseaseIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(disease.severity)}`}></div>
                        <div>
                          <p className="font-medium text-sm">{disease.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{disease.severity} severity</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{disease.count}</Badge>
                    </div>
                  ))}
                </div>
                {location.diseases.length > 3 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    +{location.diseases.length - 3} more diseases tracked
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage system settings and user data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/users">
              <Button variant="outline" className="h-20 flex-col space-y-2 w-full">
                <Users className="w-6 h-6" />
                <span className="text-sm">Manage Users</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MapPin className="w-6 h-6" />
              <span className="text-sm">View Map</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Activity className="w-6 h-6" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Link href="/admin/settings">
              <Button variant="outline" className="h-20 flex-col space-y-2 w-full">
                <Settings className="w-6 h-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
