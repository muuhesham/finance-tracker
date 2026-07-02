import { body, query } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 60 })
    .notEmpty()
    .escape()
    .stripLow()
    .withMessage("Name must be between 2 and 60 characters"),

  body("email")
    .isEmail()
    .toLowerCase()
    .notEmpty()
    .escape()
    .stripLow()
    .withMessage("A valid email is required"),

  body("password")
    .optional()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .toLowerCase()
    .notEmpty()
    .escape()
    .stripLow()
    .withMessage("A valid email is required"),

  body("password")
    .isLength({ min: 8, max: 128 })
    .notEmpty()
    .withMessage("Password must be between 8 and 128 characters"),
];

export const googleAuthValidator = [
  body("code")
    .notEmpty()
    .withMessage("Authorization code is required"),
];
