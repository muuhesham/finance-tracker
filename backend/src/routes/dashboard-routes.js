import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import { monthQueryValidator } from "../validators/dashboard-validator.js";

export function createDashboardRoutes(dashboardController) {
  const router = Router();

  router.get("/summary", auth, monthQueryValidator, validateRequest, dashboardController.summary);

  return router;
}
