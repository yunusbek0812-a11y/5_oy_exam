const { verifyAccessToken } = require("../utils/token.utils");
const User = require("../model/user.model");
const CustomErrorHandler = require("../error/error");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(CustomErrorHandler.unauthorized("Token topilmadi"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(CustomErrorHandler.unauthorized("Foydalanuvchi topilmadi"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(CustomErrorHandler.unauthorized("Token noto'g'ri yoki muddati tugagan"));
  }
};

module.exports = authMiddleware;
