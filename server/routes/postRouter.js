import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  getAllPosts,
  getPost,
  createPost,
  deletePost,
  likePost,
} from '../controllers/postController.js';

const postRouter = Router();

postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPost);
postRouter.post('/', isAuthenticated, createPost);
postRouter.delete('/:id', isAuthenticated, deletePost);
postRouter.patch('/:id', isAuthenticated, likePost);

export default postRouter;
