const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getFilteredPosts,
  searchPosts,
} = require("../controllers/post.controller");

const verifyJWT = require("../middlewares/auth.middleware");

router.route("/create").post(verifyJWT, createPost);
router.route("/feed").get(verifyJWT, getAllPosts);
router.route("/filter").get(verifyJWT, getFilteredPosts);
router.route("/filter").get(verifyJWT, searchPosts);

module.exports = router;
