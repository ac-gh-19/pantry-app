const pool = require("../db");

exports.getAllItems = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pantry_items");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { name, quantity, unit } = req.body;
    const result = await pool.query(
      "INSERT INTO pantry_items (name, quantity, unit) VALUES ($1, $2, $3) RETURNING *",
      [name, quantity, unit],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, unit } = req.body;
    const result = await pool.query(
      "UPDATE pantry_items SET name = $1, quantity = $2, unit = $3 WHERE id = $4 RETURNING *",
      [name, quantity, unit, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM pantry_items WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
