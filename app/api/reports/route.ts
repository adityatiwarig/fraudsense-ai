import { NextResponse } from "next/server"
import { getReports, getReportStats } from "@/lib/services/report.service"

export async function GET() {
  try {
    const reports = await getReports(20)
    const stats = await getReportStats()

    return NextResponse.json({
      success: true,
      reports,
      stats,
    })
  } catch (error) {
    console.error("[FraudSense] Reports API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
