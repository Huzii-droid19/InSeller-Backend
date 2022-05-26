const express = require("express");
const controller = require("../controllers/item-category.controller");
const auth = require("../middlewares/authJWT");
const multer = require("multer");

const storage = multer.memoryStorage({
  destination: function (req, res, callback) {
    callback(null, "");
  },
});
const upload = multer({ storage: storage }).single("image");
const router = express.Router();

router.post(
  "/add-category",
  [auth.verifyToken, upload],
  controller.createCategory
);

router.get("/get-all-categories/:store_id", controller.getAllCategories);
router.get(
  "/get-all-categories-products/:store_id",
  controller.getAllCategoriesProducts
);
router.get("/get-category-by-id/:id", controller.getCategoryById);
router.put(
  "/update-category/",
  [auth.verifyToken, upload],
  controller.editCategory
);
router.delete(
  "/delete-category/:id",
  [auth.verifyToken],
  controller.deleteCategory
);

module.exports = router;
