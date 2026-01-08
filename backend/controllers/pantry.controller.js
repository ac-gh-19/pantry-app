const pool = require("../db");
const { ok, fail } = require("../utils/response");
const ERROR = require("../utils/errors");

// req.user object is passed in from authentication step

exports.getAllItems = async (req, res) => {
  try {
    const { user } = req;
    const result = await pool.query(
      "SELECT * FROM pantry_items WHERE user_id = $1",
      [user.userId],
    );
    return ok(res, result.rows, 200);
  } catch (error) {
    console.error("Get all items fail: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};

exports.addItem = async (req, res) => {
  try {
    const { user } = req;
    const { name, quantity, unit } = req.body;

    if (!name || typeof name !== "string")
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid name", 400);
    if (quantity == null || Number.isNaN(Number(quantity)))
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid quantity", 400);
    if (!unit) return fail(res, ERROR.VALIDATION_ERROR, "Invalid unit", 400);

    const result = await pool.query(
      "INSERT INTO pantry_items (name, quantity, unit, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, quantity, unit, user.userId],
    );

    return ok(res, result.rows[0], 201);
  } catch (error) {
    console.error("Add item fail: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { user } = req;
    const itemId = Number(req.params.itemId);
    const { name, quantity, unit } = req.body;

    if (!Number.isInteger(itemId) || itemId <= 0)
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid itemId", 400);
    if (!name || typeof name !== "string")
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid name", 400);
    if (quantity == null || Number.isNaN(Number(quantity)))
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid quantity", 400);
    if (!unit) return fail(res, ERROR.VALIDATION_ERROR, "Invalid unit", 400);

    const result = await pool.query(
      "UPDATE pantry_items SET name = $1, quantity = $2, unit = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [name, quantity, unit, itemId, user.userId],
    );
    if (result.rows.length === 0) {
      return fail(res, ERROR.RESOURCE_NOT_FOUND, "Item not found", 404);
    }

    return ok(res, result.rows[0], 200);
  } catch (error) {
    console.error("Update item fail: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { user } = req;
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(itemId) || itemId <= 0)
      return fail(res, ERROR.VALIDATION_ERROR, "Invalid itemId", 400);

    const result = await pool.query(
      "DELETE FROM pantry_items WHERE id = $1 AND user_id = $2 RETURNING *",
      [itemId, user.userId],
    );

    if (result.rows.length === 0) {
      return fail(res, ERROR.RESOURCE_NOT_FOUND, "Item not found", 404);
    }

    return ok(res, result.rows[0], 200);
  } catch (error) {
    console.error("Delete item fail: ", error);
    return fail(res, ERROR.INTERNAL_ERROR, "Internal server error", 500);
  }
};
