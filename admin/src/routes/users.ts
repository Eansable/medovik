import { Router } from "express";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const router = Router();

router.get("/", async (req, res) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({ name, email, password: hashedPassword })
    .execute();

  res.status(201).json({ id: newUser.insertId, name, email });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Неверный пароль" });
  }

  res.json({
    message: "Аутентификация успешна",
    user: { id: user.id, name: user.name, email: user.email },
  });
});

export default router;
