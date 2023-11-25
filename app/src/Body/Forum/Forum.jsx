import { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import axios from 'axios';
import PostComponent from './PostComponent';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [isBusy, setIsBusy] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .get('/posts')
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        if (data) {
          setPosts(data.posts);
        }

        setIsBusy(false);
      });
  }, []);

  return (
    <div className="Forum">
      <CreatePost />
      <h1 className="text-serenity-pink text-center font-bold text-xl my-10">
        Community Posts
      </h1>
      <div className="posts">
        {isBusy ? (
          <h1>Loading...</h1>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <PostComponent post={post} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;
