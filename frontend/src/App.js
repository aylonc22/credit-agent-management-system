import './styles/main.scss';
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
import Navbar from './components/Navbar.js/index.js';
import Register from './pages/Register/index.js';
import ForgotPassword from './pages/ForgotPassword/index.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toastify
import Unauthorized from './pages/Unauthorized/index.js';
import ChangePassword from './pages/ChangePassword/index.js';
import TermsOfUse from './pages/TermsOfUse/index.js';
import PaymentRedirectHandler from './pages/Payment/index.js';
import LandingPage from './pages/LandingPage/index.js';
import { useState } from 'react';

function App() {
  const [isPanelOpen , setIsPanelOpen ] = useState(false);

  const panelClickHandle = ()=>{   
    setIsPanelOpen(state=>!state);
  }  
 
  return (
    <div>
      {/* Routes */}
      <div className={`panel-closing ${isPanelOpen?"with-panel-left-reveal":""}`}>
        {/* Navigation */}
        { isPanelOpen && <Navbar isPanelOpen={isPanelOpen} panelClickHandle={panelClickHandle}/>}
        <Routes>
          <Route path="/" element={<Dashboard isPanelOpen={isPanelOpen} panelClickHandle={panelClickHandle}/>} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:agent?" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password/:userId" element={<ChangePassword />} />
          <Route path="/agents" element={<AgentManagement  isPanelOpen={isPanelOpen} panelClickHandle={panelClickHandle} />} />
          <Route path="/clients" element={<ClientManagement  isPanelOpen={isPanelOpen} panelClickHandle={panelClickHandle} />} />
          <Route path="/transactions" element={<TransactionManagement isPanelOpen={isPanelOpen} panelClickHandle={panelClickHandle} />} />
          <Route path="/generate-payment-links" element={<PaymentLinkGenerator  isPanelOpen={isPanelOpen} panelClickHandle={panelClickHandle} />} />
          <Route path="/reports" element={<Reports  isPanelOpen={isPanelOpen} panelClickHandle={panelClickHandle} />} />
          <Route path="/settings" element={<SystemSettings isPanelOpen={isPanelOpen} panelClickHandle={panelClickHandle}  />} />
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
