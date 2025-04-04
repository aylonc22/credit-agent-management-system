import React, { useState } from "react";
import './index.css';
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password submitted", { email });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Reset Your Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">Send Reset Link</button>
        </form>

        <div className="links">
          Remembered your password? <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
