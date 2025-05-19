import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import './index.css'; // reuse your CSS
import Header from '../../components/Header';

const Contact = ({isPanelOpen, panelClickHandle}) => {
  const userData = useAuth(isPanelOpen, panelClickHandle);
 
  return (
    <>
    <div className={`body-overlay ${isPanelOpen?'active':""}`} style={isPanelOpen? { display: 'block' } : {}}></div>
    <div id="panel-left"/>
    <div className="page page--main">
      <Header flag={false} panelClickHandle={panelClickHandle}/>
      <div className="page__content page__content--with-header">
      <h2 class="page__title">Contact Info</h2>
		  <div class="fieldset">
		  <ul class="custom-listing">
		  <li class="address"><span>Address:</span> New York 23066 / Pacific Street / Brooklyn </li>
		  <li class="email"><span>Email:</span> email@yourwebsite.com </li>
		  <li class="phone"><span>Mobile:</span> +900 456 567 77</li>
		  </ul> 
		</div> 
      </div> 

    </div>
    </>
  );
};

export default Contact;
