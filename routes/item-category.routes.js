const express = require("express");
const controller = require("../controllers/item-category.controller");
const auth = require("../middlewares/authJWT");

const router = express.Router();

router.post("/add-category", [auth.verifyToken], controller.createCategory);
router.get("/get-all-categories/:store_id", controller.getAllCategories);
router.get(
  "/get-all-categories-products/:store_id",
  controller.getAllCategoriesProducts
);
router.get(
  "/get-category-by-id/:id",
  [auth.verifyToken],
  controller.getCategoryById
);
router.put("/update-category/:id", [auth.verifyToken], controller.editCategory);
router.delete(
  "/delete-category/:id",
  [auth.verifyToken],
  controller.deleteCategory
);

module.exports = router;
