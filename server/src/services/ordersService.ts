import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { orders, orderItems } from "../db/schema.js";

export interface OrderItemInput {
  cakeName: string;
  weight: number;
  unitPrice: number;
  finalPrice: number;
  cakeId?: number | null;
}

export interface OrderInput {
  customerName: string;
  phone: string;
  deliveryType: "delivery" | "pickup";
  pickupPlace?: string | null;
  address?: string | null;
  deliveryDate: string;
  deliveryTime: string;
  totalPrice: number;
  deliveryMultiplier?: number;
  status?: "new" | "confirmed" | "completed" | "cancelled";
  source?: string;
  items: OrderItemInput[];
}

export async function getAllOrders() {
  const allOrders = await db.select().from(orders);
  if (allOrders.length === 0) return [];

  const ids = allOrders.map((o) => o.id);
  const allItems = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, ids[0]));

  return allOrders.map((order) => ({
    ...order,
    items: allItems.filter((item) => item.orderId === order.id),
  }));
}

export async function getOrderById(id: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return null;

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));

  return { ...order, items };
}

export async function createOrder(data: OrderInput) {
  const { items, ...orderData } = data;

  return db.transaction(async (tx) => {
    const [result] = await tx.insert(orders).values({
      customerName: orderData.customerName,
      phone: orderData.phone,
      deliveryType: orderData.deliveryType,
      pickupPlace: orderData.pickupPlace ?? null,
      address: orderData.address ?? null,
      deliveryDate: orderData.deliveryDate,
      deliveryTime: orderData.deliveryTime,
      totalPrice: orderData.totalPrice,
      deliveryMultiplier: orderData.deliveryMultiplier ?? 1,
      status: orderData.status ?? "new",
      source: orderData.source ?? "mobile",
    });

    const orderId = Number(result.insertId);

    if (items && items.length > 0) {
      await tx.insert(orderItems).values(
        items.map((item) => ({
          orderId,
          cakeName: item.cakeName,
          weight: item.weight,
          unitPrice: item.unitPrice,
          finalPrice: item.finalPrice,
          cakeId: item.cakeId ?? null,
        })),
      );
    }

    return getOrderById(orderId);
  });
}

export async function updateOrder(id: number, data: Partial<OrderInput>) {
  const { items, ...orderData } = data;

  return db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({
        customerName: orderData.customerName,
        phone: orderData.phone,
        deliveryType: orderData.deliveryType,
        pickupPlace: orderData.pickupPlace,
        address: orderData.address,
        deliveryDate: orderData.deliveryDate,
        deliveryTime: orderData.deliveryTime,
        totalPrice: orderData.totalPrice,
        deliveryMultiplier: orderData.deliveryMultiplier,
        status: orderData.status,
        source: orderData.source,
      })
      .where(eq(orders.id, id));

    if (items) {
      await tx.delete(orderItems).where(eq(orderItems.orderId, id));
      if (items.length > 0) {
        await tx.insert(orderItems).values(
          items.map((item) => ({
            orderId: id,
            cakeName: item.cakeName,
            weight: item.weight,
            unitPrice: item.unitPrice,
            finalPrice: item.finalPrice,
            cakeId: item.cakeId ?? null,
          })),
        );
      }
    }

    return getOrderById(id);
  });
}

export async function deleteOrder(id: number) {
  await db.delete(orders).where(eq(orders.id, id));
}
