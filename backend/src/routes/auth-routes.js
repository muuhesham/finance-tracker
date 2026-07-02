import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { loginValidator, registerValidator, googleAuthValidator } from "../validators/auth-validator.js";
import { validateRequest } from "../middleware/validation.js";

export function createAuthRoutes(authController) {
  const router = Router();

  router.post("/register", registerValidator, validateRequest, authController.register);
  router.post("/login", loginValidator, validateRequest, authController.login);
  router.post("/google/url", authController.getGoogleAuthUrl);
  router.post("/google/callback", googleAuthValidator, validateRequest, authController.handleGoogleCallback);
  router.get("/profile", auth, authController.profile);

  return router;
}
