// src/pages/Unauthorized/index.js

import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import styling for this page

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h2>גישה לא מורשית</h2> {/* Unauthorized Access */}
        <p>אין לך הרשאה לצפות בדף זה.</p> {/* You do not have permission to view this page. */}
        <Link to="/settings" className="btn">מעבר להגדרות</Link> {/* Go to Settings */}
      </div>
    </div>
  );
};

export default Unauthorized;
