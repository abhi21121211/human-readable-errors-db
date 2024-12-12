// src/controllers/errorController.js

const ErrorModel = require("../models/Error");
const { indexError } = require("../services/searchService");

// Fetch all errors
async function getErrors(req, res) {
  try {
    const errors = await ErrorModel.find();
    res.status(200).json(errors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching errors", error: err.message });
  }
}

// Add a new error
async function addError(req, res) {
  try {
    const error = new ErrorModel(req.body);
    const savedError = await error.save();

    // Index in Elasticsearch
    await indexError(savedError.toObject());

    res.status(201).json(savedError);
  } catch (err) {
    res.status(500).json({ message: "Error adding error", error: err.message });
  }
}

// Fetch an error by ID
async function getErrorById(req, res) {
  try {
    const error = await ErrorModel.findById(req.params.id);
    if (!error) return res.status(404).json({ message: "Error not found" });

    res.status(200).json(error);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching error by ID", error: err.message });
  }
}

// Update an existing error
async function updateError(req, res) {
  try {
    const updatedError = await ErrorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedError)
      return res.status(404).json({ message: "Error not found" });

    // Update in Elasticsearch
    await indexError(updatedError.toObject());

    res.status(200).json(updatedError);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating error", error: err.message });
  }
}

// Delete an error
async function deleteError(req, res) {
  try {
    const deletedError = await ErrorModel.findByIdAndDelete(req.params.id);
    if (!deletedError)
      return res.status(404).json({ message: "Error not found" });

    res.status(200).json(deletedError);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting error", error: err.message });
  }
}

module.exports = {
  getErrors,
  addError,
  getErrorById,
  updateError,
  deleteError,
};
