import { validationResult } from "express-validator";
import { AppError } from "../utils/errors.js";

export function validateRequest(request, _response, next) {
  const errors = validationResult(request);

  if (errors.isEmpty()) {
    return next();
  }

  const message = errors
    .array()
    .map((error) => `${error.param}: ${error.msg}`)
    .join(", ");

  next(new AppError(message, 400));
}
