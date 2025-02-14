const { getAllProducts } = require("../controllers/products_controller");

const router = require("express").Router();

router.get("/", getAllProducts);

module.exports = router;
