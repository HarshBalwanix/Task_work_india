const express = require("express");
const router = express.Router();
const { createPost, getAllPosts } = require("../controllers/post.controller");

const verifyJWT = require("../middlewares/auth.middleware");

router.route("/create").post(verifyJWT, createPost);
router.route("/feed").get(verifyJWT, getAllPosts);

module.exports = router;
