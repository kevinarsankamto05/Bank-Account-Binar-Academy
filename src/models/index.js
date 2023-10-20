const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  users: prisma.users,
  profiles: prisma.profiles,
  bank_accounts: prisma.bank_accounts,
  bank_accounts_transaction: prisma.bank_accounts_transaction,
};
