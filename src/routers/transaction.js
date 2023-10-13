const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
} = require("../controllers/transactionControllers");

const router = express.Router();

router.post("/transactions", createTransaction);
router.get("/transactions", getTransactions);
router.get("/transactions/:id", getTransactionById);
router.delete("/transactions/:id", deleteTransaction);

module.exports = router;
