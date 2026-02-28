import { NextResponse } from "next/server"
import { appConfig } from "@/lib/config/app.config"
import { getMongoDb } from "@/lib/db/mongodb"

export async function GET() {
  try {
    const db = await getMongoDb()
    if (!db) {
      return NextResponse.json({
        success: false,
        connected: false,
        dbName: appConfig.mongoDbName,
        message: "MongoDB not configured or unavailable. Using in-memory fallback.",
      })
    }

    const collections = await db.listCollections().toArray()
    return NextResponse.json({
      success: true,
      connected: true,
      dbName: db.databaseName,
      collections: collections.map((c) => c.name),
    })
  } catch (error) {
    console.error("[FraudSense] DB status route error:", error)
    return NextResponse.json(
      {
        success: false,
        connected: false,
        dbName: appConfig.mongoDbName,
        message: "MongoDB connection failed",
      },
      { status: 500 }
    )
  }
}
