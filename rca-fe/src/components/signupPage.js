import React from "react";

import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";

function SignupPageComponent() {
  const navigate = useNavigate();

  //   const handleSigninClick = () => {
  //     navigate("/signin");
  //   };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmitClick = async () => {
    if (email && password) {
      try {
        const response = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          console.log("User registered successfully");
          navigate("/signin");
        } else {
          console.error("Error registering user");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="rca-fe-signup-container">
      <div className="rca-fe-form-section-container">
        <div className="rca-fe-sign-title">Get start with RCA</div>
        <div className="rca-fe-email-container">
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Email
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              value={email}
              onChange={handleEmailChange}
            />
          </InputGroup>
        </div>
        <div className="rca-fe-password-container">
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Password
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </InputGroup>
        </div>
      </div>
      <div className="rca-fe-btn-section-container">
        <Button
          className="rca-fe-fw-btn"
          variant="primary"
          size="sm"
          onClick={handleSubmitClick}
          disabled={!email || !password}
        >
          Submit
        </Button>
        <Button
          className="rca-fe-fw-btn"
          variant="outline-primary"
          size="sm"
          onClick={() => navigate("/signin")}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}

export default SignupPageComponent;
