const mongoose = require("mongoose");

const RowErrorSchema = new mongoose.Schema(
  {
    errorData: {
      type: mongoose.Schema.Types.Mixed, // Allows storing unstructured data
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false } // Disables schema enforcement for unstructured data
);

module.exports = mongoose.model("RowError", RowErrorSchema);
