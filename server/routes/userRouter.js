import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { login, signup, getUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/signup', signup);
userRouter.get('/me', isAuthenticated, getUser);

export default userRouter;
