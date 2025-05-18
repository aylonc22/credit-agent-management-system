import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './index.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import backArrow from '../../assets/images/icons/arrow-back.svg';
import user from '../../assets/images/icons/user.svg';
import settings from '../../assets/images/icons/settings.svg';
import listing from '../../assets/images/icons/listing.svg';
import contact from '../../assets/images/icons/contact.svg';
import avatar from '../../assets/images/splash.png';
import dashboard from '../../assets/images/icons/blocks.svg';
import management from '../../assets/images/icons/tables.svg';
import report from '../../assets/images/icons/popup.svg';
import swap from '../../assets/images/icons/swap.svg';

const Navbar = ({isPanelOpen,panelClickHandle}) => {
  const navigate = useNavigate();
  const userData = useAuth(isPanelOpen, panelClickHandle);
  const swiperRef = useRef(null);

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

  const linkLabel = `Add new ${role === 'admin' ? 'agent' : 'client'}`;

  return (<div className="panel panel--left">
   <div className="panel__navigation">
   <Swiper
          slidesPerView={1}
          effect="slide"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          <SwiperSlide>
            <div className="subnav-header">
              <img className="closepanel" onClick={toggleSidebar} src={backArrow} alt="" />
            </div>
            <div className="user-details">
              <div className="user-details__thumb">
                <img src={avatar} alt="" />
              </div>
              <div className="user-details__title">
                <span>Hello</span> {username}
              </div>
            </div>
            <nav className="main-nav">
              <ul>
              
                <li>
                  <Link onClick={toggleSidebar} to="/settings">
                    <img src={settings} alt="" />
                    <span>Settings</span>
                  </Link>
                </li>

                <li onClick={toggleSidebar}>
                <Link to="/generate-payment-links">
                  <img src={management} alt="" />
                  <span>{role !== 'client' ? 'Generate Payment Links' : 'Buy Credits'}</span> 
                </Link>
              </li>

                <li className="subnav opensubnav" onClick={() => swiperRef.current.slideNext()}>
                  <div style={{display:'flex', cursor:'pointer'}}>
                    <img src={listing} alt="" />
                    <span>More Sections</span>
                  </div>
                </li>
                <li>
                  <a href="/contact">
                    <img src={contact} alt="" />
                    <span>Help & Support</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div className="buttons buttons--centered">
              <div onClick={handleLogout} className="button button--main button--small">
                LOGOUT
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="subnav-header backtonav" onClick={() => swiperRef.current.slidePrev()}>
              <img src={backArrow} alt="" />
            </div>
            <nav className="main-nav">
              <ul>

                <li onClick={toggleSidebar}>
                  <Link to="/"> 
                    <img src={dashboard} alt="" />
                    <span>Dashboard</span>
                  </Link>
                </li>

            {(role === 'admin' || role === 'master-agent') && (
              <li onClick={toggleSidebar}><Link to="/agents">
                 <img src={management} alt="" />
                 <span>Agents</span>
                </Link></li>
            )}  

            {role !== 'client' && <li onClick={toggleSidebar}>
              <Link to="/clients">
                <img src={management} alt="" />
                <span>Clients</span>  
              </Link>
            </li>}

            {role !== 'client' && <li onClick={toggleSidebar}>
              <Link to="/transactions">
                <img src={swap} alt="" />
                <span>Transactions</span> 
              </Link>
            </li>}

            {role !== 'client' && (
              <li onClick={toggleSidebar}>
                <Link onClick={handleGenerateLink}>
                 <img src={management} alt="" />
                 <span>{linkLabel}</span>   
                </Link>
              </li>
            )}

            

            {role !== 'client' && <li onClick={toggleSidebar}>
              <Link to="/reports">
                <img src={report} alt="" />
                <span>Reports</span> 
              </Link></li>}

            <li onClick={toggleSidebar}>
              <Link to="/terms">
              <img src={report} alt="" />
              <span>TermsOfUse</span>
              </Link>
            </li>                
                </ul>
            </nav>
          </SwiperSlide>
        </Swiper>
</div>
</div>)
};

export default Navbar;
