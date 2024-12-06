//src/app.js

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const errorRoutes = require("./routes/errorRoutes");
const rowErrorRoutes = require("./routes/rowErrorRoutes");

const { connectMongoDB } = require("./config/db");

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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(limiter);
app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/errors", errorRoutes);
app.use("/rowErrors", rowErrorRoutes);

// src/app.js (Updated to include DB initialization)

(async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize application:", error.message);
    process.exit(1); // Exit on failure
  }
})();

module.exports = app;
