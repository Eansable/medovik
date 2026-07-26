import "dotenv/config";
import express, { type Request, type Response } from "express";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import cakesRouter from "./routes/cakes.js";
import ordersRouter from "./routes/orders.js";
import { db } from "./db/index.js";
import { users } from "./db/schema.js";
import { eq } from "drizzle-orm";
import {
  authenticateToken,
  type AuthenticatedRequest,
} from "./middleware/auth.js";
import {
  buildUserResponse,
  getUserRolesAndPermissions,
} from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || "";

app.use(express.json());
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/cakes`, cakesRouter);
app.use(`${API_PREFIX}/orders`, ordersRouter);
app.use(`${API_PREFIX}/users`, usersRouter);

app.get(`${API_PREFIX}/`, (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get(
  `${API_PREFIX}/me`,
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const foundUsers = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user!.userId));
      const user = foundUsers[0];

      if (!user) {
        res.status(404).json({ error: "Пользователь не найден" });
        return;
      }

      const { roles: userRolesList, permissions: userPerms } =
        await getUserRolesAndPermissions(user.id);

      res.json({
        message: "Данные пользователя получены",
        user: buildUserResponse(user, userRolesList, userPerms),
      });
    } catch (err) {
      console.error("Ошибка при получении данных пользователя:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: "Ошибка сервера: " + message });
    }
  },
);

async function testConnection() {
  const connection = await db.$client.getConnection();
  try {
    await connection.ping();
    console.log("Подключение к БД успешно установлено");
  } finally {
    connection.release();
  }
}

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Не удалось подключиться к БД:", message);
    process.exit(1);
  }
});
