const express = require("express");
const pool = require("./db");
require("dotenv").config();
const { authenticateToken } = require("./middleware/authenticate");

const authRouter = require("./routes/auth.routes");
const pantryRouter = require("./routes/pantry.routes");
const recipeRouter = require("./routes/recipe.routes");

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle preflight for all routes
app.options(/.*/, cors());

// parse response body into usable js
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api", authenticateToken, pantryRouter);
app.use("/api", authenticateToken, recipeRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error starting server: ${err}`);
  } else {
    console.log("Server successfully started");
  }
});
