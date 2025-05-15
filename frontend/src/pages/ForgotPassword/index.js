import React, { useState } from "react";
import './index.scss';
import api from "../../api/axios";
import { toast } from "react-toastify";
import Header from "../../components/Header";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    // Simple email validation regex
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();   
    // Basic validation check before submission
    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setEmailError(''); // Clear any previous error messages

    try {
      await api.post("/auth/request-password-reset", { email });
      toast.success("Password reset link was sent to your email.");
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Failed to send reset link. Please check your email and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page--login" data-page="login">
       <Header flag={true}/>

      <div className="login">
        <div className="login__content">
          <h2 className="login__title">WE GOT YOU COVERED</h2>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="login-form__row">
                <label className="login-form__label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="login-form__input required email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <label className="error">{emailError}</label>} {/* Display error message */}
              </div>

              <div className="login-form__row">
                <input
                  type="submit"
                  className="login-form__submit button button--main button--full"
                  value={isSubmitting ? "Sending..." : "RESEND PASSWORD"}
                  disabled={isSubmitting}
                />
              </div>
            </form>

            <div className="login-form__bottom">
              <p>Check your email and follow the instructions to reset your password.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
