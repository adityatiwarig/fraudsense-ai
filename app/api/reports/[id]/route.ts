import { NextResponse } from "next/server"
import { getReportById, updateReportStatus } from "@/lib/services/report.service"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const requestedStatus = body?.status

    if (requestedStatus !== "Active" && requestedStatus !== "Resolved") {
      return NextResponse.json(
        { error: "Invalid status. Use Active or Resolved." },
        { status: 400 }
      )
    }

    const existing = await getReportById(id)
    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    const updated = await updateReportStatus(id, requestedStatus)
    return NextResponse.json({ success: true, report: updated })
  } catch (error) {
    console.error("[FraudSense] Report status update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
