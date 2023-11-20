import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import { AppError } from '../utils/errorUtils.js';
import { hasProfanity, isToxic } from '../utils/profanityUtils.js';

// Get all posts
const getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({})
    .populate('user', 'username')
    .populate('comments', 'body')
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: 'Success',
    posts,
  });
});

// Get a single post
const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'username')
    .populate('comments');
  if (!post) {
    next(new AppError('Post not found', 404));
  }
  res.status(200).json({
    message: 'Success',
    post,
  });
});

// Create a post
const createPost = asyncHandler(async (req, res, next) => {
  const { title, body } = req.body;
  if (!title) {
    return next(new AppError('Title is required', 400));
  }
  if (!body) {
    return next(new AppError('Body is required', 400));
  }
  if (title.length > 100) {
    return next(new AppError('Title must be less than 100 characters', 400));
  }
  if (body.length > 1000) {
    return next(new AppError('Body must be less than 1000 characters', 400));
  }
  if (hasProfanity(title) || hasProfanity(body)) {
    return next(new AppError('Profanity is not allowed', 400));
  }
  const isToxicTitle = await isToxic(title);
  const isToxicBody = await isToxic(body);
  if (isToxicTitle || isToxicBody) {
    return next(new AppError('Toxicity is not allowed', 400));
  }
  const post = await Post.create({
    title,
    body,
    user: req.user._id,
  });
  const user = await User.findById(req.user._id);
  user.posts.push(post._id);
  await user.save();
  res.status(201).json({
    message: 'Post created successfully',
    post,
  });
});

// Delete a post
const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError('Post not found', 404));
  }
  if (post.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError('You are not authorized to delete this post', 403)
    );
  }
  await post.remove();
  res.status(200).json({
    message: 'Post deleted successfully',
  });
});

// Like a post
const likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    next(new AppError('Post not found', 404));
  }
  if (post.likes.includes(req.user._id)) {
    console.log('post already liked!');
    const index = post.likes.indexOf(req.user._id);
    post.likes.splice(index, 1);
    await post.save();
  } else {
    post.likes.push(req.user._id);
    await post.save();
  }
  res.status(200).json({
    message: 'Post liked successfully',
  });
});

export { getAllPosts, getPost, createPost, deletePost, likePost };
