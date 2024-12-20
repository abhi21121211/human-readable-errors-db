const mongoose = require("mongoose");

const RowErrorSchema = new mongoose.Schema(
  {
    rowError: {
      type: mongoose.Schema.Types.Mixed, // Allows storing unstructured data
    },
    errorDescription: {
      type: String,
    },
    errorData: {
      type: mongoose.Schema.Types.Mixed, // Allows storing unstructured data
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false } // Disables schema enforcement for unstructured data
);

module.exports = mongoose.model("RowError", RowErrorSchema);
