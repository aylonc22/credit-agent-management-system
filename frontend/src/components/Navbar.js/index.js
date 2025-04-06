import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css'; // Sidebar styling
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle mobile sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userData = useAuth();

  // If user data is not yet loaded, show loading (or redirect logic)
  if (!userData) {
    return <div>טוען...</div>;
  }

  const { role } = userData;

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar navigation */}
      <div className={`sidenav ${isOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link to="/">לוח בקרה 📊</Link>
          </li>
          {role === 'admin' && (
            <li>
              <Link to="/agents">ניהול סוכנים 🧑‍💼</Link>
            </li>
          )}
          {role !== 'client' && 
          (<li>
            <Link to="/clients">ניהול לקוחות 👥</Link>
          </li>
          )}
          <li>
            <Link to="/transactions">ניהול עסקאות 💸</Link>
          </li>
          <li>
            <Link to="/payment-links">יצירת קישורי תשלום 🔗</Link>
          </li>
          <li>
            <Link to="/reports">דוחות 📈</Link>
          </li>
          <li>
            <Link to="/settings">הגדרות מערכת ⚙️</Link>
          </li>
          <li className="logout">
            <button onClick={handleLogout}>התנתק 🔌</button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
