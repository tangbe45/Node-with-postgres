const database = require("../services/database");

exports.getAllProducts = async (req, res) => {
  try {
    const result = await database.pool.query(
      "SELECT name, description FROM products"
    );
    return res.status(200).json((await result).rows);
  } catch (error) {
    return res
      .status(500)
      .json({ severity: error.severity, name: error.name, code: error.code });
  }
};
