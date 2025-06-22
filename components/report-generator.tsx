"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download, FileText, BarChart3, Calendar, MapPin, Activity, Loader2 } from "lucide-react"
import {
  generateCSVReport,
  generateJSONReport,
  downloadReport,
  calculateOverallStats,
  type LocationData,
  type ReportData,
} from "./report-utils"

interface ReportGeneratorProps {
  totalUsers: number
  locationData: LocationData[]
}

export function ReportGenerator({ totalUsers, locationData }: ReportGeneratorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [reportFormat, setReportFormat] = useState<"csv" | "json">("csv")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    try {
      // Simulate report generation delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const overallStats = calculateOverallStats(locationData)
      const totalAnalyses = locationData.reduce(
        (sum, location) => sum + location.diseases.reduce((diseaseSum, disease) => diseaseSum + disease.count, 0),
        0,
      )

      const reportData: ReportData = {
        totalUsers,
        totalAnalyses,
        reportDate: new Date(),
        locationData,
        overallStats,
      }

      const timestamp = new Date().toISOString().split("T")[0]
      let success = false

      if (reportFormat === "csv") {
        const csvContent = generateCSVReport(reportData)
        success = downloadReport(csvContent, `disease-analysis-report-${timestamp}.csv`, "csv")
      } else {
        const jsonContent = generateJSONReport(reportData)
        success = downloadReport(jsonContent, `disease-analysis-report-${timestamp}.json`, "json")
      }

      if (success) {
        console.log("Report generated successfully")
      } else {
        alert("Error generating report. Please try again.")
      }
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Error generating report. Please try again.")
    } finally {
      setIsGenerating(false)
      setIsDialogOpen(false)
    }
  }

  const overallStats = calculateOverallStats(locationData)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Disease Analysis Reports</span>
        </CardTitle>
        <CardDescription>Generate comprehensive reports on disease patterns and statistics</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Report Preview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-blue-600">{overallStats.totalDiseases}</div>
            <div className="text-xs text-blue-600">Total Cases</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-600">{overallStats.topDiseases.length}</div>
            <div className="text-xs text-green-600">Disease Types</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-purple-600">{locationData.length}</div>
            <div className="text-xs text-purple-600">Locations</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-orange-600">{new Date().toLocaleDateString()}</div>
            <div className="text-xs text-orange-600">Report Date</div>
          </div>
        </div>

        {/* Severity Breakdown Preview */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Severity Distribution</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-green-800">Low Severity</div>
                <div className="text-xs text-green-600">
                  {overallStats.totalDiseases > 0
                    ? ((overallStats.severityBreakdown.low / overallStats.totalDiseases) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {overallStats.severityBreakdown.low}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-yellow-800">Medium Severity</div>
                <div className="text-xs text-yellow-600">
                  {overallStats.totalDiseases > 0
                    ? ((overallStats.severityBreakdown.medium / overallStats.totalDiseases) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {overallStats.severityBreakdown.medium}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-red-800">High Severity</div>
                <div className="text-xs text-red-600">
                  {overallStats.totalDiseases > 0
                    ? ((overallStats.severityBreakdown.high / overallStats.totalDiseases) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {overallStats.severityBreakdown.high}
              </Badge>
            </div>
          </div>
        </div>

        {/* Top Diseases Preview */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Top 5 Diseases</h4>
          <div className="space-y-2">
            {overallStats.topDiseases.slice(0, 5).map((disease, index) => (
              <div key={disease.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{disease.name}</span>
                </div>
                <Badge variant="outline">{disease.count} cases</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Report Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Disease Analysis Report</DialogTitle>
              <DialogDescription>
                Create a comprehensive report with consolidated disease statistics across all users and locations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="format">Report Format</Label>
                <Select value={reportFormat} onValueChange={(value: "csv" | "json") => setReportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
                    <SelectItem value="json">JSON (Data Format)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Report Contents:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Summary statistics (total users, analyses, cases)</li>
                  <li>• Disease severity breakdown with percentages</li>
                  <li>• Top diseases by frequency</li>
                  <li>• Location-based disease distribution</li>
                  <li>• Anonymized data (no personal information)</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Privacy Notice:</h4>
                <p className="text-sm text-green-800">
                  This report contains only aggregated, anonymized data. No personal user information or individual
                  analysis results are included.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isGenerating}>
                Cancel
              </Button>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
