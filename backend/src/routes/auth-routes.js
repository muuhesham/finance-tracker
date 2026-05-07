import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth-validator.js";
import { validateRequest } from "../validators/validation.js";

export function createAuthRoutes(authController) {
  const router = Router();

  router.post(
    "/register",
    registerValidator,
    validateRequest,
    authController.register,
  );
  router.post("/login", loginValidator, validateRequest, authController.login);
  router.get("/profile", authenticate, authController.profile);

  return router;
}
