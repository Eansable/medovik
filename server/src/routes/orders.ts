import { Router, type Request, type Response } from "express";
import * as ordersService from "../services/ordersService.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const allOrders = await ordersService.getAllOrders();
    res.json(allOrders);
  } catch (err) {
    console.error("Ошибка при получении заказов:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Некорректный ID" });
      return;
    }

    const order = await ordersService.getOrderById(id);
    if (!order) {
      res.status(404).json({ error: "Заказ не найден" });
      return;
    }

    res.json(order);
  } catch (err) {
    console.error("Ошибка при получении заказа:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phone,
      deliveryType,
      pickupPlace,
      address,
      deliveryDate,
      deliveryTime,
      totalPrice,
      deliveryMultiplier,
      status,
      source,
      items,
    } = req.body as ordersService.OrderInput;

    if (!customerName || !phone || !deliveryType || !deliveryDate || !deliveryTime || !items) {
      res.status(400).json({
        error:
          "Обязательны: customerName, phone, deliveryType, deliveryDate, deliveryTime, items",
      });
      return;
    }

    const newOrder = await ordersService.createOrder({
      customerName,
      phone,
      deliveryType,
      pickupPlace,
      address,
      deliveryDate,
      deliveryTime,
      totalPrice,
      deliveryMultiplier,
      status,
      source,
      items,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Ошибка при создании заказа:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Некорректный ID" });
      return;
    }

    const updatedOrder = await ordersService.updateOrder(id, req.body as Partial<ordersService.OrderInput>);

    if (!updatedOrder) {
      res.status(404).json({ error: "Заказ не найден" });
      return;
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Ошибка при обновлении заказа:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Некорректный ID" });
      return;
    }

    await ordersService.deleteOrder(id);
    res.status(204).send();
  } catch (err) {
    console.error("Ошибка при удалении заказа:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

export default router;
