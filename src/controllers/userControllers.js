const { users, profiles, bank_accounts } = require("../models");

const getUsers = async (req, res) => {
  try {
    const user = await users.findMany({
      include: {
        profile: true,
        bank_accounts: true,
      },
    });

    if (!user)
      return res.status(404).json({
        error: true,
        message: "User Not Found",
      });

    const response = user.map((user) => ({
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
    const user = await users.findUnique({
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
    const existingUser = await users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const updatedUser = await users.update({
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
  const profileId = parseInt(req.params.id);

  try {
    const existingProfile = await users.findUnique({
      where: { id: profileId },
    });

    if (!existingProfile) {
      return res
        .status(404)
        .json({ error: true, message: "Profile not found" });
    }

    await users.delete({
      where: { id: profileId },
    });

    return res.status(200).json({
      error: false,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
