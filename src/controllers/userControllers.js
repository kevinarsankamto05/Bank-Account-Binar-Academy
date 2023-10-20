const { users, profiles } = require("../models"),
  utils = require("../utils"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt");
require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";

const registerUser = async (req, res) => {
  const { name, email, password, identity_number, identity_type, address } =
    req.body;

  const existingEmail = await users.findFirst({
    where: {
      email: email,
    },
  });

  if (existingEmail)
    return res
      .status(400)
      .json({ error: true, message: "Email already registered" });

  try {
    const user = await users.create({
      data: {
        name: name,
        email: email,
        password: await utils.crypPassword(password),
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

const loginUser = async (req, res) => {
  try {
    const findUser = await users.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        error: true,
        message: "Your email is not registred in our system",
      });
    }

    if (bcrypt.compareSync(req.body.password, findUser.password)) {
      const token = jwt.sign({ id: findUser.id }, secret_key, {
        expiresIn: "6h",
      });
      return res.status(200).json({
        error: false,
        message: "Successfully login",
        data: {
          token,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const getprofile = async (req, res) => {
  try {
    const user = await users.findUnique({
      where: {
        id: res.user.id,
      },
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
      message: "Prifile fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
  const user = await users.findUnique({
    where: {
      id: res.user.id,
    },
  });

  if (bcrypt.compareSync(req.body.old_password, user.password)) {
    const data = await users.update({
      where: {
        id: res.user.id,
      },
      data: {
        password: await utils.crypPassword(req.body.password),
      },
    });
    return res.status(200).json({
      error: false,
      message: "Your password has been successfully updated",
      data: user,
    });
  }
  return res.status(403).json({
    error: true,
    message: "Your old password is not valid",
  });
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

// const getUserById = async (req, res) => {
//   const userId = parseInt(req.params.id);

//   try {
//     const user = await prisma.users.findUnique({
//       where: { id: userId },
//       include: {
//         profile: true,
//         bank_accounts: true,
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ error: true, message: "User not found" });
//     }

//     const response = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       profile: {
//         identity_type: user.profile.identity_type,
//         identity_number: user.profile.identity_number,
//         address: user.profile.address,
//       },
//       bank_accounts: user.bank_accounts.map((account) => ({
//         bank_name: account.bank_name,
//         bank_account_number: account.bank_account_number,
//         balance: parseInt(account.balance),
//       })),
//     };

//     return res.status(200).json({
//       error: false,
//       message: "User fetched successfully",
//       data: response,
//     });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return res
//       .status(500)
//       .json({ error: true, message: "Internal Server Error" });
//   }
// };

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
  registerUser,
  loginUser,
  getprofile,
  changePassword,

  getUsers,
  // getUserById,
  updateUser,
  deleteUser,
};
