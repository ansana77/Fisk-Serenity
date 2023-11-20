import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 150,
    },
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
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'comments',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('posts', postSchema);

export default Post;
