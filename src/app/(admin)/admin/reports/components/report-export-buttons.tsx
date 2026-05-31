"use client"

import { Download, FileSpreadsheet } from "lucide-react"

type ReportExportProps = {
  totalMembers: number
  totalFamilies: number
  males: number
  females: number
  membersByVatan: { kutchVatan: string | null; _count: number }[]
  membersByCity: { currentCity: string | null; _count: number }[]
}

export function ReportExportButtons(props: ReportExportProps) {
  const toCSV = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`

  const handleExportCensusCSV = async () => {
    // Fetch full families list for the census export
    const [famRes, memRes] = await Promise.all([
      fetch("/api/families?limit=1000"),
      fetch("/api/members?limit=1000"),
    ])
    const famData = await famRes.json()
    const memData = await memRes.json()

    const families: any[] = famData.data || []
    const members: any[] = memData.data || []

    // Build families sheet
    const famHeaders = ["Family ID", "Family Name", "Business Name", "Kutch Vatan", "Current City", "Business Address", "Notes", "Member Count"]
    const famRows = families.map(f => [
      f.familyId, f.familyName, f.businessName || "", f.kutchVatan || "",
      f.currentCity || "", f.businessAddress || "", f.notes || "",
      f._count?.members ?? "",
    ].map(toCSV).join(","))

    // Build members sheet
    const memHeaders = ["Member ID", "Full Name", "Gender", "Date of Birth", "Phone", "Email", "Blood Group", "Education", "Occupation", "Family Name", "Business Name", "City"]
    const memRows = members.map((m: any) => [
      m.memberId,
      m.fullName || `${m.firstName || ""} ${m.surname || ""}`.trim(),
      m.gender || "",
      m.dob ? new Date(m.dob).toLocaleDateString("en-IN") : "",
      m.phone || "",
      m.email || "",
      m.bloodGroup || "",
      m.education || "",
      m.occupationRole || "",
      m.familyDetails?.familyName || "",
      m.familyDetails?.businessName || "",
      m.familyDetails?.currentCity || "",
    ].map(toCSV).join(","))

    const csv = [
      "=== FAMILIES ===",
      famHeaders.map(toCSV).join(","),
      ...famRows,
      "",
      "=== MEMBERS ===",
      memHeaders.map(toCSV).join(","),
      ...memRows,
      "",
      "=== SUMMARY ===",
      `"Total Members","${props.totalMembers}"`,
      `"Total Families","${props.totalFamilies}"`,
      `"Male Members","${props.males}"`,
      `"Female Members","${props.females}"`,
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `skppmm-census-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handlePrintPDF}
        className="px-4 py-2 text-xs font-bold text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary border border-primary/20 rounded-xl transition-all flex items-center gap-2 shadow-sm"
      >
        <Download className="w-4 h-4" />
        Export PDF Census
      </button>
      <button
        onClick={handleExportCensusCSV}
        className="px-4 py-2 text-xs font-bold text-emerald-600 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 rounded-xl transition-all flex items-center gap-2 shadow-sm"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Export Excel Sheet
      </button>
    </div>
  )
}
