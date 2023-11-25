import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login/Login';
import Signup from './Login/Signup';
import NotFound from './NotFound';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Logout from './Logout';
import Protected from './Protected';
import Forum from './Forum/Forum';
import StudentAppointments from './Appointments/StudentAppointments';

const Body = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    setIsLoggedIn(
      localStorage.token &&
        jwt_decode(localStorage.token).exp * 1000 > Date.now()
    );
    setIsBusy(false);
  }, []);
  return (
    !isBusy && (
      <div className="Body">
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <LandingPage /> : <Login />}
          />
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/signup"
            element={isLoggedIn ? <LandingPage /> : <Signup />}
          />
          <Route
            path="/talk"
            element={
              <Protected isLoggedIn={isLoggedIn} isBusy={isBusy}>
                <Forum />
              </Protected>
            }
          />

          <Route
            path="/appointments"
            element={
              <Protected isLoggedIn={isLoggedIn} isBusy={isBusy}>
                <StudentAppointments />
              </Protected>
            }
          />
          {/* 
          <Route
            path="/profile"
            element={
              <Protected isLoggedIn={isLoggedIn} isBusy={isBusy}>
                <Profile />
              </Protected>
            }
          />
          <Route path="/success/:amount" element={<SuccessPage />} /> */}
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    )
  );
};

export default Body;
