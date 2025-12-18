const express = require("express");
const pantryRouter = express.Router();
const {
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
} = require("../controllers/pantry.controller");

pantryRouter.get("/pantry", getAllItems);
pantryRouter.post("/pantry", addItem);
pantryRouter.put("/pantry/:id", updateItem);
pantryRouter.delete("/pantry/:id", deleteItem);

module.exports = pantryRouter;
