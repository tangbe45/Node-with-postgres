const {
  getAllCategories,
  createCategory,
} = require("../controllers/categories_controller");

const router = require("express").Router();

router.get("/", getAllCategories);
router.post("/", createCategory);

module.exports = router;
