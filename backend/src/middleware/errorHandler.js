export const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

   export const errorHandler = (err, req, res, next) => {
     const status = err.status || 500;
     if (status >= 500) console.error(err);
     res.status(status).json({
       message: status >= 500 ? "Internal server error" : status === 400 ? "Invalid request" : err.message,
     });
   };