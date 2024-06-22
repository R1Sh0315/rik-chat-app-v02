import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setAuthToken(token);
    setUsername(username);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUsername(null);
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
    <AuthContext.Provider value={{ authToken, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
