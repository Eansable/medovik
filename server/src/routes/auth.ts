import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users, userRoles, roles, rolePermissions, permissions } from "../db/schema.js";
import { eq, inArray } from "drizzle-orm";
import { authenticateToken, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES_IN = "7d";

interface UserTokenData {
  id: number;
  login: string;
}

function generateToken(user: UserTokenData): string {
  return jwt.sign(
    { userId: user.id, login: user.login },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

export async function getUserRolesAndPermissions(userId: number): Promise<{ roles: string[]; permissions: string[] }> {
  const userRolesData = await db
    .select({ roleName: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  const roleNames = userRolesData.map((ur) => ur.roleName);

  let permissionNames: string[] = [];
  if (roleNames.length > 0) {
    const roleRecords = await db
      .select({ id: roles.id })
      .from(roles)
      .where(inArray(roles.name, roleNames));

    const roleIds = roleRecords.map((r) => r.id);

    if (roleIds.length > 0) {
      const permsData = await db
        .select({ permissionName: permissions.name })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(inArray(rolePermissions.roleId, roleIds));

      permissionNames = [...new Set(permsData.map((p) => p.permissionName))];
    }
  }

  return { roles: roleNames, permissions: permissionNames };
}

interface RegisterBody {
  login?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roles?: number[];
}

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { login, email, password, firstName, lastName, phone, roles: requestedRoles } = req.body as RegisterBody;

    if (!login || !password) {
      res.status(400).json({ error: "Логин и пароль обязательны" });
      return;
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.login, login));
    if (existingUser.length > 0) {
      res.status(409).json({ error: "Пользователь с таким логином уже существует" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      login,
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
    });

    const userId = Number(newUser.insertId);

    if (requestedRoles && requestedRoles.length > 0) {
      const foundRoles = await db
        .select({ id: roles.id })
        .from(roles)
        .where(inArray(roles.id, requestedRoles));

      if (foundRoles.length > 0) {
        await db.insert(userRoles).values(
          foundRoles.map((role) => ({
            userId,
            roleId: role.id,
          }))
        );
      }
    } else {
      const customerRole = await db
        .select()
        .from(roles)
        .where(eq(roles.name, "customer"))
        .limit(1);

      if (customerRole.length > 0) {
        await db.insert(userRoles).values({
          userId,
          roleId: customerRole[0].id,
        });
      }
    }

    const { roles: userRolesList, permissions: userPerms } = await getUserRolesAndPermissions(userId);

    const token = generateToken({ id: userId, login });

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      token,
      user: {
        id: userId,
        login,
        email,
        firstName,
        lastName,
        phone,
        roles: userRolesList,
        permissions: userPerms,
      },
    });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

interface LoginBody {
  login?: string;
  password?: string;
}

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body as LoginBody;

    if (!login || !password) {
      res.status(400).json({ error: "Логин и пароль обязательны" });
      return;
    }

    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.login, login));
    const user = foundUsers[0];

    if (!user) {
      res.status(401).json({ error: "Неверный логин или пароль" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Неверный логин или пароль" });
      return;
    }

    const { roles: userRolesList, permissions: userPerms } = await getUserRolesAndPermissions(user.id);

    const token = generateToken(user);

    res.json({
      message: "Вход выполнен успешно",
      token,
      user: buildUserResponse(user, userRolesList, userPerms),
    });
  } catch (err) {
    console.error("Ошибка при входе:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

export function buildUserResponse(
  user: typeof users.$inferSelect,
  userRolesList: string[] = [],
  userPerms: string[] = [],
) {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    roles: userRolesList,
    permissions: userPerms,
  };
}

interface ChangePasswordBody {
  currentPassword?: string;
  newPassword?: string;
}

router.patch("/password", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body as ChangePasswordBody;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Текущий и новый пароль обязательны" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "Новый пароль должен содержать минимум 6 символов" });
      return;
    }

    const foundUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user!.userId));
    const user = foundUsers[0];

    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      res.status(403).json({ error: "Неверный текущий пароль" });
      return;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, user.id));

    const token = generateToken(user);

    res.json({
      message: "Пароль успешно изменён",
      token,
    });
  } catch (err) {
    console.error("Ошибка при смене пароля:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.get("/refresh", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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

    const { roles: userRolesList, permissions: userPerms } = await getUserRolesAndPermissions(user.id);

    const token = generateToken(user);

    res.json({
      message: "Данные пользователя обновлены",
      token,
      user: buildUserResponse(user, userRolesList, userPerms),
    });
  } catch (err) {
    console.error("Ошибка при обновлении данных пользователя:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

export default router;
