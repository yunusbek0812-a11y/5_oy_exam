require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const connectDB = require("./config/db.config");

const authRouter = require("./router/auth.router");
const categoryRouter = require("./router/category.router");
const carRouter = require("./router/car.router");

const errorMiddleware = require("./middleware/error.middleware");
const logger = require("./utils/logger");

const app = express();

/* CAR PORT */
const PORT = process.env.PORT || 4001;

/* Swagger */
const swaggerDocument = YAML.load(path.join(__dirname, "./docs/swagger.yml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(cookieParser());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* DB */
connectDB();

/* Routes */
app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", carRouter);


app.use(errorMiddleware);


/* Server */
app.listen(PORT, () => {
  logger.info(` Car API: http://localhost:${PORT}`);
  logger.info(` Swagger: http://localhost:${PORT}/api-docs`);
});