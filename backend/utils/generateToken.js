const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
