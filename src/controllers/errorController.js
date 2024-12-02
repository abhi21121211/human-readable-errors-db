// src/controllers/errorController.js
const Error = require("../models/Error");

// Fetch all errors
exports.getErrors = async (req, res) => {
  try {
    const errors = await Error.find();
    res.status(200).json(errors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: err.message });
  }
};

// Add a new error
exports.addError = async (req, res) => {
  try {
    const newError = new Error(req.body);
    await newError.save();
    res.status(201).json(newError);
  } catch (err) {
    console.log("error while adding", err);
    res.status(400).json({ message: "Error adding entry", error: err.message });
  }
};

// Fetch error by ID
exports.getErrorById = async (req, res) => {
  try {
    const error = await Error.findOne({ _id: req.params.id });
    if (!error) return res.status(404).json({ message: "Error not found" });
    res.status(200).json(error);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: err.message });
  }
};

// Update an error
exports.updateError = async (req, res) => {
  try {
    const updatedError = await Error.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedError)
      return res.status(404).json({ message: "Error not found" });
    res.status(200).json(updatedError);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating entry", error: err.message });
  }
};

// Delete an error
exports.deleteError = async (req, res) => {
  try {
    const deletedError = await Error.findOneAndDelete({ _id: req.params.id });
    if (!deletedError)
      return res.status(404).json({ message: "Error not found" });
    res.status(200).json({ message: "Error deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting entry", error: err.message });
  }
};
