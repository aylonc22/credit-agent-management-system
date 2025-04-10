import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './index.css';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/logo.png'); // Default fallback
  const navigate = useNavigate();

  const userData = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings/general');
        if (response.data?.logo) {
          setLogoUrl(response.data.logo);         
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
  }, []);

  if (!userData) {
    return <div>טוען...</div>;
  }

  const { role } = userData;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleGenerateLink = async () => {
    try {
      const response = await api.post(`/auth/generate-link/${role === 'admin' ? 'agent' : 'client'}`);
      await navigator.clipboard.writeText(response.data.link);
      toast.success('הקישור הועתק ללוח');
    } catch (e) {
      toast.error('שגיאה ביצירת הקישור');
    }
  };

  const linkLabel = `הוסף ${role === 'admin' ? 'סוכן' : 'לקוח'} חדש ➕`;

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>☰</button>

      <div className={`sidenav ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-logo-container">
          <img src={logoUrl} alt="Logo" className="sidebar-logo" />
        </div>
        <ul>
          <li><Link to="/">לוח בקרה 📊</Link></li>
          {(role === 'admin' || role === 'master-agent') && (
            <li><Link to="/agents">ניהול סוכנים 🧑‍💼</Link></li>
          )}
          {role !== 'client' && (
            <li>
              <Link onClick={handleGenerateLink} className="quick-link-button">
                {linkLabel}
              </Link>
            </li>
          )}
          {role !== 'client' && <li><Link to="/clients">ניהול לקוחות 👥</Link></li>}
          <li><Link to="/transactions">ניהול עסקאות 💸</Link></li>
          <li><Link to="/payment-links">יצירת קישורי תשלום 🔗</Link></li>
          <li><Link to="/reports">דוחות 📈</Link></li>
          <li><Link to="/settings">הגדרות מערכת ⚙️</Link></li>
          <li className="logout">
            <button onClick={handleLogout}>התנתק 🔌</button>
          </li>
          <li className="terms-link">
            <Link to="/terms">תנאי שימוש</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
