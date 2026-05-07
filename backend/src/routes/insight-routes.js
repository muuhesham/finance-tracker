import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validateRequest } from "../validators/validation.js";
import { monthQueryValidator } from "../validators/month-validator.js";

export function createInsightRoutes(insightController) {
  const router = Router();

  router.use(authenticate);
  router.get(
    "/monthly",
    monthQueryValidator,
    validateRequest,
    insightController.monthly,
  );

  return router;
}
