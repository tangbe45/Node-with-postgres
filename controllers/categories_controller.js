const database = require("../services/database");

exports.getAllCategories = async (req, res) => {
  try {
    const result = await database.pool.query("SELECT * FROM categories;");
    return res.status(200).json(result.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ severity: error.severity, name: error.name, code: error.code });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(422).json({ message: "Name is required" });
    }

    const existsResult = await database.pool.query({
      text: "SELECT EXISTS( SELECT * FROM categories WHERE name = $1)",
      values: [name],
    });

    if (existsResult.rows[0].exists) {
      return res
        .status(409)
        .json({ message: `Category ${name} already exist` });
    }

    const result = await database.pool.query({
      text: `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
      values: [name],
    });
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({
      severity: error.severity,
      name: error.name,
      code: error.code,
      message: error.message,
      detail: error.detail,
    });
  }
};
