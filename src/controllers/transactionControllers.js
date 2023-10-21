const { bank_accounts, bank_account_transactions } = require("../models");

const createTransaction = async (req, res) => {
  let { source_account_id, destination_account_id, amount } = req.body;
  source_account_id = parseInt(source_account_id);
  destination_account_id = parseInt(destination_account_id);
  amount = parseInt(amount);

  const existingSourceAccount = await bank_accounts.findUnique({
    where: {
      id: source_account_id,
    },
  });

  if (source_account_id === destination_account_id) {
    return res.status(400).json({
      error: true,
      message: "source_account_id and destination_account_id must different",
    });
  }

  if (!existingSourceAccount)
    return res
      .status(404)
      .json({ error: true, message: "Source Account Not Found" });

  if (existingSourceAccount.balance < amount)
    return res
      .status(404)
      .json({ error: true, message: "Source Account balance is insufficient" });

  const existingDestinationAccount = await bank_accounts.findUnique({
    where: {
      id: destination_account_id,
    },
  });

  if (!existingDestinationAccount)
    return res
      .status(404)
      .json({ error: true, message: "Destination Account Not Found" });

  await bank_account_transactions
    .create({
      data: {
        amount: amount,
        source_account: { connect: { id: source_account_id } },
        destination_account: {
          connect: { id: destination_account_id },
        },
      },
    })
    .then(() => {
      return bank_accounts.update({
        where: { id: source_account_id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    })
    .then(() => {
      return bank_accounts.update({
        where: { id: destination_account_id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    })
    .then(() => {
      return res.status(201).json({
        error: false,
        message: "Create Transaction Successfully",
        data: {
          source_account_id,
          destination_account_id,
          amount,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    });
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await bank_account_transactions.findMany({
      include: {
        source_account: true,
        destination_account: true,
      },
    });

    if (!transactions)
      return res
        .status(404)
        .json({ error: true, message: "Transaction Not Found" });

    const response = transactions.map((transaction) => {
      return {
        transaction_id: parseInt(transaction.id),
        source_account: parseInt(transaction.source_account_id),
        destination_account: parseInt(transaction.destination_account_id),
        amount: parseInt(transaction.amount),
      };
    });

    return res.status(201).json({
      error: false,
      message: "Fetched data transaction successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const getTransactionById = async (req, res) => {
  const transactionId = parseInt(req.params.id);

  try {
    const transaction = await bank_account_transactions.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        source_account: true,
        destination_account: true,
      },
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ error: true, message: "Transaction not found" });
    }

    const response = {
      transaction_id: parseInt(transaction.id),
      source_account: parseInt(transaction.source_account_id),
      destination_account: parseInt(transaction.destination_account_id),
      amount: parseInt(transaction.amount),
    };

    return res.status(200).json({
      error: false,
      message: "Transaction fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const deleteTransaction = async (req, res) => {
  const transactionId = parseInt(req.params.id);

  try {
    const existingTransaction = await bank_account_transactions.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!existingTransaction) {
      return res
        .status(404)
        .json({ error: true, message: "Transaction not found" });
    }

    await bank_account_transactions.delete({
      where: {
        id: transactionId,
      },
    });

    return res.status(200).json({
      error: false,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
  getTransactionById,
};
