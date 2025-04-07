import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import './index.css';
import { toast } from 'react-toastify';

const TermsOfUse = () => {
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(true);

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
    return <div className="terms-container">טוען תנאי שימוש...</div>;
  }

  return (
    <div className="terms-container">
      <h1>תנאי שימוש</h1>
      <div className="terms-text">
        {terms.split('\n').map((line, index) => (
          <p key={index}>{line.trim()}</p>
        ))}
      </div>
    </div>
  );
};

export default TermsOfUse;
