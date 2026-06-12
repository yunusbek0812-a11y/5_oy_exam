const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username bo'sh bo'lmasligi kerak",
    "string.min": "Username kamida 3 ta belgi bo'lishi kerak",
    "any.required": "Username majburiy",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email noto'g'ri formatda",
    "any.required": "Email majburiy",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Parol kamida 6 ta belgi bo'lishi kerak",
    "any.required": "Parol majburiy",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email noto'g'ri formatda",
    "any.required": "Email majburiy",
  }),
  password: Joi.string().required().messages({
    "any.required": "Parol majburiy",
  }),
});

const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required().messages({
    "string.length": "Kod 6 ta raqamdan iborat bo'lishi kerak",
    "any.required": "Tasdiqlash kodi majburiy",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email majburiy",
  }),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Yangi parol kamida 6 ta belgi bo'lishi kerak",
  }),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Eski parol majburiy",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Yangi parol kamida 6 ta belgi bo'lishi kerak",
  }),
});

const categorySchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "any.required": "Kategoriya nomi majburiy",
  }),
});

const carSchema = Joi.object({
  category: Joi.string().required().messages({
    "any.required": "Kategoriya ID majburiy",
  }),
  name: Joi.string().required().messages({
    "any.required": "Model nomi majburiy",
  }),
  tanirovkasi: Joi.string().allow("").default("Yo'q"),
  motor: Joi.string().required().messages({
    "any.required": "Motor majburiy",
  }),
  year: Joi.number().min(1900).max(2100).required().messages({
    "any.required": "Yil majburiy",
  }),
  color: Joi.string().required().messages({
    "any.required": "Rang majburiy",
  }),
  distance: Joi.number().min(0).required().messages({
    "any.required": "Masofa majburiy",
  }),
  gearbox: Joi.string()
    .valid("Avtomat karobka", "Mexanik karobka", "Robotizatsiya")
    .required()
    .messages({
      "any.only": "Uzatmalar qutisi noto'g'ri qiymat",
      "any.required": "Uzatmalar qutisi majburiy",
    }),
  price: Joi.number().min(0).required().messages({
    "any.required": "Narx majburiy",
  }),
  description: Joi.string().allow("").default(""),
});

module.exports = {
  registerSchema,
  loginSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  categorySchema,
  carSchema,
};
