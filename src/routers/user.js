const express = require("express");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.get("/all-users", getUsers);
router.get("/users-by-id/:id", getUserById);
router.put("/update-users/:id", updateUser);
router.delete("/delete-users/:id", deleteUser);

module.exports = router;
