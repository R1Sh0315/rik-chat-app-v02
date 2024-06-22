import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SigninPageComponent from "./components/signinPage";
import SignupPageComponent from "./components/signupPage";
import DashboardComponent from "./components/dashboardPage";
import { AuthProvider } from "./service/AuthContext";
import ProtectedRoute from './service/ProtectedRoute'

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <div className="right-section">Rik Chat App</div>
          <div className="left-section">
            <Routes>
              <Route path="/" element={<SignupPageComponent />} />
              <Route path="/signup" element={<SignupPageComponent />} />
              <Route path="/signin" element={<SigninPageComponent />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardComponent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
