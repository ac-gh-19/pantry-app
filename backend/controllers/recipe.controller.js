const pool = require("../db");
const {
  generateRecipesFromIngredients,
} = require("../services/claude.service");
const { ok, fail } = require("../utils/response");
const ERROR = require("../utils/errors");
const MIN_SELECTED = 5;
const MAX_SELECTED = 15;
const MIN_PANTRY = 10;
const MAX_PANTRY = 30;

// req.user object is passed in through authenticateToken middlware

exports.deleteRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = Number(req.params.recipeId);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid recipeId", 400);
    }

    const result = await pool.query(
      "DELETE FROM saved_recipes WHERE id = $1 AND user_id = $2 RETURNING *",
      [recipeId, userId],
    );
    if (result.rows.length === 0) {
      return fail(res, ERROR.RESOURCE_NOT_FOUND, "Recipe not found", 404);
    }

    return ok(res, result.rows[0], 200);
  } catch (error) {
    console.error("Delete recipe fail: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      "SELECT * FROM saved_recipes WHERE user_id = $1",
      [userId],
    );

    return ok(res, result.rows, 200);
  } catch (error) {
    console.error("Get all recipes fail: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};

exports.addRecipe = async (req, res) => {
  try {
    const recipe = req.body;
    const userId = req.user.userId;

    if (!recipe.title || typeof recipe.title !== "string") {
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid title", 400, {
        field: "title",
      });
    }

    if (!Array.isArray(recipe.ingredients_used)) {
      return fail(
        res,
        ERROR.VALIDATION_ERROR,
        "Invalid ingredients_used",
        400,
        { field: "ingredients_used" },
      );
    }

    if (recipe.ingredients_used.length === 0) {
      return fail(
        res,
        ERROR.VALIDATION_ERROR,
        "Invalid ingredients_used",
        400,
        { field: "ingredients_used", minLength: 1 },
      );
    }

    if (!Array.isArray(recipe.instructions)) {
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid instructions", 400, {
        field: "instructions",
      });
    }

    if (recipe.instructions.length === 0) {
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid instructions", 400, {
        field: "instructions",
        minLength: 1,
      });
    }

    if (
      recipe.cooking_time === undefined ||
      typeof recipe.cooking_time !== "string"
    ) {
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid cooking_time", 400, {
        field: "cooking_time",
      });
    }

    if (!recipe.difficulty || typeof recipe.difficulty !== "string") {
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid difficulty", 400, {
        field: "difficulty",
      });
    }

    const allowedDifficulties = ["easy", "medium", "hard"];
    if (!allowedDifficulties.includes(recipe.difficulty.toLowerCase())) {
      return fail(
        res,
        ERROR.VALIDATION_ERROR,
        "Difficulty must be easy, medium, or difficult",
        400,
        {
          field: "difficulty",
        },
      );
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

    return ok(res, result.rows[0], 201);
  } catch (error) {
    console.error("Add recipe fail: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
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

    const { mode } = req.body;

    let pantryItems = [];
    const isSelectionMode = mode === "select";

    if (isSelectionMode) {
      if (selectedItemIds.length < MIN_SELECTED) {
        return fail(
          res,
          ERROR.VALIDATION_ERROR,
          `Select at least ${MIN_SELECTED} items`,
          400,
        );
      }

      if (selectedItemIds.length > MAX_SELECTED) {
        return fail(
          res,
          ERROR.VALIDATION_ERROR,
          `Select at most ${MAX_SELECTED} items`,
          400,
        );
      }

      // postgresql strongly typed - ::int[] makes sure $2 reads as array of int
      pantryItems = await pool.query(
        "SELECT id, name FROM pantry_items WHERE user_id = $1 AND id = ANY($2::int[])",
        [userId, selectedItemIds],
      );

      if (pantryItems.rows.length === 0) {
        return fail(
          res,
          ERROR.RESOURCE_NOT_FOUND,
          "Selected items not found",
          404,
        );
      }
    } else {
      pantryItems = await pool.query(
        "SELECT id, name FROM pantry_items WHERE user_id = $1",
        [userId],
      );

      if (pantryItems.rows.length === 0) {
        return fail(res, ERROR.VALIDATION_ERROR, "Pantry is empty", 400);
      }

      if (pantryItems.rows.length < MIN_PANTRY) {
        return fail(
          res,
          ERROR.VALIDATION_ERROR,
          `Pantry must have at least ${MIN_PANTRY} items to generate from`,
          400,
        );
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
      return fail(
        res,
        ERROR.VALIDATION_ERROR,
        `There must be at least ${minUnique} unique items`,
        400,
      );
    }

    if (ingredientNames.length > MAX_PANTRY) {
      ingredientNames = ingredientNames.slice(0, MAX_PANTRY);
    }

    const rawResJSON = await generateRecipesFromIngredients(ingredientNames);

    let recipes = [];
    try {
      recipes = JSON.parse(rawResJSON);
    } catch (error) {
      return fail(
        res,
        ERROR.INTERNAL_ERROR,
        "Error parsing response from recipe generator",
        502,
      );
    }

    return ok(res, recipes, 200);
  } catch (error) {
    console.error("Generate recipe fail: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};
