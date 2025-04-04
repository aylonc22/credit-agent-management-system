// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import the CSS for styling

const Navbar = () => {
  return (
    <div className="sidenav">
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/agents">Agent Management</Link>
        </li>
        <li>
          <Link to="/clients">Client Management</Link>
        </li>
        <li>
          <Link to="/transactions">Transaction Management</Link>
        </li>
        <li>
          <Link to="/payment-links">Payment Link Generator</Link>
        </li>
        <li>
          <Link to="/reports">Reports</Link>
        </li>
        <li>
          <Link to="/settings">System Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
