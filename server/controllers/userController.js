import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { AppError } from '../utils/errorUtils.js';

const isFiskEmail = (email) => {
  const re = new RegExp('^[A-Za-z0-9._%+-]+@my.fisk.edu$');
  return re.test(email);
};

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .select('-password -email')
    .populate('posts')
    .populate({
      path: 'appointments',
      populate: {
        path: 'counselor',
        select: 'username',
      },
    });
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.status(200).json({
    message: 'Success',
    user,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    username,
  });
  if (!user) {
    next(new AppError('Invalid username', 401));
  }
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    next(new AppError('Invalid password', 401));
  } else {
    const token = user.generateToken();
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  }
});

const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  const isValidFiskEmail = isFiskEmail(email);
  if (!username || !email || !password) {
    next(
      new AppError('Username, valid fisk email and password required!', 400)
    );
  }
  console.log(isValidFiskEmail);
  if (!isValidFiskEmail) {
    next(new AppError('Please use a valid fisk email address', 400));
  }
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: 'STUDENT',
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
  const user = await User.findOne({
    username,
  });
  if (user) {
    const token = user.generateToken();
    res.status(201).json({
      message: 'Signup successful',
      token,
    });
  } else {
    next(new AppError('Invalid user data', 400));
  }
});

export { login, signup, getUser };
