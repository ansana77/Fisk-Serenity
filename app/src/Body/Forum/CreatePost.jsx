import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = { title, body };
    console.log(post);
    axios
      .post('/posts', post)
      .then((res) => {
        if (res.status.toString().startsWith('2')) {
          Swal.fire({
            title: 'Post Created!',
            text: 'Your post has been created',
            icon: 'success',
            confirmButtonText: 'Cool',
          });
        } else {
          console.log(res.data);
          Swal.fire({
            title: 'Error!',
            text: res.data.message,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        Swal.fire({
          title: 'Error!',
          text: err.response.data.message,
          icon: 'error',
          confirmButtonText: 'Cool',
        });
      });
  };

  return (
    <div className="CreatePost w-1/2 mx-auto">
      <div className="bg-serenity-pink mt-5 rounded-lg pt-2.5">
        <h1 className="text-white text-center font-bold text-xl my-2.5">
          Create Post
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <input
            type="text"
            className="bg-white w-10/12 rounded-lg p-2.5 my-2.5 mx-auto"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="bg-white w-10/12 rounded-lg p-5 my-2.5 mx-auto"
            placeholder="Let's share whats on your mind.."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            type="submit"
            className="bg-white text-serenity-pink font-bold border-2 border-serenity-pink rounded-lg p-2 mx-auto w-1/4 my-2.5"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
