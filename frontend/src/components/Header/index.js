import React from 'react';
import './index.scss';
import backArrow from '../../assets/images/icons/arrow-back.svg';
import { Link } from 'react-router-dom';


//flag is for flagging the need for a real header of for the authentication header
const Header = ({flag})=>{
   
    if(flag){
        return (<header className="header header--fixed">
                <div className="header__inner">
                  <div className="header__icon">
                    <Link to="/login"><img src={backArrow} alt="Back" /></Link>
                  </div>
                </div>
              </header>);
    }else{
        return(
            <header className="header header--fixed">	
                <div className="header__inner">	
                    <div className="header__logo header__logo--text"><a href="index.html">Pay<strong>glow</strong></a></div>	
                    <div className="header__icon open-panel" data-panel="left"><img src="images/icons/user.svg" alt="image" title="image"/></div>
                </div>
            </header> )
    }
}

export default Header;