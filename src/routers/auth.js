const express = require("express");
const {
  registerUser,
  loginUser,
  getprofile,
  changePassword,
} = require("../controllers/authControllers");
const checkToken = require("../middleware/checkToken");
const validate = require("../middleware/validate");
const schema = require("../../validatorSchema/authValidator");

const router = express.Router();

router.post("/register", validate(schema.registerValidator), registerUser);
router.post("/login", validate(schema.loginValidator), loginUser);
router.get("/authenticate", checkToken, getprofile);
router.post(
  "/change-password",
  checkToken,
  validate(schema.changePasswordValidator),
  changePassword
);

module.exports = router;
