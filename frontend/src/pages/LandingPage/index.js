import React from "react";
//import "./LandingPage.scss";
import splashImage from "../../assets/images/splash.png";
import facebookIcon from "../../assets/images/icons/facebook.svg";
import twitterIcon from "../../assets/images/icons/twitter.svg";
import instagramIcon from "../../assets/images/icons/instagram.svg";

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
            <a href="/signup" className="button button--full button--main">
              Signup
            </a>
          </div>

          <div className="splash__social-login">
            <p>
              <a href="/login">Already Registered? Login here</a>
            </p>
            <div className="splash__social-icons">
              <a href="#" className="icon icon--social">
                <img src={facebookIcon} alt="facebook" />
              </a>
              <a href="#" className="icon icon--social">
                <img src={twitterIcon} alt="twitter" />
              </a>
              <a href="#" className="icon icon--social">
                <img src={instagramIcon} alt="instagram" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;