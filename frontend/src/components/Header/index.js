import React from 'react';
import './index.scss';
import backArrow from '../../assets/images/icons/arrow-back.svg';
import user from '../../assets/images/icons/user.svg';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ flag }) => {
  const location = useLocation();

  // If on /login, redirect back arrow to /landing instead of /login
  const backLink = location.pathname === '/forgot-password' ? '/login' : '/landing';

  if (flag) {
    return (
      <header className="header header--fixed">
        <div className="header__inner">
          <div className="header__icon">
            <Link to={backLink}>
              <img src={backArrow} alt="Back" />
            </Link>
          </div>
        </div>
      </header>
    );
  } else {
    return (
      <header className="header header--fixed">
        <div className="header__inner">
          <div className="header__logo header__logo--text">
            <a href="index.html">
              Pay<strong>glow</strong>
            </a>
          </div>
          <div className="header__icon open-panel" data-panel="left">
            <img src={user} alt="image" title="image" />
          </div>
        </div>
      </header>
    );
  }
};

export default Header;
