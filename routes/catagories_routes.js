const {
  getAllCategories,
  createCategory,
  updateCategory,
} = require("../controllers/categories_controller");

const router = require("express").Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);

module.exports = router;
