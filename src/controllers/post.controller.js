const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { Post, User } = require("../models/index");
const { sequelize } = require("../models/index");

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

// Get all posts
// tried in 2 diff ways, but unable to do right now
// done now and tested
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.findAll({
    // attributes: {
    //   include: [
    //     [
    //       sequelize.fn(
    //         "JSON_UNQUOTE",
    //         sequelize.fn("JSON_EXTRACT", sequelize.col("votes"), "$.upvote")
    //       ),
    //       "upvote",
    //     ],
    //   ],
    // },
    order: [
      ["publish_date", "DESC"],
      [sequelize.literal("JSON_EXTRACT(votes, '$.upvote')"), "DESC"],
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts retrieved successfully"));
});

module.exports = {
  createPost,
  getAllPosts,
};
