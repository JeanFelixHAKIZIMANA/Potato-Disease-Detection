"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, User, LogOut, Loader2, CheckCircle, AlertCircle, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"
import { AdminNav } from "@/components/admin-nav"

interface AnalysisResult {
  confidence: number
  category: string
  description: string
  recommendations: string[]
}

export default function DashboardPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [userName, setUserName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/login")
      return
    }

    // Get user info
    const name = localStorage.getItem("userName") || localStorage.getItem("userEmail") || "User"
    setUserName(name)
  }, [router])

  // After the existing useEffect, add this new useEffect to check user role
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    // Get user role
    const role = localStorage.getItem("userRole") || "user"
    setUserRole(role)
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setAnalysisResult(null)
    }
    reader.readAsDataURL(file)
  }
}


  const handleAnalyze = async () => {
  if (!selectedFile) return;

  setIsAnalyzing(true);

  const formData = new FormData();
  formData.append("file", selectedFile); // ✅ Send real File object

  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Prediction failed");
    }

    const result = await response.json();

    const formattedResult: AnalysisResult = {
      confidence: result.confidence,
      category: result.class,
      description: result.description || "No description provided.",
      recommendations: result.recommendations || [],
    };

    setAnalysisResult(formattedResult);
  } catch (error) {
    console.error("Error analyzing image:", error);
    alert("An error occurred while analyzing the image.");
  } finally {
    setIsAnalyzing(false);
  }
};



  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  const resetAnalysis = () => {
  setSelectedImage(null)
  setSelectedFile(null)
  setAnalysisResult(null)
  if (fileInputRef.current) fileInputRef.current.value = ""
  if (cameraInputRef.current) cameraInputRef.current.value = ""
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">Welcome back!</h1>
              {userRole === "admin" && (
                <Badge variant="secondary" className="text-xs">
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{userName}</p>
          </div>
        </div>
        {/* In the header section, update the navigation buttons to include admin access: */}
        <div className="flex items-center space-x-2">
          {userRole === "admin" && <AdminNav onLogout={handleLogout} />}
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              {t("profile")}
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Community
            </Button>
          </Link>
          <LanguageToggle />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </div>

      {/* Image Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Image Analysis</CardTitle>
          <CardDescription>Upload or capture an image for AI-powered analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedImage ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-32 flex-col space-y-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8" />
                <span>Upload Image</span>
              </Button>
              <Button
                variant="outline"
                className="h-32 flex-col space-y-2"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="w-8 h-8" />
                <span>Take Photo</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative max-w-full overflow-hidden rounded-lg bg-gray-100 border p-2">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected image"
                  width={400} // You can adjust this width to fit your layout
                  height={400}
                  className="rounded-lg object-contain mx-auto"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Image"
                  )}
                </Button>
                <Button variant="outline" onClick={resetAnalysis}>
                  Reset
                </Button>
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Analysis Complete</span>
              </CardTitle>
              <Badge variant="secondary">{analysisResult.confidence}% confidence</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{analysisResult.category}</h3>
              <p className="text-muted-foreground">{analysisResult.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <span>Recommendations</span>
            </CardTitle>
            <CardDescription>Based on our analysis, here are some suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResult.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm flex-1">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
