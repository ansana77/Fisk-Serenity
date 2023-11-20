import { Navigate } from 'react-router-dom';

const Protected = ({ isLoggedIn, isBusy, children }) => {
  if (!isLoggedIn && !isBusy) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default Protected;
