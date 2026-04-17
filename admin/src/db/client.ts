import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT!),
});

export const db = drizzle(connection, { schema, mode: "default" });
