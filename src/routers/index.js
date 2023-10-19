const express = require("express");
const {
  registerUser,
  loginUser,
  getprofile,
  // getUsers,
  // getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");
const checkToken = require("../../middleware/checkToken");

const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.get("/auth/authenticate", checkToken, getprofile);
// router.get("/users", getUsers);
// router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
