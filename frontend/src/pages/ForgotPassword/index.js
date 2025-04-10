import React, { useState } from "react";
import './index.css';
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/request-password-reset", { email });
      toast.success("קישור לאיפוס סיסמה נשלח לדוא\"ל שלך");
    } catch (error) {
      console.error("שגיאה בשליחת קישור איפוס:", error);
      toast.error("שגיאה בשליחת קישור. בדוק את הדוא\"ל ונסה שוב.");
    }
  };

  return (
    <div className="login-container" dir="rtl">
      <div className="login-box">
        <h2>איפוס סיסמה</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder='הזן את כתובת הדוא\"ל שלך'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">שלח קישור איפוס</button>
        </form>

        <div className="links">
          נזכרת בסיסמה? <Link to="/login">חזור להתחברות</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
