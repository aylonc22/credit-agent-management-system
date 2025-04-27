import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Import pages
import Dashboard from './pages/Dashboard/index';
import Login from './pages/Login/index';
import AgentManagement from './pages/AgentManagement/index';
import ClientManagement from './pages/ClientManagement/index';
import TransactionManagement from './pages/TransactionManagement/index';
import PaymentLinkGenerator from './pages/PaymentLinkGenerator/index';
import Reports from './pages/Reports/index';
import SystemSettings from './pages/SystemSettings/index';
import Navbar from './components/Navbar.js';
import Register from './pages/Register/index.js';
import ForgotPassword from './pages/ForgotPassword/index.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toastify
import Unauthorized from './pages/Unauthorized/index.js';
import ChangePassword from './pages/ChangePassword/index.js';
import TermsOfUse from './pages/TermsOfUse/index.js';
import { useEffect } from 'react';
import PaymentRedirectHandler from './pages/Payment/index.js';

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/change-password' ||
    location.pathname.startsWith('/change-password/') ||
    location.pathname.startsWith('/register/') ||
    location.pathname.startsWith('/payment?');

    useEffect(() => {
      const favicon = document.querySelector("link[rel='icon']");
      if (favicon) {     
        console.log(`${process.env.REACT_APP_SERVER_URL}/uploads/logo.jpg`)   ;
        favicon.href = `${process.env.REACT_APP_SERVER_URL}/uploads/logo.jpg`;
      }
    }, []);

  return (
    <div className={isAuthPage ? 'no-sidebar' : 'app-with-sidebar'}>
      {/* Navigation */}
      {!isAuthPage && <Navbar />}

      {/* Routes */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:agent?" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password/:userId" element={<ChangePassword />} />
          <Route path="/agents" element={<AgentManagement />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/transactions" element={<TransactionManagement />} />
          <Route path="/generate-payment-links" element={<PaymentLinkGenerator />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/terms" element={<TermsOfUse/>} />
          <Route path='/payment' element={<PaymentRedirectHandler/>}/>
        </Routes>
         
         {/* Toast notifications */}
         <ToastContainer
          position="top-left"
          autoClose={5000} // Notification auto close time
          hideProgressBar={false} // Show progress bar
          newestOnTop={false} // Whether the newest notification is on top
          closeOnClick // Allow user to close notifications by clicking
          rtl={true} // Whether to support RTL (Right to Left)
          pauseOnFocusLoss // Pause notifications if user focuses away
          draggable
          pauseOnHover
        />

      </div>
    </div>
  );
}


export default App;
