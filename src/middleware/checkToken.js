const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";

const checkToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      error: true,
      message: "Please provider a token",
    });
  }

  if (token.toLowerCase().startsWith("bearer")) {
    // untuk membaca bearer
    token = token.slice("bearer".length).trim();
  }

  const jwtPayLoad = jwt.verify(token, secret_key);

  if (!jwtPayLoad) {
    return res.status(403).json({
      error: true,
      message: "unauthenticated",
    });
  }

  res.user = jwtPayLoad;

  next();
};

module.exports = checkToken;
