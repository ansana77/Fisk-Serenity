import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import {
  getAllComments,
  createComment,
  deleteComment,
} from '../controllers/commentController.js';

const commentRouter = Router();

commentRouter.get('/:postId', getAllComments);
commentRouter.post('/:postId', isAuthenticated, createComment);
commentRouter.delete('/:id', isAuthenticated, deleteComment);

export default commentRouter;
