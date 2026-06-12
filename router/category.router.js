const { Router } = require("express");
const {
  getCategories, getCategory, createCategory, updateCategory, deleteCategory,
} = require("../controller/category.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const upload = require("../config/multer");

const categoryRouter = Router();

// Public
categoryRouter.get("/categories", getCategories);
categoryRouter.get("/categories/:id", getCategory);

// Admin only
categoryRouter.post(
  "/categories",
  authMiddleware, adminMiddleware,
  upload.single("image"),
  createCategory
);
categoryRouter.put(
  "/categories/:id",
  authMiddleware, adminMiddleware,
  upload.single("image"),
  updateCategory
);
categoryRouter.delete(
  "/categories/:id",
  authMiddleware, adminMiddleware,
  deleteCategory
);

module.exports = categoryRouter;
