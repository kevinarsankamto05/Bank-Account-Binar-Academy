const express = require("express");
const {
  registerUser,
  loginUser,
  getprofile,
  changePassword,

  getUsers,
  // getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");
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

router.get("/users", getUsers);
// router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
