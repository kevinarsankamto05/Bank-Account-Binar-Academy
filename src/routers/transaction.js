const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
} = require("../controllers/transactionControllers");

const router = express.Router();

router.post("/create", createTransaction);
router.get("/read", getTransactions);
router.get("/read/:id", getTransactionById);
router.delete("/delete/:id", deleteTransaction);

module.exports = router;
