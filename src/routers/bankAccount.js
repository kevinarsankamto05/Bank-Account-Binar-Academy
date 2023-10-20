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
router.post("/create", createAccount);
router.get("/read", getAccounts);
router.get("/read/:id", getAccountById);
router.put("/update/:id", updateAccount);
router.delete("/delete/:id", deleteAccount);

module.exports = router;
