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

  // Handle sidebar open/close based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsOpen(true); // Desktop = open
      } else {
        setIsOpen(false); // Mobile = closed
      }
    };

    handleResize(); // run on mount
    window.addEventListener('resize', handleResize); // run on resize

    return () => window.removeEventListener('resize', handleResize);
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
          <li onClick={()=>setIsOpen(false)}><Link to="/">לוח בקרה 📊</Link></li>
          {(role === 'admin' || role === 'master-agent') && (
            <li onClick={()=>setIsOpen(false)}><Link to="/agents">ניהול סוכנים 🧑‍💼</Link></li>
          )}
          {role !== 'client' && (
            <li onClick={()=>setIsOpen(false)}>
              <Link onClick={handleGenerateLink} className="quick-link-button">
                {linkLabel}
              </Link>
            </li>
          )}
          {role !== 'client' && <li onClick={()=>setIsOpen(false)}><Link to="/clients">ניהול לקוחות 👥</Link></li>}
          {role !== 'client' && <li onClick={()=>setIsOpen(false)}><Link to="/transactions">ניהול עסקאות 💸</Link></li>}
          <li onClick={()=>setIsOpen(false)}><Link to="/generate-payment-links">{role !== 'client' ? 'יצירת קישורי תשלום 🔗' : 'קניית קרדיטים 🪙'}</Link></li>
          <li onClick={()=>setIsOpen(false)}><Link to="/reports">דוחות 📈</Link></li>
          <li onClick={()=>setIsOpen(false)}><Link to="/settings">הגדרות מערכת ⚙️</Link></li>
          <li className="logout">
            <button onClick={handleLogout}>התנתק 🔌</button>
          </li>
          <li onClick={()=>setIsOpen(false)} className="terms-link">
            <Link to="/terms">תנאי שימוש</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
