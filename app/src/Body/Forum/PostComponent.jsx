import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHandHoldingHeart, FaHandHolding } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const PostComponent = ({ post }) => {
  const [avatar, setAvatar] = useState('');
  const [time, setTime] = useState('');
  const [liked, setLiked] = useState(undefined);
  const [likeCount, setLikeCount] = useState(undefined);
  useEffect(() => {
    const getAvatar = async () => {
      if (post) {
        const userId = post.user._id;
        if (liked === undefined && post.likes.includes(userId)) {
          setLiked(true);
        }
        if (likeCount === undefined) {
          setLikeCount(post.likes.length);
        }
        const username = post.user.username;
        const timeAgo = formatDistanceToNow(new Date(post.createdAt));
        setTime(timeAgo + ' ago');
        const res = await fetch(
          `https://ui-avatars.com/api/?background=random&name=${username}`
        );
        const data = await res.blob();
        const imageObjectURL = URL.createObjectURL(data);
        setAvatar(imageObjectURL);
      }
    };
    getAvatar();
  }, [post, likeCount, liked]);

  const handleLike = async () => {
    const res = await axios.patch(`/posts/${post._id}`);
    if (liked) {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
      return;
    } else {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    }
  };
  return (
    <div className="post w-1/2 bg-serenity-pink my-5 mx-auto rounded-lg py-7 text-white">
      {post && (
        <div className="px-5 flex flex-row space-x-10">
          <div className="user basis-2/12 m-auto text-center">
            <img className="rounded-full m-auto" src={avatar} />
            <h1 className="font-bold inline-block">{post.user.username}</h1>
            <p className="font-thin text-xs inline-block">{time}</p>
            <p className="font-thin text-xs">
              {likeCount == 1 ? likeCount + ' like' : likeCount + ' likes'}
            </p>
          </div>
          <div className="basis-10/12 text-justify">
            <h1 className="font-bold text-lg">{post.title}</h1>
            <p className="">{post.body}</p>
          </div>
          <div className="m-auto hover:cursor-pointer" onClick={handleLike}>
            {liked ? (
              <FaHandHoldingHeart className="text-3xl" />
            ) : (
              <FaHandHolding className="text-3xl" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComponent;
