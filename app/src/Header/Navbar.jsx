import { Link } from 'react-router-dom';
import SerenityLogo from '../assets/serenity_logo.png';
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (
      localStorage.token &&
      jwt_decode(localStorage.token).exp * 1000 > Date.now()
    ) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <nav className="px-0 h-[8.5vh] pt-6 my-0 bg-serenity-pink">
      <div className="flex flex-wrap items-center justify-between mx-10">
        <Link to="/" className="flex items-center">
          <img
            src={SerenityLogo}
            className="h-8 mr-3 sm:h-9"
            alt="Serenity Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Serenity
          </span>
        </Link>
        <ul className="flex flex-col justify-end text-sm font-medium">
          <li>
            <Link
              to="/"
              className="py-2 pl-3 pr-4 mx-1 text-white text-base hover:text-white hover:border-white border-b-2 border-transparent"
              aria-current="page"
            >
              Home
            </Link>
            {!isLoggedIn && (
              <Link
                to="/login"
                className="py-2 pl-3 pr-4 mx-1 text-white text-base hover:text-white hover:border-white border-b-2 border-transparent"
                aria-current="page"
              >
                Login
              </Link>
            )}
            {isLoggedIn && (
              <Link
                to="/appointments"
                className="py-2 pl-3 pr-4 mx-1 text-white text-base hover:text-white hover:border-white border-b-2 border-transparent"
                aria-current="page"
              >
                Appointments
              </Link>
            )}
            {isLoggedIn && (
              <Link
                to="/talk"
                className="py-2 pl-3 pr-4 mx-1 text-white text-base hover:text-white hover:border-white border-b-2 border-transparent"
                aria-current="page"
              >
                Talk-it-Out
              </Link>
            )}
            {isLoggedIn && (
              <Link
                to="/profile"
                className="py-2 pl-3 pr-4 mx-1 text-white text-base hover:text-white hover:border-white border-b-2 border-transparent"
                aria-current="page"
              >
                Profile
              </Link>
            )}
            {isLoggedIn && (
              <Link
                to="/logout"
                className="py-2 pl-3 pr-4 mx-1 text-white text-base hover:text-white hover:border-white border-b-2 border-transparent"
                aria-current="page"
              >
                Logout
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
