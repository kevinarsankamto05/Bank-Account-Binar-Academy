const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createAccount = async (req, res) => {
  let { bank_name, bank_account_number, balance, user_id } = req.body;
  balance = parseInt(balance);
  user_id = parseInt(user_id);

  try {
    const existingUser = await prisma.users.findUnique({
      where: { id: user_id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: true, message: "User Not Found" });
    }

    if (balance < 50000)
      return res
        .status(400)
        .json({ error: true, message: "Minimum Balance is 50000" });

    const response = await prisma.bank_accounts.create({
      data: {
        bank_name: bank_name,
        bank_account_number: bank_account_number,
        balance: balance,
        user: {
          connect: { id: user_id },
        },
      },
    });

    const balanceInt = balance;

    return res.status(201).json({
      error: false,
      message: "Create account Successfully",
      data: {
        ...response,
        balance: balanceInt,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const getAccounts = async (req, res) => {
  try {
    const accounts = await prisma.bank_accounts.findMany({
      include: {
        user: true,
      },
    });

    if (!accounts || accounts.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "No bank accounts found" });
    }

    const response = accounts.map((account) => {
      return {
        id: account.id,
        bank_name: account.bank_name,
        bank_account_number: account.bank_account_number,
        balance: parseInt(account.balance),
        user_id: account.user.id,
      };
    });

    return res.status(200).json({
      error: false,
      message: "Fetched all bank accounts successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const getAccountById = async (req, res) => {
  const accountId = parseInt(req.params.id);

  try {
    const account = await prisma.bank_accounts.findUnique({
      where: {
        id: accountId,
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      return res
        .status(404)
        .json({ error: true, message: "Bank account not found" });
    }

    const response = {
      id: account.id,
      bank_name: account.bank_name,
      bank_account_number: account.bank_account_number,
      balance: parseInt(account.balance),
      user_id: account.user.id,
    };

    return res.status(200).json({
      error: false,
      message: "Bank account fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching bank account:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const updateAccount = async (req, res) => {
  const accountId = parseInt(req.params.id);
  const { bank_name, bank_account_number, balance, user_id } = req.body;
  try {
    const existingAccount = await prisma.bank_accounts.findUnique({
      where: { id: accountId },
    });

    if (!existingAccount) {
      return res
        .status(404)
        .json({ error: true, message: "Account not found" });
    }

    const updatedAccount = await prisma.bank_accounts.update({
      where: { id: accountId },
      data: {
        bank_name: bank_name || existingAccount.bank_name,
        bank_account_number:
          bank_account_number || existingAccount.bank_account_number,
        balance: balance || existingAccount.balance,
        user: {
          connect: { id: user_id || existingAccount.user.id },
        },
      },
    });

    return res.status(200).json({
      error: false,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const deleteAccount = async (req, res) => {
  const accountId = parseInt(req.params.id);

  try {
    await prisma.bank_accounts.delete({
      where: { id: accountId },
    });

    return res.status(200).json({
      error: false,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
