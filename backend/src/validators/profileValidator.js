import { body, param } from "express-validator";

const usernameRules = (validator) => validator
  .isString().withMessage("Username must be a string")
  .bail()
  .trim()
  .isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters")
  .bail()
  .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username may only contain letters, numbers and underscores");

export const updateProfileRules = [
  body().custom((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Request body must be an object");
    }
    const keys = Object.keys(value);
    const unsupported = keys.filter((key) => !["username", "bio"].includes(key));
    if (unsupported.length) throw new Error("Only username and bio may be updated");
    if (!keys.length) throw new Error("Provide a username or bio to update");
    return true;
  }),
  usernameRules(body("username").optional({ values: "undefined" })),
  body("bio")
    .optional({ values: "undefined" })
    .isString().withMessage("Bio must be a string")
    .bail()
    .trim()
    .isLength({ max: 300 }).withMessage("Bio must be 300 characters or fewer"),
];

export const publicUsernameRules = [param("username", "Username").custom((value, { req }) => {
  req.params.username = value.trim();
  if (value.length < 3 || value.length > 30 || !/^[a-zA-Z0-9_]+$/.test(value)) {
    throw new Error("Username must be 3-30 characters and contain only letters, numbers and underscores");
  }
  return true;
})];
