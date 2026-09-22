import mysql from "mysql2/promise";
import { config } from "./env"

export const pool = mysql.createPool({
    host: config.dbHost,
    port: config.dbPort,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})


// quick testt for database is connected or not

export const textConnection = async () => {
    try {
        const connection = await pool.getConnection();

        console.log("Database is connected suceessfully")
        connection.release()
    } catch (error) {
        console.error("MySQL connection failed:", error);
        process.exit(1);
    }
}