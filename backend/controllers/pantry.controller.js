const pool = require("../db");

// req.user object is passed in from authentication step

exports.getAllItems = async (req, res) => {
  try {
    const { user } = req;
    const result = await pool.query(
      "SELECT * FROM pantry_items WHERE user_id = $1",
      [user.userId],
    );
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { user } = req;
    const { name, quantity, unit } = req.body;

    if (!name || typeof name !== "string")
      return res.status(400).json({ error: "Name required" });
    if (quantity == null || Number.isNaN(Number(quantity)))
      return res.status(400).json({ error: "Quantity required" });
    if (!unit) return res.status(400).json({ error: "Unit required" });

    const result = await pool.query(
      "INSERT INTO pantry_items (name, quantity, unit, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, quantity, unit, user.userId],
    );
    return res
      .status(201)
      .json({ message: "Item added successfully", item: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { user } = req;
    const { itemId } = Number(req.params.itemId);
    const { name, quantity, unit } = req.body;


    if (!Number.isInteger(itemId) || itemId <= 0)
      return res.status(400).json({ error: "Invalid item id" });
    if (!name || typeof name !== "string")
      return res.status(400).json({ error: "Name required" });
    if (quantity == null || Number.isNaN(Number(quantity)))
      return res.status(400).json({ error: "Quantity required" });
    if (!unit) return res.status(400).json({ error: "Unit required" });

    const result = await pool.query(
      "UPDATE pantry_items SET name = $1, quantity = $2, unit = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [name, quantity, unit, itemId, user.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.json({
      message: "Item updated successfully",
      item: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { user } = req;
    const { itemId } = req.params;
    const result = await pool.query(
      "DELETE FROM pantry_items WHERE id = $1 AND user_id = $2 RETURNING *",
      [itemId, user.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.json({
      message: "Item deleted successfully",
      item: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
