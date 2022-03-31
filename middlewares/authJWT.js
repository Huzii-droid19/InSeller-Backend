const jwt = require("jsonwebtoken");
const models = require("../models");

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({
      message: "No token provided",
    });
  }
  jwt.verify(token, process.env.STORE_SECERET, (err, decode) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.id = decode.id;
    next();
  });
};

const authJWT = {
  verifyToken: verifyToken,
};

module.exports = authJWT;
