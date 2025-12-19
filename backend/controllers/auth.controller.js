const bcrypt = require("bcrypt");
const pool = require("../db");
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { isValidPassword } = require("../utils/validPassword");
const { isValidEmail } = require("../utils/validEmail");

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error:
          "Password must contain atleast 8 characters, a letter and a number!",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Invalid email",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (existingUser.rows.length > 0) {
      return res.status(401).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, hashedPassword],
    );
    return res.status(201).json({
      message: "User successfully created",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to create user",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    // no user found
    if (existingUser.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = existingUser.rows[0];
    const isMatchingPassword = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!isMatchingPassword) {
      return res.status(400).json({
        error: "Invalid password or email",
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return res.status(200).json({
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to login",
    });
  }
};
