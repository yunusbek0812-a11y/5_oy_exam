const { Router } = require("express");
const {
  getCars, getCarsByCategory, getCar, createCar, updateCar, deleteCar,
} = require("../controller/car.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const upload = require("../config/multer");

const carRouter = Router();

// Public
carRouter.get("/cars", getCars);
carRouter.get("/cars/category/:categoryId", getCarsByCategory);
carRouter.get("/cars/:id", getCar);

// Admin only
carRouter.post(
  "/cars",
  authMiddleware, adminMiddleware,
  upload.fields([
    { name: "imageInterior", maxCount: 1 },
    { name: "imageExterior", maxCount: 1 },
    { name: "modelImage", maxCount: 1 },
  ]),
  createCar
);
carRouter.put(
  "/cars/:id",
  authMiddleware, adminMiddleware,
  upload.fields([
    { name: "imageInterior", maxCount: 1 },
    { name: "imageExterior", maxCount: 1 },
    { name: "modelImage", maxCount: 1 },
  ]),
  updateCar
);
carRouter.delete("/cars/:id", authMiddleware, adminMiddleware, deleteCar);

module.exports = carRouter;
