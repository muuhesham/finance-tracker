import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { loginValidator, registerValidator } from "../validators/auth-validator.js";
import { validateRequest } from "../middleware/validation.js";

export function createAuthRoutes(authController) {
  const router = Router();

  router.post("/register", registerValidator, validateRequest, authController.register);
  router.post("/login", loginValidator, validateRequest, authController.login);
  router.get("/profile", auth, authController.profile);

  return router;
}
