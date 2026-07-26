import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { db } from "../db/index.js";
import { users, userRoles, roles, rolePermissions, permissions } from "../db/schema.js";
import { eq, inArray } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export interface JwtPayload {
  userId: number;
  login: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & {
    roles?: string[];
    permissions?: string[];
  };
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Токен не предоставлен" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch (err) {
    res.status(403).json({ error: "Недействительный или просроченный токен" });
  }
}

export async function loadUserRolesAndPermissions(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Не авторизован" });
    return;
  }

  try {
    const userRolesData = await db
      .select({ roleName: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, req.user.userId));

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

    req.user.roles = roleNames;
    req.user.permissions = permissionNames;
    next();
  } catch (err) {
    console.error("Ошибка загрузки ролей/пермишенов:", err);
    res.status(500).json({ error: "Ошибка сервера при загрузке прав доступа" });
  }
}

export function requirePermission(...requiredPermissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userPerms = req.user?.permissions || [];
    const hasPermission = requiredPermissions.every((p) => userPerms.includes(p));

    if (!hasPermission) {
      res.status(403).json({ error: "Недостаточно прав" });
      return;
    }

    next();
  };
}
