const express = require("express");
const controller = require("../controllers/order.controller");
const multer = require("multer");

const storage = multer.memoryStorage({
  destination: function (req, res, callback) {
    callback(null, "");
  },
});
const upload = multer({ storage: storage }).single("file");
const router = express.Router();

router.post("/place-order", [upload], controller.placeOrder);
router.get("/get-all-orders/:store_id", controller.getAllOrders);

module.exports = router;
