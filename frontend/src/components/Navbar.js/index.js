import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css'; // Import the CSS for styling

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar visibility
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidenav ${isOpen ? 'active' : ''}`}>
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
          <li className="logout">
            <button onClick={handleLogout}>Disconnect🔌</button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
