const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user.controller");

const verifyJWT = require("../middlewares/auth.middleware");

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

module.exports = router;
