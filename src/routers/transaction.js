const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
} = require("../controllers/transactionControllers");

const router = express.Router();

router.post("/create-transaction", createTransaction);
router.get("/all-transaction", getTransactions);
router.get("/transaction-by-id/:id", getTransactionById);
router.delete("/delete-transaction/:id", deleteTransaction);

module.exports = router;
