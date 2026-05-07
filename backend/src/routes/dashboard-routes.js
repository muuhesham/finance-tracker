import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validateRequest } from "../validators/validation.js";
import { monthQueryValidator } from "../validators/month-validator.js";

export function createDashboardRoutes(dashboardController) {
  const router = Router();

  router.use(authenticate);
  router.get(
    "/summary",
    monthQueryValidator,
    validateRequest,
    dashboardController.summary,
  );

  return router;
}
