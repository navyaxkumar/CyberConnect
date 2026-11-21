
const EMAIL = /^\S+@\S+\.\S+$/;
const USERNAME = /^[a-zA-Z0-9_]+$/;

export function validateRegister({ username, email, password }) {
  const errors = {};

  const name = username.trim();
  if (name.length < 3 || name.length > 30) {
    errors.username = "Username must be 3-30 characters";
  } else if (!USERNAME.test(name)) {
    errors.username = "Username may only contain letters, numbers and underscores";
  }

  if (!EMAIL.test(email.trim())) errors.email = "Enter a valid email address";

  if (password.length < 8 || password.length > 72) {
    errors.password = "Password must be 8-72 characters";
  }

  return errors;
}

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  return errors;
}