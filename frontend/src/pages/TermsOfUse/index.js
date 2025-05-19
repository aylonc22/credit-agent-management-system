import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import './index.css';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import useAuth from '../../hooks/useAuth';

const TermsOfUse = ({isPanelOpen, panelClickHandle}) => {
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(true);
  const userData = useAuth(isPanelOpen, panelClickHandle);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await api.get('/settings/general');
        setTerms(response.data.termsOfUse);
      } catch (error) {
        toast.error('שגיאה בטעינת תנאי השימוש');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (loading) {
    return <div>טוען תנאי שימוש...</div>;
  }

  return (
    <>
    <div className={`body-overlay ${isPanelOpen?'active':""}`} style={isPanelOpen? { display: 'block' } : {}}></div>
    <div id="panel-left"/>
    <div className="page page--main">
      <Header flag={false} panelClickHandle={panelClickHandle}/>
      <div className="page__content page__content--with-header">
      <h2 className="page__title">Terms Of Use</h2>
		  <div className='tabs  tabs--style1 mb-20'>
      <input style={{display:'none'}} type="radio" name="tabs3" readOnly className="tabs__radio" id="tab3" checked="checked"/>
			<label style={{display:'none'}} className="tabs__label tabs__label--13" >Tab 01</label>	
      <div className="tabs__content">
		  <p>
      {terms.split('\n').map((line, index) => (
        <label key={index}>{line.trim()}</label>
      ))}
      </p>
      </div>
		</div> 
      </div> 
    </div>
    </>
  );
};

export default TermsOfUse;
