const jwt = require("jsonwebtoken");

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

  const jwtPayLoad = jwt.verify(token, "secret_key");

  if (!jwtPayLoad) {
    return res.status(403).json({
      error: true,
      message: "unauthenticated",
    });
  }

  res.user = jwtPayLoad;

  next();

  //   return res.status(200).json({
  //     error: false,
  //       message: "Token is valid",
  //   })
};

module.exports = checkToken;
