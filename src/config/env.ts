import dotenv from "dotenv";

dotenv.config();

const jwtRefreshExpiresDays = Number(process.env.JWT_REFRESH_EXPIRES_DAYS)

export const config = {
    port: process.env.PORT || 5000,
    dbHost: process.env.DB_HOST || "localhost",
    dbPort: Number(process.env.DB_PORT) || 3306,
    dbUser: process.env.DB_USER || "root",
    dbPassword: process.env.DB_PASSWORD || "",
    dbName: process.env.DB_NAME || "ecommerce_db",
    jwtSecret: process.env.JWT_SECRET || "supersecret",
    jwtExpiresIn: process.env.JST_EXPIRES_IN || "1d",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "supersecret_access",
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "supersecret_refresh",
    jwtRefreshExpiresIn: `${jwtRefreshExpiresDays}d`,
    jwtRefreshExpiresDays,
    nodeEnv: process.env.NODE_ENV || "development",
    appwriteEndpoint: process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
    appwriteProjectId: process.env.APPWRITE_PROJECT_ID || "",
    appwriteApiKey: process.env.APPWRITE_API_KEY || "",
    appwriteBucketId: process.env.APPWRITE_BUCKET_ID || "",

}