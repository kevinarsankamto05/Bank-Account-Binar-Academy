const express = require("express");
const {
  createUsers,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/users", createUsers);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
