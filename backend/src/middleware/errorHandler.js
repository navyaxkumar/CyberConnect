import mongoose from "mongoose";

export const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal server error";
  let details;

  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = "Invalid resource identifier";
  } else if (err.code === 11000) {
    status = 409;
    message = "Duplicate value for a unique field";
  } else if (status >= 500) {
    console.error(err);
  }

  const response = {
    message: status >= 500 ? "Internal server error" : message,
  };
  if (details) response.errors = details;

  res.status(status).json(response);
};