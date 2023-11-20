import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const commentSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      maxLength: 1000,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('comments', commentSchema);

export default Comment;
