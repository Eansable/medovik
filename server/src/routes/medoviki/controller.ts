import { Request, Response } from "express";
import { getAll, getById, updateById } from "../../data/medoviki";

export function getAllMedoviki(req: Request, res: Response): void {
  res.json(getAll());
}

export function getMedovikById(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const medovik = getById(id);
  if (!medovik) {
    res.status(404).json({ error: "Medovik not found" });
    return;
  }
  res.json(medovik);
}

export function updateMedovik(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const updated = updateById(id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Medovik not found" });
    return;
  }
  res.json(updated);
}
