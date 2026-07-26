import { eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { cakes, cakePrices } from "../db/schema.js";

export interface CakePriceInput {
  weight: number;
  price: number;
}

export interface CakeInput {
  name?: string;
  image?: string;
  color?: string;
  prices?: CakePriceInput[];
}

export async function getAllCakes() {
  const allCakes = await db.select().from(cakes);
  if (allCakes.length === 0) return [];

  const ids = allCakes.map((c) => c.id);
  const allPrices = await db
    .select()
    .from(cakePrices)
    .where(inArray(cakePrices.cakeId, ids));

  return allCakes.map((cake) => ({
    ...cake,
    prices: allPrices.filter((p) => p.cakeId === cake.id),
  }));
}

export async function getCakeById(id: number) {
  const [cake] = await db.select().from(cakes).where(eq(cakes.id, id));
  if (!cake) return null;

  const prices = await db
    .select()
    .from(cakePrices)
    .where(eq(cakePrices.cakeId, id));

  return { ...cake, prices };
}

export async function createCake(data: CakeInput) {
  const { prices, ...cakeData } = data;

  return db.transaction(async (tx) => {
    const [result] = await tx.insert(cakes).values({
      name: cakeData.name!,
      image: cakeData.image,
      color: cakeData.color,
    });

    const cakeId = result.insertId;

    if (prices && prices.length > 0) {
      await tx.insert(cakePrices).values(
        prices.map((p) => ({
          cakeId,
          weight: p.weight,
          price: p.price,
        })),
      );
    }

    return getCakeById(cakeId);
  });
}

export async function updateCake(id: number, data: CakeInput) {
  const { prices, ...cakeData } = data;

  return db.transaction(async (tx) => {
    await tx
      .update(cakes)
      .set({
        name: cakeData.name,
        image: cakeData.image,
        color: cakeData.color,
      })
      .where(eq(cakes.id, id));

    if (prices) {
      await tx.delete(cakePrices).where(eq(cakePrices.cakeId, id));
      if (prices.length > 0) {
        await tx.insert(cakePrices).values(
          prices.map((p) => ({
            cakeId: id,
            weight: p.weight,
            price: p.price,
          })),
        );
      }
    }

    return getCakeById(id);
  });
}

export async function deleteCake(id: number) {
  await db.delete(cakes).where(eq(cakes.id, id));
}
