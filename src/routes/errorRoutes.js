// src/routes/errorRoutes.js
const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");
const searchService = require("../services/searchService");

// Advanced search route
router.get("/search", async (req, res) => {
  try {
    const { query } = req;

    // Check if a valid query exists
    if (!query || Object.keys(query).length === 0) {
      return res.status(400).json({ message: "Query parameter missing" });
    }

    const results = await searchService.searchErrors(
      query.q || query.search || ""
    ); // Use the key that holds the actual search term
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching search results",
      error: err.message,
    });
  }
});

// CRUD Endpoints
router.get("/", errorController.getErrors); // Fetch all errors
router.post("/", errorController.addError); // Add a new error
router.get("/:id", errorController.getErrorById); // Fetch an error by ID
router.put("/:id", errorController.updateError); // Update an existing error
router.delete("/:id", errorController.deleteError); // Delete an error by ID

module.exports = router;
