const database = require("../services/database");

exports.getAllCategories = async (req, res) => {
  try {
    const result = await database.pool.query("SELECT * FROM categories;");
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(422).json({ error: "Name is required" });
    }

    const existsResult = await database.pool.query({
      text: "SELECT EXISTS( SELECT * FROM categories WHERE name = $1)",
      values: [name],
    });

    if (existsResult.rows[0].exists) {
      return res.status(409).json({ error: `Category ${name} already exist` });
    }

    const result = await database.pool.query({
      text: `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
      values: [name],
    });
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(422).json({ error: "Name is required" });
    } else {
      const existsResult = await database.pool.query({
        text: "SELECT EXISTS( SELECT * FROM categories WHERE name = $1)",
        values: [name],
      });

      if (existsResult.rows[0].exists) {
        return res
          .status(409)
          .json({ error: `Category ${name} already exist` });
      }
    }

    const result = await database.pool.query({
      text: `
      UPDATE categories
      SET name = $1, updated_date = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      values: [name, req.params.id],
    });

    if (!result.rowCount) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    let { id } = req.params;

    const countResult = await database.pool.query({
      text: `SELECT COUNT(*) FROM products WHERE category_id = $1`,
      values: [id],
    });

    if (countResult.rows[0].count > 0) {
      return res.status(409).send({ error: "This Category is in used" });
    }

    const result = await database.pool.query({
      text: `DELETE FROM categories WHERE id = $1`,
      values: [id],
    });

    if (!result.rowCount) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
