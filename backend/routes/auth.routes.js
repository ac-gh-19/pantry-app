const express = require("express");
const authRouter = express.Router();
const { signup, login, refresh } = require("../controllers/auth.controller");

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);

module.exports = authRouter;
