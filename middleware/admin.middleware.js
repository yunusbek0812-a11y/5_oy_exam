const CustomErrorHandler = require("../error/error");

const adminChecker = (req, res, next) => {
  if (!req.user) {
    return next(CustomErrorHandler.unauthorized("Avval tizimga kiring"));
  }
  if (req.user.role !== "admin") {
    return next(CustomErrorHandler.forbidden("Bu amal faqat admin uchun"));
  }
  next();
};

module.exports = adminChecker;
