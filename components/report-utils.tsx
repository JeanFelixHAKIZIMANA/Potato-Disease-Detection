export type Disease = {
  name: string
  count: number
  severity: "low" | "medium" | "high"
}

export type LocationData = {
  name: string
  latitude: number
  users: number
  location: string
  diseases: Disease[]
  coordinates: {
    latitude: number    
    longitude: number
  }
}

export type ReportData = {
  totalUsers: number
  totalAnalyses: number
  reportDate: Date
  locationData: LocationData[]
  overallStats: ReturnType<typeof calculateOverallStats>
}

export function calculateOverallStats(locationData: LocationData[]) {
  const severityBreakdown = { low: 0, medium: 0, high: 0 }
  const diseaseCountMap = new Map<string, number>()

  let totalDiseases = 0

  for (const loc of locationData) {
    for (const disease of loc.diseases) {
      totalDiseases += disease.count
      severityBreakdown[disease.severity] += disease.count
      diseaseCountMap.set(
        disease.name,
        (diseaseCountMap.get(disease.name) || 0) + disease.count
      )
    }
  }

  const topDiseases = Array.from(diseaseCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  return {
    totalDiseases,
    severityBreakdown,
    topDiseases,
  }
}

export function generateCSVReport(data: ReportData) {
  const lines = [
    "Location,Disease,Count,Severity",
    ...data.locationData.flatMap((loc) =>
      loc.diseases.map(
        (d) => `${loc.location},${d.name},${d.count},${d.severity}`
      )
    ),
  ]
  return lines.join("\n")
}

export function generateJSONReport(data: ReportData) {
  return JSON.stringify(data, null, 2)
}

export function downloadReport(content: string, filename: string, type: "csv" | "json") {
  try {
    const blob = new Blob([content], {
      type: type === "csv" ? "text/csv" : "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
    return true
  } catch (e) {
    console.error("Download failed", e)
    return false
  }
}
export function formatDate(date: Date) {
  return date.toISOString().split("T")[0] // YYYY-MM-DD format
}