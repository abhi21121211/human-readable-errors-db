// src/models/Error.js
const mongoose = require("mongoose");

const ErrorSchema = new mongoose.Schema({
  language: { type: String, required: true }, // Programming language
  framework: { type: String }, // Framework or library
  type: { type: String, required: true }, // Error type (e.g., Error, Warning)
  code: { type: String, required: true }, // Custom error code
  error: { type: String, required: true }, // Error message
  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  }, // Severity level
  description: { type: String, required: true }, // Description of the error
  cause: { type: [String], required: true }, // Possible causes
  solution: { type: [String], required: true }, // Recommended solutions
  tags: { type: [String] }, // Tags for categorization
  examples: [
    {
      code: { type: String, required: true }, // Example code
      output: { type: String, required: true }, // Example output
    },
  ],
  links: { type: [String] }, // Links to documentation or resources
  resources: {
    videos: { type: [String] }, // Video links
    tutorials: { type: [String] }, // Tutorials or guides
  },
  meta: {
    added_by: { type: String }, // Who added the error
    added_on: { type: Date, default: Date.now }, // When it was added
    updated_on: { type: Date, default: Date.now }, // Last update timestamp
  },
});
ErrorSchema.index({ _id: 1, language: 1 });

module.exports = mongoose.model("Error", ErrorSchema);
