import { MongoClient, type Db } from "mongodb"
import { appConfig, maskMongoUri } from "@/lib/config/app.config"

declare global {
  // eslint-disable-next-line no-var
  var __fraudaiMongoClientPromise: Promise<MongoClient> | undefined
  // eslint-disable-next-line no-var
  var __fraudaiMongoConnectedLogged: boolean | undefined
  // eslint-disable-next-line no-var
  var __fraudaiMongoFallbackLogged: boolean | undefined
}

export async function getMongoDb(): Promise<Db | null> {
  const uri = appConfig.mongoUri
  if (!uri) {
    if (!global.__fraudaiMongoFallbackLogged) {
      console.warn("[FraudSense] MONGODB_URI not set. Using in-memory report storage.")
      global.__fraudaiMongoFallbackLogged = true
    }
    return null
  }

  try {
    if (!global.__fraudaiMongoClientPromise) {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 10000,
      })
      global.__fraudaiMongoClientPromise = client.connect()
    }

    const mongoClient = await global.__fraudaiMongoClientPromise
    const db = mongoClient.db(appConfig.mongoDbName)
    await db.command({ ping: 1 })

    if (!global.__fraudaiMongoConnectedLogged) {
      console.log(
        `[FraudSense] MongoDB connected successfully. URI: ${maskMongoUri(uri)} | DB: ${appConfig.mongoDbName}`
      )
      global.__fraudaiMongoConnectedLogged = true
    }

    return db
  } catch (error) {
    console.error("[FraudSense] MongoDB connection failed:", error)
    if (appConfig.mongoRequired) {
      throw error
    }
    return null
  }
}
