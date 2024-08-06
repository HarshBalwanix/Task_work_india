const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { User } = require("../models/index");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

// Register a new user // tested
// const registerUser = asyncHandler(async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !password) {
//     throw new ApiError(400, "Please provide a first name and password");
//   }

//   // const existedUser = await User.findOne({ where: { firstName } });

//   // if (existedUser) {
//   //   throw new ApiError(400, "User already exists");
//   // }

//   const user = await User.create({ firstName, password });

//   if (!user) {
//     throw new ApiError(400, "User could not be created");
//   }

//   return res
//     .status(201)
//     .json(new ApiResponse(201, user, "User created successfully"));
// });

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Please provide a username, email, and password");
  }

  const existedUser = await User.findOne({ where: { email } });

  if (existedUser) {
    throw new ApiError(400, "Email already in use");
  }

  const user = await User.create({ username, email, password, role });

  if (!user) {
    throw new ApiError(400, "User could not be created");
  }

  return res.status(200).json(
    new ApiResponse(200, {
      status: "Account successfully created",
      user_id: user.id,
    })
  );
});

// User login
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Please provide a username and password");
  }

  console.log(username, password);
  const user = await User.findOne({ where: { username } });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return (
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      // .json(new ApiResponse(200, { user, accessToken }, "Login successful"));
      .json({
        status: "Login successful",
        status_code: 200,
        id: user.id,
        access_token: accessToken,
      })
  );
});

// User logout
const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.update({ refreshToken: null }, { where: { id: req.user.id } });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out"));
  } catch (error) {
    throw new ApiError(501, "Something went wrong in logout function");
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
