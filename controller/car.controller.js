const Car = require("../model/car.model");
const Category = require("../model/category.model");
const CustomErrorHandler = require("../error/error");
const logger = require("../utils/logger");

// GET all cars 
const getCars = async (req, res, next) => {
  try {
    const { page = 1, limit = 6, category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const total = await Car.countDocuments(filter);
    const cars = await Car.find(filter)
      .populate("category", "name image")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      cars,
    });
  } catch (error) {
    next(error);
  }
};

// GET cars by 
const getCarsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const cars = await Car.find({ category: categoryId })
      .populate("category", "name image")
      .sort({ createdAt: -1 });
    res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};

// GET single car
const getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate("category", "name image");
    if (!car) throw CustomErrorHandler.notFound("Mashina topilmadi");
    res.status(200).json(car);
  } catch (error) {
    next(error);
  }
};

// CREATE car (admin only)
const createCar = async (req, res, next) => {
  try {
    const {
      category, name, tanirovkasi, motor,
      year, color, distance, gearbox, price, description,
    } = req.body;

    const cat = await Category.findById(category);
    if (!cat) throw CustomErrorHandler.notFound("Kategoriya topilmadi");

    // Rasmlarni topish (field nomlari: imageInterior, imageExterior, modelImage)
    const files = req.files || {};
    const imageInterior = files.imageInterior?.[0]
      ? `/uploads/images/${files.imageInterior[0].filename}` : null;
    const imageExterior = files.imageExterior?.[0]
      ? `/uploads/images/${files.imageExterior[0].filename}` : null;
    const modelImage = files.modelImage?.[0]
      ? `/uploads/images/${files.modelImage[0].filename}` : null;

    const car = await Car.create({
      category, name, tanirovkasi, motor, year,
      color, distance, gearbox, price, description,
      imageInterior, imageExterior, modelImage,
    });

    await car.populate("category", "name image");
    logger.info(`Yangi mashina qo'shildi: ${name}`);
    res.status(201).json({ message: "Mashina qo'shildi", car });
  } catch (error) {
    next(error);
  }
};

// UPDATE car (admin only)
const updateCar = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    const files = req.files || {};

    if (files.imageInterior?.[0])
      updateData.imageInterior = `/uploads/images/${files.imageInterior[0].filename}`;
    if (files.imageExterior?.[0])
      updateData.imageExterior = `/uploads/images/${files.imageExterior[0].filename}`;
    if (files.modelImage?.[0])
      updateData.modelImage = `/uploads/images/${files.modelImage[0].filename}`;

    const car = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("category", "name image");
    if (!car) throw CustomErrorHandler.notFound("Mashina topilmadi");

    res.status(200).json({ message: "Mashina yangilandi", car });
  } catch (error) {
    next(error);
  }
};

// DELETE car (admin only)
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) throw CustomErrorHandler.notFound("Mashina topilmadi");

    logger.info(`Mashina o'chirildi: ${car.name}`);
    res.status(200).json({ message: "Mashina o'chirildi" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCars, getCarsByCategory, getCar, createCar, updateCar, deleteCar };
