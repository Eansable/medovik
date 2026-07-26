import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema.js";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "supermed_db",
  port: Number(process.env.DB_PORT) || 3306,
};

const pool = mysql.createPool(dbConfig);

export const db = drizzle(pool, { schema, mode: "default" });
