const {
  getAllProducts,
  createProduct,
  updateProduct,
} = require("../controllers/products_controller");

const router = require("express").Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);

module.exports = router;
