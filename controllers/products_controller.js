const database = require("../services/database");

exports.getAllProducts = async (req, res) => {
  try {
    // const result = await database.pool.query(
    //   `SELECT p.name, p.description, p.price, p.quantity, c.name FROM products AS p JOIN categories AS c ON p.category_id = c.id`
    // );
    const result = await database.pool.query(
      `SELECT p.id, p.name, p.description, p.price, p.quantity, p.active,
            (SELECT row_to_json(category_object) FROM (
                SELECT id, name FROM categories WHERE id = p.category_id) AS category_object) 
            AS category
        FROM products AS p;`
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ severity: error.severity, name: error.name, code: error.code });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      quantity,
      active,
      category_id,
    } = req.body;

    if (!name) {
      return res.status(422).json({ message: "Name is required" });
    }

    if (!price) {
      return res.status(422).json({ message: "Price is required" });
    }

    if (!category_id) {
      return res.status(422).json({ message: "Category_id is required" });
    } else {
      const existsResult = await database.pool.query({
        text: `SELECT EXISTS (SELECT * FROM categories WHERE id = $1)`,
        values: [category_id],
      });

      if (!existsResult.rows[0].exists) {
        return res.status(422).json({ message: "Category id not found" });
      }
    }

    const result = await database.pool.query({
      text: `INSERT INTO products (name, description, price, currency, quantity, active, category_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      values: [
        name,
        description ? description : null,
        price,
        currency ? currency : "CFA",
        quantity ? quantity : 0,
        "active" in req.body ? active : "true",
        category_id,
      ],
    });

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ severity: error.severity, name: error.name, code: error.code });
  }
};

exports.updateProduct = async (req, res) => {
  console.log("In controller");
  try {
    const {
      name,
      description,
      price,
      currency,
      quantity,
      active,
      category_id,
    } = req.body;

    if (!name) {
      return res.status(422).json({ message: "Name is required" });
    }

    if (!price) {
      return res.status(422).json({ message: "Price is required" });
    }

    if (!category_id) {
      return res.status(422).json({ message: "Category id is required" });
    } else {
      const existsResult = await database.pool.query({
        text: `SELECT EXISTS (SELECT * FROM categories WHERE id = $1)`,
        values: [category_id],
      });

      if (!existsResult.rows[0].exists) {
        return res.status(422).json({ message: "Category id not found" });
      }
    }
    console.log("After validation");
    const result = await database.pool.query({
      text: `
        UPDATE products 
        SET name = $1, description = $2, price = $3, currency = $4, quantity = $5, active = $6, category_id = $7
        WHERE id = $8 RETURNING *`,
      values: [
        name,
        description ? description : null,
        price,
        currency ? currency : "CFA",
        quantity ? quantity : 0,
        "active" in req.body ? active : "true",
        category_id,
        req.params.id,
      ],
    });
    console.log("After update");
    if (!result.rowCount) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({
      severity: error.severity,
      name: error.name,
      code: error.code,
      message: error.message,
    });
  }
};
