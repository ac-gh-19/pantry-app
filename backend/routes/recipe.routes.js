const express = require('express');
const recipeRouter = express.Router();
const { generateRecipes, getAllRecipes, addRecipe } = require('../controllers/recipe.controller');

recipeRouter.post('/recipes/generate', generateRecipes);
recipeRouter.get('/recipes', getAllRecipes);
recipeRouter.post('/recipes', addRecipe);

module.exports = recipeRouter;