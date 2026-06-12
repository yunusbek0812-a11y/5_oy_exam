const Category = require("../model/category.model");
const CustomErrorHandler = require("../error/error");
const logger = require("../utils/logger");

// GET all categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// GET single category
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw CustomErrorHandler.notFound("Kategoriya topilmadi");
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// CREATE category (admin only)
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const image = req.file ? `/uploads/images/${req.file.filename}` : null;

    const existing = await Category.findOne({ name: name.toUpperCase() });
    if (existing) throw CustomErrorHandler.alreadyExists("Bu kategoriya allaqachon mavjud");

    const category = await Category.create({ name, image });
    logger.info(`Kategoriya yaratildi: ${name}`);
    res.status(201).json({ message: "Kategoriya yaratildi", category });
  } catch (error) {
    next(error);
  }
};

// UPDATE category (admin only)
const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const updateData = {};
    if (name) updateData.name = name.toUpperCase();
    if (req.file) updateData.image = `/uploads/images/${req.file.filename}`;

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!category) throw CustomErrorHandler.notFound("Kategoriya topilmadi");

    res.status(200).json({ message: "Kategoriya yangilandi", category });
  } catch (error) {
    next(error);
  } 
};

// DELETE category (admin only)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw CustomErrorHandler.notFound("Kategoriya topilmadi");

    logger.info(`Kategoriya o'chirildi: ${category.name}`);
    res.status(200).json({ message: "Kategoriya o'chirildi" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
