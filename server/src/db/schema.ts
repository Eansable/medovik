import {
  int,
  mysqlTable,
  varchar,
  timestamp,
  double,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { sql, relations } from "drizzle-orm";

export const cakes = mysqlTable("cakes", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  image: varchar("image", { length: 500 }),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
});

export const cakePrices = mysqlTable("cake_prices", {
  id: int("id").primaryKey().autoincrement(),
  cakeId: int("cake_id")
    .notNull()
    .references(() => cakes.id, { onDelete: "cascade" }),
  weight: double("weight").notNull(),
  price: int("price").notNull(),
});

export const cakesRelations = relations(cakes, ({ many }) => ({
  prices: many(cakePrices),
}));

export const cakePricesRelations = relations(cakePrices, ({ one }) => ({
  cake: one(cakes, {
    fields: [cakePrices.cakeId],
    references: [cakes.id],
  }),
}));

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  login: varchar("login", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }).unique(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
});

export const roles = mysqlTable("roles", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const permissions = mysqlTable("permissions", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userRoles = mysqlTable(
  "user_roles",
  {
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: int("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.roleId] }),
  ],
);

export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    roleId: int("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: int("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const orderStatusEnum = ["new", "confirmed", "completed", "cancelled"] as const;

export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  deliveryType: varchar("delivery_type", { length: 20 }).notNull(),
  pickupPlace: varchar("pickup_place", { length: 255 }),
  address: varchar("address", { length: 500 }),
  deliveryDate: varchar("delivery_date", { length: 20 }).notNull(),
  deliveryTime: varchar("delivery_time", { length: 50 }).notNull(),
  totalPrice: double("total_price").notNull(),
  deliveryMultiplier: double("delivery_multiplier").notNull().default(1),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  source: varchar("source", { length: 50 }).default("mobile"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
});

export const orderItems = mysqlTable("order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  cakeName: varchar("cake_name", { length: 255 }).notNull(),
  weight: double("weight").notNull(),
  unitPrice: double("unit_price").notNull(),
  finalPrice: double("final_price").notNull(),
  cakeId: int("cake_id").references(() => cakes.id, { onDelete: "set null" }),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  cake: one(cakes, {
    fields: [orderItems.cakeId],
    references: [cakes.id],
  }),
}));
