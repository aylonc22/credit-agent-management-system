import React from "react";
import "./index.scss";
import splashImage from "../../assets/images/splash.png";
import facebookIcon from "../../assets/images/icons/facebook.svg";
import twitterIcon from "../../assets/images/icons/twitter.svg";
import instagramIcon from "../../assets/images/icons/instagram.svg";
import { Link } from "react-router-dom";

const LandingPage = () => {
    
  return (
    <div className="page page--splash" data-page="splash">
      <div className="splash">
        <div className="splash__content">
          <div className="splash__logo">
            Pay<strong>glow</strong>
          </div>

          <div className="splash__image">
            <img src={splashImage} alt="splash" />
          </div>

          <div className="splash__text">
            Payglow is your favourite Crypto Exchange Wallet
          </div>

          <div className="splash__buttons">
            <Link to="/register" className="button button--full button--main">
              Signup
            </Link>
          </div>

          <div className="splash__social-login">
            <p>
              <Link to="/login">Already Registered? Login here</Link>
            </p>
            <div className="splash__social-icons">
              <Link to="https://www.facebook.com/" className="icon icon--social">
                <img src={facebookIcon} alt="facebook" />
              </Link>
              <Link to="https://www.twitter.com/" className="icon icon--social">
                <img src={twitterIcon} alt="twitter" />
              </Link>
              <Link to="https://www.instagram.com/" className="icon icon--social">
                <img src={instagramIcon} alt="instagram" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;