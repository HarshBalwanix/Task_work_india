const express = require("express");
const router = express.Router();
const { createPost } = require("../controllers/post.controller");

const verifyJWT = require("../middlewares/auth.middleware");

router.route("/create").post(verifyJWT, createPost);

module.exports = router;
