import { Router, type Request, type Response } from "express";
import * as cakesService from "../services/cakesService.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const allCakes = await cakesService.getAllCakes();
    res.json(allCakes);
  } catch (err) {
    console.error("Ошибка при запросе к БД:", err);
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

    const cake = await cakesService.getCakeById(id);
    if (!cake) {
      res.status(404).json({ error: "Торт не найден" });
      return;
    }

    res.json(cake);
  } catch (err) {
    console.error("Ошибка при получении торта:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, image, color, prices } = req.body as cakesService.CakeInput;
    const newCake = await cakesService.createCake({
      name,
      image,
      color,
      prices,
    });
    res.status(201).json(newCake);
  } catch (err) {
    console.error("Ошибка при создании торта:", err);
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

    const { name, image, color, prices } = req.body as cakesService.CakeInput;
    const updatedCake = await cakesService.updateCake(id, {
      name,
      image,
      color,
      prices,
    });

    if (!updatedCake) {
      res.status(404).json({ error: "Торт не найден" });
      return;
    }

    res.json(updatedCake);
  } catch (err) {
    console.error("Ошибка при обновлении торта:", err);
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

    await cakesService.deleteCake(id);
    res.status(204).send();
  } catch (err) {
    console.error("Ошибка при удалении торта:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Ошибка сервера: " + message });
  }
});

export default router;
