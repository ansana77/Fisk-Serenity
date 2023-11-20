import SerenityLogo from '../../assets/serenity_logo_pink.png';
import { FaRegUser, FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { username, email, password };
    axios
      .post('/users/signup', user)
      .then((res) => {
        if (res.status.toString().startsWith('2')) {
          setError('');
          setSuccess(res.data.message);
          window.location.reload();
        } else {
          setSuccess('');
          setError(res.data.message);
        }
        const token = res.data.token;
        localStorage.setItem('token', token);
      })
      .catch((err) => {
        setSuccess('');
        console.log(err);
        setError(err.response.data.message);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[91.5vh] w-full flex-1 px-20 text-center">
      <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
        <div className="w-3/5 p-5">
          <div className="text-left font-bold flex text-serenity-secondary">
            <img src={SerenityLogo} alt="Serenity Logo" className="w-6 mr-1" />
            Serenity
          </div>
          <div className="py-10 pb-5">
            <h2 className="text-3xl font-bold mb-2 text-serenity-pink">
              Create Account
            </h2>
            <div className="border-2 w-10 border-serenity-pink inline-block mb-2"></div>
            {error && (
              <p className="text-red-500 text-xs text-left mt-2 bg-red-200 p-2 border-l-2 border-red-500 w-1/2 m-auto">
                {' '}
                X {error}
              </p>
            )}
            {success && (
              <p className="text-green-500 text-xs text-left mt-2 bg-green-200 p-2 border-l-2 border-green-500 w-1/2 m-auto">
                {' '}
                ✓ {success}
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 w-3/6 p-2 flex items-center mb-3">
                <FaRegUser className="text-gray-400 m-2" />
                <input
                  type="text"
                  placeholder="Username"
                  className="bg-inherit outline-none w-full text-gray-600"
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="bg-gray-100 w-3/6 p-2 flex items-center mb-3">
                <FaRegEnvelope className="text-gray-400 m-2" />
                <input
                  type="text"
                  placeholder="Email"
                  className="bg-inherit outline-none w-full text-gray-600"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="bg-gray-100 w-3/6 p-2 flex items-center mb-3">
                <MdLockOutline className="text-gray-400 m-2" />
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-inherit outline-none w-full text-gray-600"
                  value={password || ''}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="border-2 text-serenity-pink border-serenity-pink rounded-full px-6 py-2 hover:bg-serenity-pink hover:text-white font-semibold mt-5"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div className="text-white w-2/5 py-36 px-12 bg-serenity-pink rounded-tr-2xl rounded-br-2xl">
          <h2 className="text-3xl font-bold mb-2">Sign In</h2>
          <div className="border-2 w-10 border-white inline-block mb-2"></div>
          <p className="mb-6">
            Already have an account? Login to your account instead.
          </p>
          <Link to="/login">
            <button className="border-2 border-white rounded-full px-6 py-2 hover:bg-white hover:text-serenity-pink font-semibold">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
