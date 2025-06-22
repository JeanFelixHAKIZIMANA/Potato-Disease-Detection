interface DiseaseData {
  name: string
  count: number
  severity: "low" | "medium" | "high"
}

interface LocationData {
  name: string
  users: number
  diseases: DiseaseData[]
  coordinates: [number, number]
}

interface ReportData {
  totalUsers: number
  totalAnalyses: number
  reportDate: Date
  locationData: LocationData[]
  overallStats: {
    totalDiseases: number
    severityBreakdown: {
      low: number
      medium: number
      high: number
    }
    topDiseases: Array<{ name: string; count: number }>
    topLocations: Array<{ name: string; count: number }>
  }
}

export function calculateOverallStats(locationData: LocationData[]) {
  const allDiseases: { [key: string]: { count: number; severities: string[] } } = {}
  const severityBreakdown = { low: 0, medium: 0, high: 0 }
  const locationStats: { [key: string]: number } = {}

  locationData.forEach((location) => {
    let locationTotal = 0
    location.diseases.forEach((disease) => {
      // Aggregate diseases
      if (!allDiseases[disease.name]) {
        allDiseases[disease.name] = { count: 0, severities: [] }
      }
      allDiseases[disease.name].count += disease.count
      allDiseases[disease.name].severities.push(disease.severity)

      // Count severity
      severityBreakdown[disease.severity] += disease.count
      locationTotal += disease.count
    })
    locationStats[location.name] = locationTotal
  })

  // Top diseases
  const topDiseases = Object.entries(allDiseases)
    .map(([name, data]) => ({ name, count: data.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Top locations
  const topLocations = Object.entries(locationStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const totalDiseases = Object.values(allDiseases).reduce((sum, disease) => sum + disease.count, 0)

  return {
    totalDiseases,
    severityBreakdown,
    topDiseases,
    topLocations,
  }
}

export function generateCSVReport(data: ReportData): string {
  const csvRows = []

  // Header
  csvRows.push("AI Vision - Disease Analysis Report")
  csvRows.push(`Generated on: ${data.reportDate.toLocaleDateString()}`)
  csvRows.push("")

  // Summary Statistics
  csvRows.push("SUMMARY STATISTICS")
  csvRows.push(`Total Users,${data.totalUsers}`)
  csvRows.push(`Total Analyses,${data.totalAnalyses}`)
  csvRows.push(`Total Disease Cases,${data.overallStats.totalDiseases}`)
  csvRows.push("")

  // Severity Breakdown
  csvRows.push("SEVERITY BREAKDOWN")
  csvRows.push("Severity Level,Count,Percentage")
  const total =
    data.overallStats.severityBreakdown.low +
    data.overallStats.severityBreakdown.medium +
    data.overallStats.severityBreakdown.high

  if (total > 0) {
    csvRows.push(
      `Low,${data.overallStats.severityBreakdown.low},${((data.overallStats.severityBreakdown.low / total) * 100).toFixed(1)}%`,
    )
    csvRows.push(
      `Medium,${data.overallStats.severityBreakdown.medium},${((data.overallStats.severityBreakdown.medium / total) * 100).toFixed(1)}%`,
    )
    csvRows.push(
      `High,${data.overallStats.severityBreakdown.high},${((data.overallStats.severityBreakdown.high / total) * 100).toFixed(1)}%`,
    )
  }
  csvRows.push("")

  // Top Diseases
  csvRows.push("TOP DISEASES")
  csvRows.push("Disease Name,Total Cases")
  data.overallStats.topDiseases.forEach((disease) => {
    csvRows.push(`"${disease.name}",${disease.count}`)
  })
  csvRows.push("")

  // Location-based Data
  csvRows.push("LOCATION-BASED ANALYSIS")
  csvRows.push("Location,Active Users,Total Cases,Disease Name,Cases,Severity")

  data.locationData.forEach((location) => {
    const totalCases = location.diseases.reduce((sum, disease) => sum + disease.count, 0)
    location.diseases.forEach((disease, index) => {
      if (index === 0) {
        csvRows.push(
          `"${location.name}",${location.users},${totalCases},"${disease.name}",${disease.count},${disease.severity}`,
        )
      } else {
        csvRows.push(`,,,"${disease.name}",${disease.count},${disease.severity}`)
      }
    })
  })

  return csvRows.join("\n")
}

export function generateJSONReport(data: ReportData): string {
  return JSON.stringify(data, null, 2)
}

export function downloadReport(content: string, filename: string, type: "csv" | "json") {
  try {
    const mimeType = type === "csv" ? "text/csv;charset=utf-8;" : "application/json;charset=utf-8;"
    const blob = new Blob([content], { type: mimeType })

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error("Error downloading report:", error)
    return false
  }
}

// Export types for use in components
export type { LocationData, ReportData, DiseaseData }
