import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/signin');
  };

//   useEffect(() => {
//     if (!authToken) {
//       navigate('/signin' || '/signup');
//     } else {
//       navigate('/dashboard');
//     }
//   }, [authToken, navigate]);

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
