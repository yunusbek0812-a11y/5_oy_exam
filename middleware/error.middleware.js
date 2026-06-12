const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.message || "Server xatosi", { stack: err.stack });

  const status = err.status || 500;
  const message = err.message || "Server xatosi";

  res.status(status).json({ message });
};

module.exports = errorMiddleware;
