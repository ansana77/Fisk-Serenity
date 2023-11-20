import asyncHandler from 'express-async-handler';
import Comment from '../models/commentModel.js';
import { AppError } from '../utils/errorUtils.js';
import { hasProfanity, isToxic } from '../utils/profanityUtils.js';
import Post from '../models/postModel.js';

// Get all comments for a post
const getAllComments = asyncHandler(async (req, res, next) => {
  if (!req.params.postId) {
    next(new AppError('Post not found', 404));
  }
  const comments = await Comment.find({ post: req.params.postId })
    .populate('user', 'username')
    .sort({ createdAt: -1 });
  res.status(200).json({
    message: 'Success',
    comments,
  });
});

// // Get a single comment
// const getComment = asyncHandler(async (req, res, next) => {
//   const comment = await Comment.findById(req.params.id).populate(
//     'user',
//     'username'
//   );
//   if (!comment) {
//     next(new AppError('Comment not found', 404));
//   }
//   res.status(200).json({
//     message: 'Success',
//     comment,
//   });
// });

// Create a comment
const createComment = asyncHandler(async (req, res, next) => {
  const { body } = req.body;
  const post = await Post.findById(req.params.postId);
  if (!body) {
    return next(new AppError('Body is required', 400));
  }
  if (body.length > 1000) {
    return next(new AppError('Body must be less than 1000 characters', 400));
  }
  if (hasProfanity(body)) {
    return next(new AppError('Profanity is not allowed', 400));
  }
  const isToxicComment = await isToxic(body);
  if (isToxicComment) {
    return next(new AppError('Toxicity is not allowed', 400));
  }
  if (!post) {
    return next(new AppError('Post not found', 404));
  }
  const comment = await Comment.create({
    body,
    user: req.user._id,
    post: req.params.postId,
  });
  post.comments.push(comment._id);
  await post.save();

  res.status(201).json({
    message: 'Comment created successfully',
    comment,
  });
});

// Delete a comment
const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    next(new AppError('Comment not found', 404));
  }
  if (comment.user.toString() !== req.user._id.toString()) {
    next(new AppError('You are not authorized to delete this comment', 403));
  }
  await comment.remove();
  res.status(200).json({
    message: 'Comment deleted successfully',
  });
});

const likeComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    next(new AppError('Comment not found', 404));
  }
  if (comment.likes.includes(req.user._id)) {
    // unlike
    comment.likes.pull(req.user._id);
    await comment.save();
    return res.status(200).json({
      message: 'Comment unliked successfully',
    });
  }
  comment.likes.push(req.user._id);
  await comment.save();
  res.status(200).json({
    message: 'Comment liked successfully',
  });
});

export { getAllComments, createComment, likeComment, deleteComment };
