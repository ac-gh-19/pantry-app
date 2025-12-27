const jwt = require("jsonwebtoken");
const { ok, fail } = require("../utils/response");
const ERROR = require("../utils/errors");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return fail(res, ERROR.VALIDATION_ERROR, 'Invalid token', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error: ", error);
    return fail(ERROR.AUTH_INVALID_CREDENTIALS, 'Invalid token', 403);
  }
};
