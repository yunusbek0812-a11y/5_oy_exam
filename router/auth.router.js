const { Router } = require("express");
const {
  register, verifyEmail, login, logout,
  refreshToken, forgotPassword, resetPassword,
  changePassword, getMe,
} = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  registerSchema, loginSchema, verifySchema,
  forgotPasswordSchema, resetPasswordSchema, changePasswordSchema,
} = require("../schema/validation.schema");

const authRouter = Router();

// Public routes
authRouter.post("/auth/register", validate(registerSchema), register);
authRouter.post("/auth/verify", validate(verifySchema), verifyEmail);
authRouter.post("/auth/login", validate(loginSchema), login);
authRouter.post("/auth/logout", logout);
authRouter.post("/auth/refresh-token", refreshToken);
authRouter.post("/auth/forgot-password", validate(forgotPasswordSchema), forgotPassword);
authRouter.post("/auth/reset-password", validate(resetPasswordSchema), resetPassword);

// Protected routes
authRouter.post("/auth/change-password", authMiddleware, validate(changePasswordSchema), changePassword);
authRouter.get("/auth/me", authMiddleware, getMe);

module.exports = authRouter;
