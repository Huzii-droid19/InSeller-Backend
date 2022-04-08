const express = require("express");
const verifySignUp = require("../middlewares/verifySignUp");
const controller = require("../controllers/store-auth.controller");

const router = express.Router();

router.post(
  "/signup",
  [verifySignUp.checkDuplicatePhoneNumber],
  controller.signup
);
// router.get("/check-url/:url_name", controller.checkURL);
router.post("/signin", controller.signIn);

module.exports = router;
