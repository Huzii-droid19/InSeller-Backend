const express = require("express");
const auth = require("../middlewares/authJWT");
const controller = require("../controllers/item.controller");
const multer = require("multer");
const storage = multer.memoryStorage({
  destination: function (req, res, callback) {
    callback(null, "");
  },
});
const upload = multer({ storage: storage }).single("image");

const router = express.Router();

router.get("/get-all-items/:store_id", controller.getAllItems);
router.get("/get-item-by-id", [auth.verifyToken], controller.getItemById);
router.post("/add-item", [auth.verifyToken, upload], controller.createItem);
router.put("/update-item", [auth.verifyToken, upload], controller.editItem);
router.delete("/delete-item/:id", [auth.verifyToken], controller.deleteItem);

// web routes
router.get("/get-item-by-name/:name", controller.getItemByName);
module.exports = router;
