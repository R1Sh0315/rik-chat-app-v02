import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';

function ProtectedRoute({ children }) {
  const { authToken } = useContext(AuthContext);

  if (!authToken) {
    return <Navigate to="/signin" />;
  }

  return children;
}

export default ProtectedRoute;
