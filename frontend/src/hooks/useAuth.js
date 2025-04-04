import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const navigate = useNavigate();

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

      // Check if the token has expired (assuming 'exp' is in the JWT payload)
      const currentTime = Date.now() / 1000; // JWT 'exp' is in seconds, not milliseconds
      if (decodedToken.exp < currentTime) {
        // Token has expired, clear it and redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      }

      // Optional: You can also check other claims in the JWT, such as user role
      // if (decodedToken.role !== 'admin') {
      //   // Unauthorized role, redirect to a different page or show an error
      //   navigate('/unauthorized');
      // }

    } catch (error) {
      // If JWT is invalid or cannot be decoded, remove it and redirect to login
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);
};

export default useAuth;
