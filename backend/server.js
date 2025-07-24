const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = require("./src/app");
const { logger } = require("./src/utils/logger");

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // Listen on ALL interfaces

// Start server
app.listen(PORT, HOST, () => {
  logger.info(`🚀 Server running on ${HOST}:${PORT}`);
  logger.info(`📡 Local: http://localhost:${PORT}`);
  logger.info(`📡 Network: http://192.168.0.104:${PORT}`);
  logger.info(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`🔗 Test URL: http://192.168.0.104:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
