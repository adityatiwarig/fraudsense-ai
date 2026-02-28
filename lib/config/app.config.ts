export const appConfig = {
  mongoUri: process.env.MONGODB_URI?.trim() || "",
  mongoDbName: process.env.MONGODB_DB_NAME?.trim() || "fraudsense",
  mongoRequired: process.env.MONGODB_REQUIRED === "true",
}

export function maskMongoUri(uri: string): string {
  if (!uri) return ""
  return uri.replace(/(mongodb\+srv:\/\/)([^:]+):([^@]+)@/i, "$1****:****@")
}
