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
