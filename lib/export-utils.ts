export interface ExportData {
  user: {
    login: string
    name: string
    bio: string
    followers: number
    public_repos: number
    created_at: string
  } | null
  repos: Array<{
    name: string
    description?: string
    stargazers_count: number
    forks_count: number
    language?: string
    pushed_at?: string
  }>
  exportedAt: string
}

// Export as JSON file
export function exportAsJSON(data: ExportData) {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `devmetrics-${data.user?.login || "export"}-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export as PDF (text-based report)
export async function exportAsPDF(data: ExportData) {
  // Dynamically import jspdf
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF()

  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Title
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("DevMetrics Report", pageWidth / 2, y, { align: "center" })
  y += 15

  // Subtitle
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100)
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: "center" })
  y += 20

  // User Profile Section
  if (data.user) {
    doc.setTextColor(0)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Profile Overview", 20, y)
    y += 10

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Username: @${data.user.login}`, 20, y)
    y += 7
    doc.text(`Name: ${data.user.name || "N/A"}`, 20, y)
    y += 7
    doc.text(`Bio: ${data.user.bio || "No bio provided"}`, 20, y)
    y += 7
    doc.text(`Followers: ${data.user.followers}`, 20, y)
    y += 7
    doc.text(`Public Repositories: ${data.user.public_repos}`, 20, y)
    y += 7
    doc.text(`Member Since: ${new Date(data.user.created_at).toLocaleDateString()}`, 20, y)
    y += 15
  }

  // Repository Statistics
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Repository Statistics", 20, y)
  y += 10

  const totalStars = data.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = data.repos.reduce((sum, repo) => sum + repo.forks_count, 0)
  const languages = [...new Set(data.repos.map((r) => r.language).filter(Boolean))]

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Total Repositories: ${data.repos.length}`, 20, y)
  y += 7
  doc.text(`Total Stars: ${totalStars}`, 20, y)
  y += 7
  doc.text(`Total Forks: ${totalForks}`, 20, y)
  y += 7
  doc.text(`Languages Used: ${languages.length}`, 20, y)
  y += 15

  // Top Repositories
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Top Repositories", 20, y)
  y += 10

  const topRepos = [...data.repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  topRepos.forEach((repo, index) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.text(`${index + 1}. ${repo.name} - ${repo.stargazers_count} stars, ${repo.forks_count} forks`, 20, y)
    y += 6
  })

  // Save PDF
  doc.save(`devmetrics-${data.user?.login || "export"}-${new Date().toISOString().split("T")[0]}.pdf`)
}

// Export charts as PNG (captures the dashboard element)
export async function exportAsPNG(elementId: string, filename: string) {
  const { toPng } = await import("html-to-image")
  const element = document.getElementById(elementId)

  if (!element) {
    throw new Error("Dashboard element not found")
  }

  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: "#0a0a0a",
  })

  const link = document.createElement("a")
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.png`
  link.href = dataUrl
  link.click()
}
