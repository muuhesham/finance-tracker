import { query } from "express-validator";

export const monthQueryValidator = [
  query("month")
    .optional()
    .matches(/^\d{4}-\d{2}$/)
    .withMessage("Month must use YYYY-MM format"),
];
