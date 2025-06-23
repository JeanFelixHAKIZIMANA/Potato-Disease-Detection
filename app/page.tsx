"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Zap, Shield, Smartphone } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            AI Vision
          </h1>
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            AI-Powered Image Analysis
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Upload or capture any image and get instant AI-powered analysis with personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Analyzing
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Camera className="w-10 h-10 text-indigo-600 mb-2" />
              <CardTitle>Easy Capture</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Upload from gallery or capture directly with your camera</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-cyan-600 mb-2" />
              <CardTitle>Instant Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get AI-powered analysis results in seconds</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>Smart Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Receive personalized recommendations based on analysis</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Smartphone className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Mobile First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Optimized for mobile devices with responsive design</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
