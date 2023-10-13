const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const createUsers = async (req, res) => {
  const { name, email, password, identity_number, identity_type, address } =
    req.body;

  if (!name)
    return res.status(400).json({ error: true, message: "name is required" });

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  } else if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid email format" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  } else if (password.length < 8) {
    return res.status(400).json({
      error: true,
      message: "Password must be at least 8 characters long",
    });
  }

  if (!identity_number)
    return res
      .status(400)
      .json({ error: true, message: "identity_number is required" });

  if (!identity_type)
    return res
      .status(400)
      .json({ error: true, message: "identity_type is required" });

  if (!address)
    return res
      .status(400)
      .json({ error: true, message: "address is required" });

  const existingEmail = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });

  if (existingEmail)
    return res
      .status(400)
      .json({ error: true, message: "Email already registered" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
        profile: {
          create: {
            identity_number: identity_number,
            identity_type: identity_type,
            address: address,
          },
        },
      },
    });

    const response = {
      ...user,
    };

    return res.status(201).json({
      error: false,
      message: "register user Successfully ",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        profile: true,
        bank_accounts: true,
      },
    });

    if (!users)
      return res.status(404).json({
        error: true,
        message: "User Not Found",
      });

    const response = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      profiles: {
        identity_type: user.profile.identity_type,
        identity_number: user.profile.identity_number,
        address: user.profile.address,
      },
      bank_accounts: user.bank_accounts.map((account) => ({
        bank_name: account.bank_name,
        bank_account_number: account.bank_account_number,
        balance: parseInt(account.balance),
      })),
    }));

    return res.status(200).json({
      error: false,
      message: "Successfully fetched data all user",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        bank_accounts: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile: {
        identity_type: user.profile.identity_type,
        identity_number: user.profile.identity_number,
        address: user.profile.address,
      },
      bank_accounts: user.bank_accounts.map((account) => ({
        bank_name: account.bank_name,
        bank_account_number: account.bank_account_number,
        balance: parseInt(account.balance),
      })),
    };

    return res.status(200).json({
      error: false,
      message: "User fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, password, identity_number, identity_type, address } =
    req.body;

  try {
    const existingUser = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        name: name || existingUser.name,
        email: email || existingUser.email,
        password: password
          ? await bcrypt.hash(password, await bcrypt.genSalt())
          : existingUser.password,
        profile: {
          update: {
            identity_number:
              identity_number || existingUser.profile.identity_number,
            identity_type: identity_type || existingUser.profile.identity_type,
            address: address || existingUser.profile.address,
          },
        },
      },
    });

    return res.status(200).json({
      error: false,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    await prisma.users.delete({
      where: { id: userId },
    });

    return res.status(200).json({
      error: false,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  createUsers,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
