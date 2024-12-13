// src/config/db.js

const mongoose = require("mongoose");
const logger = require("../utils/logger");

// **MongoDB Connection**
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { connectMongoDB };
