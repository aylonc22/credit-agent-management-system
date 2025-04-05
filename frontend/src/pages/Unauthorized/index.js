// src/pages/Unauthorized/index.js

import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import styling for this page

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h2>Unauthorized Access</h2>
        <p>You do not have permission to view this page.</p>
        <Link to="/settings" className="btn">Go to Settings</Link>
      </div>
    </div>
  );
};

export default Unauthorized;
