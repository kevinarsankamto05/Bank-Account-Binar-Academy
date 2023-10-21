const express = require("express"),
  router = express.Router(),
  authRouter = require("./auth"),
  userRouter = require("./user"),
  accountRoute = require("./bankAccount"),
  transactionRoute = require("./transaction");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/accounts", accountRoute);
router.use("/transactions", transactionRoute);
module.exports = router;
