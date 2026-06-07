export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((fieldError) => fieldError.message)
      .join(", ");
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "Duplicate value entered";
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
