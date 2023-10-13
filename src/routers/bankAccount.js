const express = require("express");
const {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
} = require("../controllers/bankAccountControllers");

const router = express.Router();

// ACCOUNT Routes
router.post("/accounts", createAccount);
router.get("/accounts", getAccounts);
router.get("/accounts/:id", getAccountById);
router.put("/accounts/:id", updateAccount);
router.delete("/accounts/:id", deleteAccount);

module.exports = router;
