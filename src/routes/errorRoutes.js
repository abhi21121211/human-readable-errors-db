const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");
const searchService = require("../services/searchService");

// CRUD Endpoints
router.get("/", errorController.getErrors); // Fetch all errors
router.post("/", errorController.addError); // Add a new error
router.get("/:id", errorController.getErrorById); // Fetch an error by ID
router.put("/:id", errorController.updateError); // Update an existing error
router.delete("/:id", errorController.deleteError); // Delete an error by ID

// Search Endpoint
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Query parameter missing" });

    const results = await searchService.searchErrors(query);
    res.status(200).json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error performing search", error: err.message });
  }
});

module.exports = router;
