require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db.config");
const authRouter = require("./router/auth.router");
const categoryRouter = require("./router/category.router");
const carRouter = require("./router/car.router");
const errorMiddleware = require("./middleware/error.middleware");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect DB
connectDB();

// Routes
app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", carRouter);



// Error handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`Server ishga tushdi:`+ PORT);
});
