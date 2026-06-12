const User = require("../model/user.model");
const CustomErrorHandler = require("../error/error");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/token.utils");
const { sendVerificationEmail, sendForgotPasswordEmail } = require("../utils/mailer");
const logger = require("../utils/logger");


const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// REGISTER
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // ✅ DEBUG
    console.log("=== REGISTER DEBUG ===");
    console.log("Kelgan ma'lumot:", { username, email });

    const existing = await User.findOne({ $or: [{ username }, { email }] });

    // ✅ DEBUG
    console.log("Topilgan user:", existing);

    if (existing) {
      throw CustomErrorHandler.alreadyExists("Bu username yoki email allaqachon mavjud");
    }

    const code = generateCode();
    const expire = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      username,
      email,
      password,
      verifyCode: code,
      verifyCodeExpire: expire,
    });

    await sendVerificationEmail(email, code);
    logger.info(`Yangi foydalanuvchi ro'yxatdan o'tdi: ${email}`);

    res.status(201).json({
      message: "Ro'yxatdan o'tdingiz. Emailingizni tasdiqlang.",
      email,
    });
  } catch (error) {
    next(error);
  }
};

// VERIFY EMAIL
const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw CustomErrorHandler.notFound("Foydalanuvchi topilmadi");

    if (user.isVerified) {
      return res.status(400).json({ message: "Email allaqachon tasdiqlangan" });
    }

    if (user.verifyCode !== code || user.verifyCodeExpire < new Date()) {
      throw CustomErrorHandler.badRequest("Kod noto'g'ri yoki muddati tugagan");
    }

    user.isVerified = true;
    user.verifyCode = null;
    user.verifyCodeExpire = null;
    await user.save();

    logger.info(`Email tasdiqlandi: ${email}`);
    res.status(200).json({ message: "Email muvaffaqiyatli tasdiqlandi" });
  } catch (error) {
    next(error);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw CustomErrorHandler.notFound("Foydalanuvchi topilmadi");

    if (!user.isVerified) {
      throw CustomErrorHandler.unauthorized("Email tasdiqlanmagan. Iltimos emailingizni tasdiqlang.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw CustomErrorHandler.unauthorized("Parol noto'g'ri");

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(`Tizimga kirdi: ${email}`);
    res.status(200).json({
      message: "Tizimga muvaffaqiyatli kirdingiz",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
    }
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Tizimdan chiqildi" });
  } catch (error) {
    next(error);
  }
};

// REFRESH TOKEN
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw CustomErrorHandler.unauthorized("Refresh token topilmadi");

    const decoded = verifyRefreshToken(token);
    const user = await User.findOne({ _id: decoded.id, refreshToken: token });
    if (!user) throw CustomErrorHandler.unauthorized("Token yaroqsiz");

    const payload = { id: user._id, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(CustomErrorHandler.unauthorized("Refresh token noto'g'ri yoki muddati tugagan"));
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw CustomErrorHandler.notFound("Bu email bilan foydalanuvchi topilmadi");

    const code = generateCode();
    user.resetPasswordCode = code;
    user.resetPasswordCodeExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendForgotPasswordEmail(email, code);
    logger.info(`Parolni tiklash kodi yuborildi: ${email}`);

    res.status(200).json({ message: "Parolni tiklash kodi emailingizga yuborildi" });
  } catch (error) {
    next(error);
  }
};

// RESET PASSWORD
const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw CustomErrorHandler.notFound("Foydalanuvchi topilmadi");

    if (user.resetPasswordCode !== code || user.resetPasswordCodeExpire < new Date()) {
      throw CustomErrorHandler.badRequest("Kod noto'g'ri yoki muddati tugagan");
    }

    user.password = newPassword;
    user.resetPasswordCode = null;
    user.resetPasswordCodeExpire = null;
    await user.save();

    logger.info(`Parol tiklandi: ${email}`);
    res.status(200).json({ message: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (error) {
    next(error);
  }
};

// CHANGE PASSWORD (authenticated)
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw CustomErrorHandler.unauthorized("Eski parol noto'g'ri");

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (error) {
    next(error);
  }
};

// GET ME (profile)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password -refreshToken -verifyCode -resetPasswordCode");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};