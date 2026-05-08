import { body, param } from "express-validator";
import { transactionCategories } from "../constants/transactionCategories.js";

export const createTransactionValidator = [
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Transaction type must be income or expense"),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),

  body("category")
    .isIn(transactionCategories)
    .withMessage("Category must be a valid transaction category"),

  body("note")
    .optional()
    .isString()
    .isLength({ max: 180 })
    .withMessage("Note must be 180 characters or less"),

  body("transactionDate")
    .isISO8601()
    .withMessage("Transaction date must be a valid ISO 8601 date"),
];

export const updateTransactionValidator = [
  param("id")
    .isMongoId()
    .withMessage("Transaction id must be a valid Mongo id"),

  body("type")
    .isIn(["income", "expense"])
    .withMessage("Transaction type must be income or expense"),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),

  body("category")
    .isIn(transactionCategories)
    .withMessage("Category must be a valid transaction category"),

  body("note")
    .optional()
    .isString()
    .isLength({ max: 180 })
    .withMessage("Note must be 180 characters or less"),

  body("transactionDate")
    .isISO8601()
    .withMessage("Transaction date must be a valid ISO 8601 date"),
];

export const deleteTransactionValidator = [
  param("id")
    .isMongoId()
    .withMessage("Transaction id must be a valid Mongo id"),
];

