const express = require("express");
const auth = require("../middlewares/authJWT");
const controller = require("../controllers/item.controller");

const router = express.Router();

router.get("/get-all-items/:store_id", controller.getAllItems);
router.get("/get-item-by-id", [auth.verifyToken], controller.getItemById);
router.post("/add-item", [auth.verifyToken], controller.createItem);
router.put("/update-item", [auth.verifyToken], controller.editItem);
router.delete("/delete-item", [auth.verifyToken], controller.deleteItem);
module.exports = router;
