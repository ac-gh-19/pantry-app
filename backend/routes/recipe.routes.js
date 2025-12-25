const express = require("express");
const recipeRouter = express.Router();
const {
  generateRecipes,
  getAllRecipes,
  addRecipe,
  deleteRecipe,
} = require("../controllers/recipe.controller");

recipeRouter.post("/recipes/generate", generateRecipes);
recipeRouter.get("/recipes", getAllRecipes);
recipeRouter.post("/recipes", addRecipe);
recipeRouter.delete("/recipes/:recipeId", deleteRecipe);

module.exports = recipeRouter;
