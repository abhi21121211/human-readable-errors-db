// src/controllers/rowErrorController.js

const RowErrorModel = require("../models/RowError");

// Fetch all row errors
async function getRowErrors(req, res) {
  try {
    const rowErrors = await RowErrorModel.find();
    res.status(200).json(rowErrors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching row errors", error: err.message });
  }
}

// Add a new row error
async function addRowError(req, res) {
  try {
    const existingRowError = await RowErrorModel.findOne(req.body);
    if (existingRowError) {
      return res.status(400).json({ message: "Row error already exists" });
    }

    const rowError = new RowErrorModel(req.body);
    const savedRowError = await rowError.save();
    res.status(201).json(savedRowError);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding row error", error: err.message });
  }
}

// Add multiple row errors
async function addMultipleRowErrors(req, res) {
  try {
    const rowErrors = req.body; // Expecting an array of errors
    if (!Array.isArray(rowErrors)) {
      return res
        .status(400)
        .json({ message: "Invalid input: Expected an array of errors" });
    }

    const savedRowErrors = await RowErrorModel.insertMany(rowErrors);
    res.status(201).json(savedRowErrors);
  } catch (err) {
    res.status(500).json({
      message: "Error adding multiple row errors",
      error: err.message,
    });
  }
}

// Fetch a row error by ID
async function getRowErrorById(req, res) {
  try {
    const rowError = await RowErrorModel.findById(req.params.id);
    if (!rowError)
      return res.status(404).json({ message: "Row error not found" });
    res.status(200).json(rowError);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching row error by ID", error: err.message });
  }
}

// Update an existing row error
async function updateRowError(req, res) {
  try {
    const updatedRowError = await RowErrorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRowError)
      return res.status(404).json({ message: "Row error not found" });
    res.status(200).json(updatedRowError);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating row error", error: err.message });
  }
}

// Delete a row error
async function deleteRowError(req, res) {
  try {
    const deletedRowError = await RowErrorModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedRowError)
      return res.status(404).json({ message: "Row error not found" });
    res.status(200).json(deletedRowError);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting row error", error: err.message });
  }
}

module.exports = {
  getRowErrors,
  addRowError,
  addMultipleRowErrors,
  getRowErrorById,
  updateRowError,
  deleteRowError,
};
