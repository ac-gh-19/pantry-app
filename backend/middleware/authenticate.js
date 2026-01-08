const jwt = require("jsonwebtoken");
const { ok, fail } = require("../utils/response");
const ERROR = require("../utils/errors");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token)
    return fail(res, ERROR.AUTH_INVALID_CREDENTIALS, "Missing token", 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error: ", error);
    if (error.name === "TokenExpiredError") {
      return fail(res, ERROR.AUTH_INVALID_CREDENTIALS, "Token expired", 401);
    }
    return fail(res, ERROR.AUTH_INVALID_CREDENTIALS, "Invalid token", 401);
  }
};
