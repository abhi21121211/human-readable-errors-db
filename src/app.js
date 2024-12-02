//src/app.js

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const errorRoutes = require("./routes/errorRoutes");

dotenv.config();
const app = express();

// Swagger Documentation
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Advanced Errors Database API",
      version: "1.0.0",
      description: "API Documentation for Advanced Errors Database",
    },
  },
  apis: ["./src/routes/*.js"], // Documenting all routes
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
const corsOptions = {
  origin: ["https://your-frontend-domain.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// Middleware
app.use(bodyParser.json());
app.use(limiter);
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/errors", errorRoutes);

module.exports = app;
