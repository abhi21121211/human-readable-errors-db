// src/models/Error.js

const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema({
  code: { type: String, required: true },
  output: { type: String, required: true },
});

const errorSchema = new mongoose.Schema({
  language: { type: String, required: true },
  framework: { type: String },
  type: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  error: { type: String, required: true },
  severity: { type: String },
  description: { type: String },
  cause: [String],
  solution: [String],
  tags: [String],
  examples: [exampleSchema],
  resources: {
    videos: [String],
    tutorials: [String],
  },
  links: [String],
});

module.exports = mongoose.model("Error", errorSchema);
