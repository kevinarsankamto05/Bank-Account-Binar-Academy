const bcrypt = require("bcrypt");
// jwt = require("jsonwebtoken");
const { async } = require("validate.js");

const crypPassword = async (password) => {
  const salt = await bcrypt.genSalt(5);

  return bcrypt.hash(password, salt);
};

module.exports = {
  crypPassword,
};
