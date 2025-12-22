const express = require("express");
const authRouter = express.Router();
const {
  signup,
  login,
  refresh,
  logout,
} = require("../controllers/auth.controller");

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

module.exports = authRouter;
