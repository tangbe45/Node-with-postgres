const { getAllCategories } = require("../controllers/categories_controller");

const router = require("express").Router();

router.get("/", getAllCategories);

module.exports = router;
