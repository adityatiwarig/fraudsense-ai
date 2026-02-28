// Report service for managing fraud reports.
// Uses MongoDB when configured; falls back to in-memory storage.
import type { Db } from "mongodb"
import { getMongoDb } from "@/lib/db/mongodb"
import { appConfig } from "@/lib/config/app.config"

export interface FraudReport {
  id: string
  content: string
  score: number
  status: "Active" | "Resolved"
  confidence: "Low" | "Medium" | "High"
  category: string
  redFlags: string[]
  recommendations: string[]
  breakdown: {
    aiProbability: number
    keywordScore: number
    frequencyScore: number
    urlScore: number | null
  }
  createdAt: string
  userId?: string
}

type ReportStats = {
  total: number
  high: number
  medium: number
  low: number
  avgScore: number
}

const COLLECTION = "reports"

// In-memory fallback store
const reports: FraudReport[] = []
let mongoSetupDone = false

function makeReportId() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `FR-${ts}-${rand}`
}

function toReportDoc(data: Omit<FraudReport, "id" | "createdAt">): FraudReport {
  return {
    ...data,
    status: data.status || "Active",
    id: makeReportId(),
    createdAt: new Date().toISOString(),
  } satisfies FraudReport
}

function normalizeReport(input: FraudReport | (Omit<FraudReport, "status"> & { status?: "Active" | "Resolved" })): FraudReport {
  return {
    ...input,
    status: input.status || "Active",
  }
}

async function ensureMongoSetup(db: Db) {
  if (mongoSetupDone) return

  const collections = await db.listCollections({ name: COLLECTION }).toArray()
  if (collections.length === 0) {
    await db.createCollection(COLLECTION)
    console.log(`[FraudSense] MongoDB collection created: ${appConfig.mongoDbName}.${COLLECTION}`)
  }

  await db.collection(COLLECTION).createIndex({ id: 1 }, { unique: true })
  await db.collection(COLLECTION).createIndex({ createdAt: -1 })
  mongoSetupDone = true
}

export async function createReport(data: Omit<FraudReport, "id" | "createdAt">): Promise<FraudReport> {
  const db = await getMongoDb()
  if (db) {
    await ensureMongoSetup(db)
    const report = toReportDoc(data)
    await db.collection(COLLECTION).insertOne(report)
    return report
  }

  const report = toReportDoc(data)
  reports.unshift(report)
  return report
}

export async function getReports(limit = 20): Promise<FraudReport[]> {
  const db = await getMongoDb()
  if (db) {
    await ensureMongoSetup(db)
    const docs = await db
      .collection(COLLECTION)
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    const normalizedDocs = docs as unknown[]
    return normalizedDocs.filter(isFraudReport).map((doc) => normalizeReport(doc))
  }

  return reports.slice(0, limit)
}

export async function getReportById(id: string): Promise<FraudReport | undefined> {
  const db = await getMongoDb()
  if (db) {
    await ensureMongoSetup(db)
    const doc = await db.collection(COLLECTION).findOne({ id }, { projection: { _id: 0 } })
    if (!doc) return undefined
    return normalizeReport(doc as unknown as FraudReport)
  }

  return reports.find((r) => r.id === id)
}

export async function updateReportStatus(
  id: string,
  status: "Active" | "Resolved"
): Promise<FraudReport | undefined> {
  const db = await getMongoDb()
  if (db) {
    await ensureMongoSetup(db)
    const result = await db
      .collection(COLLECTION)
      .findOneAndUpdate(
        { id },
        { $set: { status } },
        { returnDocument: "after", projection: { _id: 0 } }
      )

    if (!result) return undefined
    return normalizeReport(result as unknown as FraudReport)
  }

  const target = reports.find((r) => r.id === id)
  if (!target) return undefined
  target.status = status
  return target
}

function computeStats(items: FraudReport[]): ReportStats {
  const total = items.length
  const high = items.filter((r) => r.score >= 70).length
  const medium = items.filter((r) => r.score >= 40 && r.score < 70).length
  const low = items.filter((r) => r.score < 40).length
  const avgScore = total > 0 ? Math.round(items.reduce((s, r) => s + r.score, 0) / total) : 0
  return { total, high, medium, low, avgScore }
}

export async function getReportStats(): Promise<ReportStats> {
  const db = await getMongoDb()
  if (db) {
    await ensureMongoSetup(db)
    const docs = await db.collection(COLLECTION).find({}, { projection: { _id: 0, score: 1 } }).toArray()
    const statsSource = docs.map((doc) => ({ score: Number(doc.score) || 0 })) as Array<{ score: number }>

    const total = statsSource.length
    const high = statsSource.filter((r) => r.score >= 70).length
    const medium = statsSource.filter((r) => r.score >= 40 && r.score < 70).length
    const low = statsSource.filter((r) => r.score < 40).length
    const avgScore = total > 0 ? Math.round(statsSource.reduce((s, r) => s + r.score, 0) / total) : 0
    return { total, high, medium, low, avgScore }
  }

  return computeStats(reports)
}
function isFraudReport(value: unknown): value is FraudReport {
  if (!value || typeof value !== "object") return false
  const item = value as Partial<FraudReport>
  return (
    typeof item.id === "string" &&
    typeof item.content === "string" &&
    typeof item.score === "number" &&
    (item.status == null || item.status === "Active" || item.status === "Resolved") &&
    typeof item.confidence === "string" &&
    typeof item.category === "string" &&
    Array.isArray(item.redFlags) &&
    Array.isArray(item.recommendations) &&
    typeof item.createdAt === "string"
  )
}
