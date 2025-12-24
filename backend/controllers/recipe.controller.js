const pool = require("../db");
const {
  generateRecipesFromIngredients,
} = require("../services/claude.service");

const MIN_SELECTED = 5;
const MAX_SELECTED = 15;
const MIN_PANTRY = 5;
const MAX_PANTRY = 30;

exports.getAllRecipes = (req, res) => {
  res.json({ message: "get recipes" });
};

exports.addRecipe = (req, res) => {
  res.json({ message: "add recipes" });
};

exports.generateRecipes = async (req, res) => {
  try {
    // req.user object is passed in through authenticateToken middlware
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
        error: "Claude returned invalid JSON",
        // REMOVE LATER: for now lets us see error if throws
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
