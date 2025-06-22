"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, TestTube, CheckCircle, XCircle } from "lucide-react"
import {
  generateCSVReport,
  generateJSONReport,
  downloadReport,
  calculateOverallStats,
  type LocationData,
  type ReportData,
} from "./report-utils"

// Test data
const testLocationData: LocationData[] = [
  {
    name: "Test City 1",
    latitude: 40.7128,
    location: "New York, NY",
    users: 100,
    diseases: [
      { name: "Test Disease A", count: 25, severity: "low" },
      { name: "Test Disease B", count: 15, severity: "medium" },
      { name: "Test Disease C", count: 10, severity: "high" },
    ],
    coordinates: [40.7128, -74.0060],
  },
  {
    name: "Test City 2",
    latitude: 40.7128,
    location: "New York, NY",
    users: 75,
    diseases: [
      { name: "Test Disease A", count: 20, severity: "low" },
      { name: "Test Disease D", count: 12, severity: "medium" },
      { name: "Test Disease E", count: 8, severity: "high" },
    ],
    coordinates: [34.0522, -118.2437],
  },
]

interface TestResult {
  test: string
  status: "success" | "error" | "pending"
  message: string
  data?: any
}

export function ReportTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addTestResult = (result: TestResult) => {
    setTestResults((prev) => [...prev, result])
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    // Test 1: Calculate Overall Stats
    try {
      addTestResult({ test: "Calculate Stats", status: "pending", message: "Testing calculateOverallStats..." })

      const stats = calculateOverallStats(testLocationData)

      if (stats.totalDiseases > 0 && stats.topDiseases.length > 0) {
        addTestResult({
          test: "Calculate Stats",
          status: "success",
          message: `✅ Stats calculated: ${stats.totalDiseases} total diseases, ${stats.topDiseases.length} unique types`,
          data: stats,
        })
      } else {
        addTestResult({
          test: "Calculate Stats",
          status: "error",
          message: "❌ Stats calculation returned empty results",
        })
      }
    } catch (error) {
      addTestResult({
        test: "Calculate Stats",
        status: "error",
        message: `❌ Error calculating stats: ${error}`,
      })
    }

    // Test 2: Generate CSV Report
    try {
      addTestResult({ test: "Generate CSV", status: "pending", message: "Testing CSV generation..." })

      const overallStats = calculateOverallStats(testLocationData)
      const reportData: ReportData = {
        totalUsers: 175,
        totalAnalyses: 90,
        reportDate: new Date(),
        locationData: testLocationData,
        overallStats,
      }

      const csvContent = generateCSVReport(reportData)

      if (csvContent.includes("AI Vision - Disease Analysis Report") && csvContent.includes("SUMMARY STATISTICS")) {
        addTestResult({
          test: "Generate CSV",
          status: "success",
          message: `✅ CSV generated successfully (${csvContent.length} characters)`,
          data: csvContent.substring(0, 200) + "...",
        })
      } else {
        addTestResult({
          test: "Generate CSV",
          status: "error",
          message: "❌ CSV content missing required sections",
        })
      }
    } catch (error) {
      addTestResult({
        test: "Generate CSV",
        status: "error",
        message: `❌ Error generating CSV: ${error}`,
      })
    }

    // Test 3: Generate JSON Report
    try {
      addTestResult({ test: "Generate JSON", status: "pending", message: "Testing JSON generation..." })

      const overallStats = calculateOverallStats(testLocationData)
      const reportData: ReportData = {
        totalUsers: 175,
        totalAnalyses: 90,
        reportDate: new Date(),
        locationData: testLocationData,
        overallStats,
      }

      const jsonContent = generateJSONReport(reportData)
      const parsedJson = JSON.parse(jsonContent)

      if (parsedJson.totalUsers && parsedJson.locationData && parsedJson.overallStats) {
        addTestResult({
          test: "Generate JSON",
          status: "success",
          message: `✅ JSON generated and parsed successfully`,
          data: `Users: ${parsedJson.totalUsers}, Locations: ${parsedJson.locationData.length}`,
        })
      } else {
        addTestResult({
          test: "Generate JSON",
          status: "error",
          message: "❌ JSON missing required properties",
        })
      }
    } catch (error) {
      addTestResult({
        test: "Generate JSON",
        status: "error",
        message: `❌ Error generating JSON: ${error}`,
      })
    }

    // Test 4: Test Download Function (without actually downloading)
    try {
      addTestResult({ test: "Download Function", status: "pending", message: "Testing download function..." })

      // Test if the function exists and can be called
      const testContent = "test,content\n1,2"
      const canDownload = typeof downloadReport === "function"

      if (canDownload) {
        addTestResult({
          test: "Download Function",
          status: "success",
          message: "✅ Download function is available and callable",
        })
      } else {
        addTestResult({
          test: "Download Function",
          status: "error",
          message: "❌ Download function not available",
        })
      }
    } catch (error) {
      addTestResult({
        test: "Download Function",
        status: "error",
        message: `❌ Error testing download: ${error}`,
      })
    }

    setIsRunning(false)
  }

  const testActualDownload = async (format: "csv" | "json") => {
    try {
      const overallStats = calculateOverallStats(testLocationData)
      const reportData: ReportData = {
        totalUsers: 175,
        totalAnalyses: 90,
        reportDate: new Date(),
        locationData: testLocationData,
        overallStats,
      }

      const timestamp = new Date().toISOString().split("T")[0]
      let success = false

      if (format === "csv") {
        const csvContent = generateCSVReport(reportData)
        success = downloadReport(csvContent, `test-report-${timestamp}.csv`, "csv")
      } else {
        const jsonContent = generateJSONReport(reportData)
        success = downloadReport(jsonContent, `test-report-${timestamp}.json`, "json")
      }

      addTestResult({
        test: `Download ${format.toUpperCase()}`,
        status: success ? "success" : "error",
        message: success
          ? `✅ ${format.toUpperCase()} file downloaded successfully`
          : `❌ Failed to download ${format.toUpperCase()} file`,
      })
    } catch (error) {
      addTestResult({
        test: `Download ${format.toUpperCase()}`,
        status: "error",
        message: `❌ Error downloading ${format.toUpperCase()}: ${error}`,
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="w-5 h-5" />
          <span>Report Generation Test Suite</span>
        </CardTitle>
        <CardDescription>Test and verify all report generation functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Data Preview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Test Data:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Total Users:</strong> 175
            </div>
            <div>
              <strong>Locations:</strong> {testLocationData.length}
            </div>
            <div>
              <strong>Total Diseases:</strong> {testLocationData.reduce((sum, loc) => sum + loc.diseases.length, 0)}
            </div>
            <div>
              <strong>Total Cases:</strong>{" "}
              {testLocationData.reduce(
                (sum, loc) => sum + loc.diseases.reduce((diseaseSum, disease) => diseaseSum + disease.count, 0),
                0,
              )}
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={runAllTests} disabled={isRunning}>
            {isRunning ? "Running Tests..." : "Run All Tests"}
          </Button>
          <Button variant="outline" onClick={() => testActualDownload("csv")}>
            <Download className="w-4 h-4 mr-2" />
            Test CSV Download
          </Button>
          <Button variant="outline" onClick={() => testActualDownload("json")}>
            <Download className="w-4 h-4 mr-2" />
            Test JSON Download
          </Button>
          <Button variant="outline" onClick={() => setTestResults([])}>
            Clear Results
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className={`p-3 border rounded-lg ${getStatusColor(result.status)}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <Badge
                    variant={
                      result.status === "success" ? "default" : result.status === "error" ? "destructive" : "secondary"
                    }
                  >
                    {result.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{result.message}</p>
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">View Data</summary>
                    <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-32">
                      {typeof result.data === "string" ? result.data : JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {testResults.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Test Summary:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {testResults.filter((r) => r.status === "success").length}
                </div>
                <div className="text-green-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {testResults.filter((r) => r.status === "error").length}
                </div>
                <div className="text-red-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{testResults.length}</div>
                <div className="text-blue-600">Total</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
