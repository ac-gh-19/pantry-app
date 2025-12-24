const pool = require("../db");
const {
  generateRecipesFromIngredients,
} = require("../services/claude.service");

const MIN_SELECTED = 5;
const MAX_SELECTED = 15;
const MIN_PANTRY = 5;
const MAX_PANTRY = 30;

// req.user object is passed in through authenticateToken middlware

exports.getAllRecipes = (req, res) => {
  res.json({ message: "get recipes" });
};

exports.addRecipe = async (req, res) => {
  try {
    const recipe = req.body;
    const userId = req.user.userId;

    if (
      !recipe.title ||
      !Array.isArray(recipe.ingredients_used) ||
      recipe.ingredients_used.length === 0 ||
      !Array.isArray(recipe.instructions) ||
      recipe.instructions.length === 0 ||
      !recipe.cooking_time ||
      !recipe.difficulty
    ) {
      return res.status(400).json({
        error:
          `Invalid recipe data. Must include title,
          cooking_time, difficulty, and arrays
          (atleast length 1) of ingredients_used and instructions.
          (Optional - optional_additions)`,
      });
    }

    const allowedDifficulties = ["easy", "medium", "hard"];
    if (!allowedDifficulties.includes(recipe.difficulty.toLowerCase())) {
      return res
        .status(400)
        .json({ error: "Difficulty must be easy, medium, or difficult" });
    }

    const optionalAdditions = Array.isArray(recipe.optional_additions)
      ? recipe.optional_additions
      : [];

    const result = await pool.query(
      `INSERT INTO saved_recipes
      (user_id, title, ingredients_used, optional_additions, instructions, cooking_time, difficulty)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        userId,
        recipe.title,
        JSON.stringify(recipe.ingredients_used),
        JSON.stringify(optionalAdditions),
        JSON.stringify(recipe.instructions),
        recipe.cooking_time,
        recipe.difficulty.toLowerCase(),
      ],
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Recipe could not be added successfully" });
    }

    return res
      .status(201)
      .json({ message: "Recipe added successfully", recipe: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.generateRecipes = async (req, res) => {
  try {
    const userId = req.user.userId;
    // checks if user selected specific item ids and some safety checks
    const selectedItemIds = Array.isArray(req.body?.selectedItemIds)
      ? req.body.selectedItemIds
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id) && id > 0)
      : null;

    let pantryItems = [];
    const isSelectionMode = selectedItemIds && selectedItemIds.length > 0;

    if (isSelectionMode) {
      if (selectedItemIds.length < MIN_SELECTED) {
        return res
          .status(400)
          .json({ error: `Select at least ${MIN_SELECTED} items` });
      }

      if (selectedItemIds.length > MAX_SELECTED) {
        return res
          .status(400)
          .json({ error: `Select at most ${MAX_SELECTED} items` });
      }

      // postgresql strongly typed - ::int[] makes sure $2 reads as array of int
      pantryItems = await pool.query(
        "SELECT id, name FROM pantry_items WHERE user_id = $1 AND id = ANY($2::int[])",
        [userId, selectedItemIds],
      );

      if (pantryItems.rows.length === 0) {
        return res.status(400).json({ error: "Selected items not found" });
      }
    } else {
      pantryItems = await pool.query(
        "SELECT id, name FROM pantry_items WHERE user_id = $1",
        [userId],
      );

      if (pantryItems.rows.length === 0) {
        return res.status(400).json({ error: "Pantry is empty" });
      }

      if (pantryItems.rows.length < MIN_PANTRY) {
        return res
          .status(400)
          .json({ error: `Pantry must have at least ${MIN_PANTRY} items` });
      }
    }

    let ingredientNames = [
      ...new Set(
        pantryItems.rows.map((item) => item.name.trim().toLowerCase()),
      ),
    ];

    // validates that there are enough items after deduping
    const minUnique = isSelectionMode ? MIN_SELECTED : MIN_PANTRY;

    if (ingredientNames.length < minUnique) {
      return res
        .status(400)
        .json({ error: `There must be at least ${minUnique} unique items` });
    }

    if (ingredientNames.length > MAX_PANTRY) {
      ingredientNames = ingredientNames.slice(0, MAX_PANTRY);
    }

    const rawResJSON = await generateRecipesFromIngredients(ingredientNames);

    let recipes = [];
    try {
      recipes = JSON.parse(rawResJSON);
    } catch (error) {
      return res.status(502).json({
        raw: rawResJSON,
      });
    }

    return res.json({ recipes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
