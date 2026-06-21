import express from "express";
import mysql from "mysql2/promise";

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: "localhost",
  user: "supermed_admin",
  password: "super_medovik",
  database: "supermed_db",
  port: 3306,
};

const pool = mysql.createPool(dbConfig);

async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    console.log("Подключение к БД успешно установлено");
  } finally {
    connection.release();
  }
}

app.get("/cakes", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM cakes");
    res.json(rows);
  } catch (err) {
    console.error("Ошибка при запросе к БД:", err);
    res.status(500).send("Ошибка сервера: " + err.message);
  }
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  } catch (err) {
    console.error("Не удалось подключиться к БД:", err.message);
    process.exit(1);
  }
});
