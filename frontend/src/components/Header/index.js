import React, { useEffect, useState } from 'react';
import './index.scss';
import backArrow from '../../assets/images/icons/arrow-back.svg';
import user from '../../assets/images/icons/user.svg';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ flag, panelClickHandle }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const contentEl = document.querySelector('.page__content');

    if (!contentEl) return;

    const handleScroll = () => {
      const windowTop = contentEl.scrollTop;
      const bodyTop = document.body.offsetTop;

      setScrolled(windowTop > bodyTop);
    };

    contentEl.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check on mount

    return () => contentEl.removeEventListener('scroll', handleScroll);
  }, []);

  const backLink = location.pathname === '/forgot-password' ? '/login' : '/landing';

  const headerClass = `header header--fixed${scrolled ? ' header--page' : ''}`;

  return (
    <header className={headerClass}>
      <div className="header__inner">
        {flag ? (
          <div className="header__icon">
            <Link to={backLink}>
              <img src={backArrow} alt="Back" />
            </Link>
          </div>
        ) : (
          <>
            <div className="header__logo header__logo--text">
              <a href="index.html">
                Pay<strong>glow</strong>
              </a>
            </div>
            <div onClick={()=> panelClickHandle()} className="header__icon open-panel" data-panel="left">
              <img src={user} alt="image" title="image" />
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
