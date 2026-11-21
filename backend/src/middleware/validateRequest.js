import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  res.status(400).json({
    message: "Validation failed",
    errors: result.array().map((e) => ({ field: e.path, message: e.msg })),
  });
};