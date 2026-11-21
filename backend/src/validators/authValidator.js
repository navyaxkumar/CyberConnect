import { body } from "express-validator";

export const registerRules = [
  body("username")
    .isString().withMessage("Username is required")
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters")
    .bail()
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username may only contain letters, numbers and underscores"),
  body("email")
    .isString().withMessage("Email is required")
    .trim()
    .isEmail().withMessage("Enter a valid email address"),
  body("password")
    .isString().withMessage("Password is required")
    .isLength({ min: 8, max: 72 }).withMessage("Password must be 8-72 characters"),
];

export const loginRules = [
  body("email").isString().withMessage("Email is required").trim().notEmpty().withMessage("Email is required"),
  body("password").isString().withMessage("Password is required").notEmpty().withMessage("Password is required"),
];