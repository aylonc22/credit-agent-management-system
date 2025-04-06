import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import './index.css';
import api from "../../api/axios";
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inviteToken, setInviteToken] = useState(null);

  const navigate = useNavigate();
  const { agent } = useParams(); // For agent-based registration
  const location = useLocation(); // To check for inviteToken query

  // Check for inviteToken in URL query string
  useEffect(() => {  
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');  
    if (token) {
      api.get(`/auth/generate-link/${token}`).then(res=>{
        api.put(`/auth/generate-link/${token}`).then(()=> setInviteToken(token));
      }).catch(error=>{
        const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : 'ההרשמה נכשלה. אנא נסה שוב.'; // Default message if no specific error is returned
    
      toast.error(errorMessage); // Show the error message in the toast
      navigate('/register');
      })
     
    }
  }, [location]);

  // Handle registration form submission
  const handleRegister = (e) => {
    e.preventDefault();

    const registrationData = { email, name, username, password };

    // If inviteToken is present, send it with the registration request
    if (inviteToken) {
      registrationData.inviteToken = inviteToken;
    }

    // Prepare the API request URL, including the agentId as a URL parameter
    let url = '/auth/register';
    if (agent) {
      url = `/auth/register/${agent}`;  // Use the agent ID in the URL as a param
    }

    api.post(url, registrationData)
      .then((response) => {
        // Store token
        localStorage.setItem('token', response.data.token);
        toast.success('ההרשמה הצליחה! ברוך הבא.');
        navigate('/');
      })
      .catch((error) => {
        console.error('Registration failed', error);
       // Check if the error response contains a message from the server
      const errorMessage = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : 'ההרשמה נכשלה. אנא נסה שוב.'; // Default message if no specific error is returned
    
      toast.error(errorMessage); // Show the error message in the toast
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>צור חשבון חדש</h2>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder="שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="שם מלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="צור סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "הסתר" : "הצג"}
            </span>
          </div>

          <button type="submit" className="btn">הירשם</button>
        </form>

        {!inviteToken && <div className="links">
          כבר יש לך חשבון? <Link to="/login">התחבר</Link>
        </div>}
      </div>
    </div>
  );
};

export default Register;
