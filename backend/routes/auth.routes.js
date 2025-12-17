const express = require('express');
const authRouter = express.Router();
const { signup, login } = require('../controllers/auth.controller');

authRouter.post('/signup', signup);
authRouter.post('/login', login);

module.exports = authRouter;