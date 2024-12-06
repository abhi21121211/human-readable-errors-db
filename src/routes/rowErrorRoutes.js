const express = require("express");
const {
  getRowErrors,
  addRowError,
  getRowErrorById,
  updateRowError,
  deleteRowError,
  addMultipleRowErrors,
} = require("../controllers/rowErrorController");

const router = express.Router();

// CRUD routes for rowErrors
router.get("/", getRowErrors);
router.post("/", addRowError);
router.post("/bulk", addMultipleRowErrors);

router.get("/:id", getRowErrorById);
router.put("/:id", updateRowError);
router.delete("/:id", deleteRowError);

module.exports = router;
