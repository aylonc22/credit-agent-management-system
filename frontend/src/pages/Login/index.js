import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './index.css';
import api from "../../api/axios";
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate login logic
    console.log("Login submitted", { username, password });
    try{
      const res = await api.post('/auth/login',{username, password});
      // Store token in local storage and redirect
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      navigate('/');
    }
    catch(e){
        console.error('Login error:', e);
        toast.error('Login failed. Please try again.');
    }
    
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Your Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="username"
              placeholder="Enter your user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit" className="btn">Login</button>
        </form>

        <div className="links">
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
