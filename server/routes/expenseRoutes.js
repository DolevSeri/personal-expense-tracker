const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.get("/", protect, getExpenses);
router.post("/", protect, createExpense);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

module.exports = router;
