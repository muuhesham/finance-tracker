import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import { createTransactionValidator, updateTransactionValidator, deleteTransactionValidator } from "../validators/transaction-validator.js";

export function createTransactionRoutes(transactionController) {
  const router = Router();

  router.use(auth);
  router.get("/", transactionController.listRecent);
  router.post("/", createTransactionValidator, validateRequest, transactionController.create);
  router.put("/:id", updateTransactionValidator, validateRequest, transactionController.update);
  router.delete("/:id", deleteTransactionValidator, validateRequest, transactionController.remove);

  return router;
}
