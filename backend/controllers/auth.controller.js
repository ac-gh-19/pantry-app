const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { ok, fail } = require("../utils/response");
const ERROR = require("../utils/errors");
const { isValidPassword } = require("../utils/validPassword");
const { isValidEmail } = require("../utils/validEmail");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidPassword(password)) {
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid password", 400, {
        field: "password",
        requirements: { minLength: 8, mustInclude: ["letter", "number"] },
      });
    }

    if (!isValidEmail(email)) {
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid email", 400, {
        field: "email",
        requirements: "Invalid format",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (existingUser.rows.length > 0) {
      return fail(res, ERROR.RESOURCE_CONFLICT, "User already exists", 409, {
        field: "email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, hashedPassword],
    );

    return ok(res, result.rows[0], 201);
  } catch (error) {
    console.error("Signup failed: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return fail(
        res,
        ERROR.VALIDATION_ERROR,
        "Email and password are required",
        400,
      );
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length === 0) {
      return fail(
        res,
        ERROR.AUTH_INVALID_CREDENTIALS,
        "Invalid email or password",
        401,
      );
    }

    const user = existingUser.rows[0];
    const isMatchingPassword = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!isMatchingPassword) {
      return fail(
        res,
        ERROR.AUTH_INVALID_CREDENTIALS,
        "Invalid email or password",
        401,
      );
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
      [user.id, refreshToken],
    );

    return ok(
      res,
      { accessToken: accessToken, refreshToken: refreshToken },
      200,
    );
  } catch (error) {
    console.error("Login failed: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};

// exports.ok = (res, data, status = 200) => {
//   return res.status(status).json({ ok: true, data, error: null });
// };

// exports.fail = (res, code, message, status = 400, details = null) => {
//   return res.status(status).json({
//     ok: false,
//     data: null,
//     error: { code, message, details },
//   });
// };

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return fail(res, ERROR.VALIDATION_ERROR, "Refresh token required", 400);
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return fail(res, ERROR.AUTH_UNAUTHORIZED, "Invalid refresh token", 401);
    }

    const result = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [refreshToken],
    );

    if (result.rows.length === 0) {
      return fail(res, ERROR.AUTH_UNAUTHORIZED, "Invalid refresh token", 401);
    }

    const accessToken = generateAccessToken(decoded.userId);
    return ok(res, { accessToken: accessToken }, 200);
  } catch (error) {
    console.error("Refresh token error: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return fail(res, ERROR.VALIDATION_ERROR, "Refresh token required", 400);
    }

    const result = await pool.query(
      "DELETE FROM refresh_tokens WHERE token = $1 RETURNING *",
      [refreshToken],
    );

    if (result.rows.length === 0) {
      return fail(res, ERROR.AUTH_UNAUTHORIZED, "Invalid refresh token", 401);
    }

    return ok(res, { message: "Logged out" }, 200);
  } catch (error) {
    console.error("Logout fail: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Logout failed", 500);
  }
};
