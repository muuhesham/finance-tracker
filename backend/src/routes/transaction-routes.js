import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { param } from "express-validator";
import { validateRequest } from "../validators/validation.js";
import { transactionValidator } from "../validators/transaction-validator.js";

export function createTransactionRoutes(transactionController) {
  const router = Router();

  router.use(authenticate);
  router.get("/", transactionController.listRecent);
  router.post(
    "/",
    transactionValidator,
    validateRequest,
    transactionController.create,
  );
  router.put(
    "/:id",
    [
      param("id")
        .isMongoId()
        .withMessage("Transaction id must be a valid Mongo id"),
      ...transactionValidator,
    ],
    validateRequest,
    transactionController.update,
  );
  router.delete(
    "/:id",
    [
      param("id")
        .isMongoId()
        .withMessage("Transaction id must be a valid Mongo id"),
    ],
    validateRequest,
    transactionController.remove,
  );

  return router;
}
