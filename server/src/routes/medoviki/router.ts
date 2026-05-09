import { Router } from "express";
import {
  getAllMedoviki,
  getMedovikById,
  updateMedovik,
} from "./controller";

const router = Router();

router.get("/", getAllMedoviki);
router.get("/:id", getMedovikById);
router.patch("/:id", updateMedovik);

export default router;
