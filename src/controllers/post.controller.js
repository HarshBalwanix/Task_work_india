const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { Post, User } = require("../models/index");

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { category, title, author, content, actual_content_link, image } =
    req.body;

  const user = await User.findByPk(req.user.id);

  if (user.role !== "admin") {
    throw new ApiError(403, "Only admins can create posts");
  }

  const post = await Post.create({
    category,
    title,
    author,
    content,
    actual_content_link,
    image,
    user_id: user.id,
  });

  if (!post) {
    throw new ApiError(400, "Post could not be created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post.id, "Short added successfully"));
});

// Read all posts
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.findAll();

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

// Read a single post by ID
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post retrieved successfully"));
});

// Update a post
const updatePost = asyncHandler(async (req, res) => {
  const {
    category,
    title,
    author,
    publish_date,
    content,
    actual_content_link,
    image,
  } = req.body;

  const user = await User.findByPk(req.user.id);

  if (user.role !== "admin") {
    throw new ApiError(403, "Only admins can update posts");
  }

  const post = await Post.findByPk(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.category = category;
  post.title = title;
  post.author = author;
  post.publish_date = publish_date;
  post.content = content;
  post.actual_content_link = actual_content_link;
  post.image = image;

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (user.role !== "admin") {
    throw new ApiError(403, "Only admins can delete posts");
  }

  const post = await Post.findByPk(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  await post.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
