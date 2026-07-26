import { Router, type Request, type Response } from "express";
import { db } from "../db/index.js";
import { users, permissions, roles, rolePermissions } from "../db/schema.js";
import { eq, inArray } from "drizzle-orm";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    try {
      const allUsers = await db
        .select({
          id: users.id,
          login: users.login,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users);

      res.json(allUsers);
    } catch (err) {
      console.error("Ошибка при получении пользователей:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ error: "Ошибка сервера: " + message });
    }
  },
);

router.post("/permissions", async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "Поле name обязательно и должно быть строкой" });
      return;
    }

    const result = await db.insert(permissions).values({
      name,
      description: description ?? null,
    });

    res.status(201).json({ id: Number(result[0].insertId), name, description });
  } catch (err) {
    console.error("Ошибка при создании пермишена:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.get("/permissions", async (_req: Request, res: Response) => {
  try {
    const allPermissions = await db.select().from(permissions);
    res.json(allPermissions);
  } catch (err) {
    console.error("Ошибка при получении пермишенов:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.get("/roles/:roleId", async (req: Request, res: Response) => {
  try {
    const roleId = Number(req.params.roleId);

    if (Number.isNaN(roleId)) {
      res.status(400).json({ error: "roleId должен быть числом" });
      return;
    }

    const roleRows = await db
      .select({
        id: roles.id,
        name: roles.name,
        description: roles.description,
        createdAt: roles.createdAt,
      })
      .from(roles)
      .where(eq(roles.id, roleId))
      .limit(1);

    if (roleRows.length === 0) {
      res.status(404).json({ error: "Роль не найдена" });
      return;
    }

    const role = roleRows[0];

    const rolePermissionRows = await db
      .select({
        id: permissions.id,
        name: permissions.name,
        description: permissions.description,
        createdAt: permissions.createdAt,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    res.json({
      ...role,
      permissions: rolePermissionRows,
    });
  } catch (err) {
    console.error("Ошибка при получении роли:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.get("/roles", async (_req: Request, res: Response) => {
  try {
    const allRoles = await db.select().from(roles);
    res.json(allRoles);
  } catch (err) {
    console.error("Ошибка при получении ролей:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.post("/roles", async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "Поле name обязательно и должно быть строкой" });
      return;
    }

    const result = await db.insert(roles).values({
      name,
      description: description ?? null,
    });

    res.status(201).json({ id: Number(result[0].insertId), name, description });
  } catch (err) {
    console.error("Ошибка при создании роли:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.post("/roles/:roleId/permissions", async (req: Request, res: Response) => {
  try {
    const roleId = Number(req.params.roleId);
    const { permissionIds } = req.body;

    if (Number.isNaN(roleId)) {
      res.status(400).json({ error: "roleId должен быть числом" });
      return;
    }

    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      res.status(400).json({ error: "permissionIds должен быть непустым массивом" });
      return;
    }

    const validPermissionIds = permissionIds
      .map((id: unknown) => Number(id))
      .filter((id) => !Number.isNaN(id));

    if (validPermissionIds.length === 0) {
      res.status(400).json({ error: "permissionIds должен содержать хотя бы один валидный id" });
      return;
    }

    const existingRole = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
    if (existingRole.length === 0) {
      res.status(404).json({ error: "Роль не найдена" });
      return;
    }

    const existingPermissions = await db
      .select({ id: permissions.id })
      .from(permissions)
      .where(inArray(permissions.id, validPermissionIds));

    const existingPermissionIds = existingPermissions.map((p) => p.id);
    if (existingPermissionIds.length === 0) {
      res.status(404).json({ error: "Ни один из указанных пермишенов не найден" });
      return;
    }

    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

    const values = existingPermissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await db.insert(rolePermissions).values(values);

    res.status(200).json({ roleId, permissionIds: existingPermissionIds });
  } catch (err) {
    console.error("Ошибка при установке пермишенов для роли:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

export default router;
