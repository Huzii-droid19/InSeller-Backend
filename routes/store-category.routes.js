const express = require("express");
const controller = require("../controllers/store-category.controller");

const router = express.Router();
router.post("/create", controller.createStoreCategory);
router.get("/get-all", controller.getAll);

module.exports = router;
