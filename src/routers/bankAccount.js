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
router.post("/create-account", createAccount);
router.get("/all-account", getAccounts);
router.get("/account-by-id/:id", getAccountById);
router.put("/update-account/:id", updateAccount);
router.delete("/delete-account/:id", deleteAccount);

module.exports = router;
