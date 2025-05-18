import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './index.scss';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import backArrow from '../../assets/images/icons/arrow-back.svg';
import user from '../../assets/images/icons/user.svg';
import settings from '../../assets/images/icons/settings.svg';
import listing from '../../assets/images/icons/listing.svg';
import contact from '../../assets/images/icons/contact.svg';
import avatar from '../../assets/images/splash.png';


const Navbar = ({isPanelOpen,panelClickHandle}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/logo.png'); // Default fallback
  const navigate = useNavigate();
  const userData = useAuth(isPanelOpen, panelClickHandle);

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

  const { role, username } = userData;

  const toggleSidebar = () => panelClickHandle();

  const handleLogout = () => {
    localStorage.removeItem('token');
    panelClickHandle();
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
  return (<div class="panel panel--left">
   <div class="panel__navigation">
      <div class="swiper-wrapper">
<div class="swiper-slide">
<div class="subnav-header"><img className='closepanel' onClick={toggleSidebar} src={backArrow} alt="" title="" /></div>
<div class="user-details">
<div class="user-details__thumb"><img src={avatar} alt="" title=""/></div>
<div class="user-details__title"><span>Hello</span> {username}</div>
</div>
<nav class="main-nav">
<ul>
<li><a href="user-profile.html"><img src={user} alt="" title="" /><span>My Account</span></a></li>
<li><a href="forms.html"><img src={settings} alt="" title="" /><span>Settings</span></a></li>
<li class="subnav opensubnav"><a href="#"><img src={listing} alt="" title="" /><span>More Sections</span></a></li>
<li><a href="contact.html"><img src={contact} alt="" title="" /><span>Help &amp; Support</span></a></li>
</ul>
</nav>
<div class="buttons buttons--centered"><div onClick={handleLogout} class="button button--main button--small">LOGOUT</div></div>
</div>	
{/* <div class="swiper-slide">		
<div class="subnav-header backtonav"><img src={backArrow}  alt="" title="" /></div>
<nav class="main-nav">
<ul>
<li><a href="cards.html"><img src="images/icons/blocks.svg" alt="" title="" /><span>Cards</span></a></li>
<li><a href="sliders.html"><img src="images/icons/slider.svg" alt="" title="" /><span>Sliders</span></a></li>
<li><a href="forms.html"><img src="images/icons/form.svg" alt="" title="" /><span>Forms</span></a></li>
<li><a href="tables.html"><img src="images/icons/tables.svg" alt="" title="" /><span>Tables</span></a></li>
<li><a href="tabs-toggles.html"><img src="images/icons/tabs.svg" alt="" title="" /><span>Tabs</span></a></li>
<li><a href="#" data-popup="social" class="open-popup"><img src="images/icons/love.svg" alt="" title="" /><span>Social</span></a></li>
<li><a href="#" data-popup="notifications" class="open-popup"><img src="images/icons/popup.svg" alt="" title="" /><span>Popups</span></a></li>
<li><a href="#" data-popup="alert" class="open-popup"><img src="images/icons/notifications.svg" alt="" title="" /><span>Notifications</span></a></li>	
</ul>
</nav>
</div> */}
</div>
</div>
</div>)
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
          {role !== 'client' && <li onClick={()=>setIsOpen(false)}><Link to="/reports">דוחות 📈</Link></li>}
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
