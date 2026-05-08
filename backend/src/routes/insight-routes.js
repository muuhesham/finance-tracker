import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import { monthQueryValidator } from "../validators/dashboard-validator.js";

export function createInsightRoutes(insightController) {
  const router = Router();

  router.get("/monthly", auth, monthQueryValidator, validateRequest, insightController.monthly);

  return router;
}
