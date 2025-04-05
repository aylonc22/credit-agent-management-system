import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isValidPhoneNumber } from 'libphonenumber-js';
import './index.css';
import api from "../../api/axios";

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // default to US or your region
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const phone = `${countryCode}${phoneNumber}`;
     // Validate phone number
    if (!isValidPhoneNumber(phone)) {
      setPhoneError('Please enter a valid phone number');
      return; // Stop form submission
    }

    api.post('/auth/register', { email, name, username, phone, password })
    .then((response) => {
      // Assuming the response contains a JWT token
      localStorage.setItem('token', response.data.token); // Store token

      // Optional: Automatically log the user in (you can skip if you want a redirect instead)
      console.log('User registered and logged in');

      // Redirect to dashboard or login page
      navigate('/'); // or navigate('/login') if you want to redirect to login
    })
    .catch((error) => {
      // Handle API errors
      console.error('Registration failed', error);      
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Create Your Account</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={`input-group phone-group ${phoneError?'error':''}`}>
          <input
            className="country-code"
            type="text"
            placeholder="+1"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            required
          />

          <input
            className="phone-number"
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {phoneError && <p className="error-text">{phoneError}</p>}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
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

          <button type="submit" className="btn">Register</button>
        </form>

        <div className="links">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
