import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Make sure to import jwtDecode

const useAuth = (requiredRole) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // State to store the decoded JWT

  useEffect(() => {
    const token = localStorage.getItem('token'); // You can use sessionStorage if needed

    if (!token) {
      // If no token is found, redirect to login
      navigate('/login');
      return;
    }

    try {
      // Decode the JWT token
      const decodedToken = jwtDecode(token);
           
      setUserData(decodedToken); // Store decoded JWT content
           
      // Check if the token has expired (assuming 'exp' is in the JWT payload)
      const currentTime = Date.now() / 1000; // JWT 'exp' is in seconds, not milliseconds
      if (decodedToken.exp < currentTime) {
        // Token has expired, clear it and redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      }

      // Check if the user's role matches the required role
      if ((requiredRole && decodedToken.role !== requiredRole && decodedToken.role !== 'admin') && !(requiredRole === 'agent' && decodedToken.role === 'master-agent') ) {
        // Unauthorized role, redirect to unauthorized page
        navigate('/unauthorized');
      }

    } catch (error) {
      // If JWT is invalid or cannot be decoded, remove it and redirect to login
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate, requiredRole]);

  // Return the decoded user data (e.g., the content of the JWT)
  return userData;
};

export default useAuth;
