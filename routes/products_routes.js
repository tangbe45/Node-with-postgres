const {
  getAllProducts,
  createProduct,
} = require("../controllers/products_controller");

const router = require("express").Router();

router.get("/", getAllProducts);
router.post("/", createProduct);

module.exports = router;
