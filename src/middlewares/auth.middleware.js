const jwt = require("jsonwebtoken");
const { User } = require("../models");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiError");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorised request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ where: { id: decodedToken.id } });

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Invalid access token in error catch box"
    );
  }
});

module.exports = verifyJWT;
