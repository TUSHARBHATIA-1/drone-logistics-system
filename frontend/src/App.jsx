import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DroneManagement from './pages/DroneManagement';
import Assignments from './pages/Assignments';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import DroneMonitoring from './pages/DroneMonitoring';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Landing from './pages/Landing';
import CompanySetup from './pages/CompanySetup';

import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Footer from './components/Footer';
import EmergencyOverlay from './components/EmergencyOverlay';

import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';

import { AnimatePresence, motion } from 'framer-motion';
import API from './services/api';

function AppContent() {
  const [emergencyData, setEmergencyData] = useState(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // ── Guard: never run on the setup page (prevents redirect loop)
    const SETUP_PATH = '/setup-company';
    if (!token || location.pathname === SETUP_PATH) return;

    const checkSetup = async () => {
      try {
        // Uses the shared axios instance — JWT is injected by the request interceptor
        const { data } = await API.get('/company/profile');

        // Profile found → user already set up, nothing to do
        if (data.success) {
          console.log('[App] Company profile found — setup not needed');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // Profile doesn't exist yet → redirect to setup
          console.log('[App] No company profile → redirecting to setup');
          navigate(SETUP_PATH, { replace: true });
        } else if (err.response?.status === 401) {
          // Token invalid/expired — interceptor handles logout+redirect
          console.warn('[App] Token rejected by server');
        } else {
          // Network error or other — do NOT redirect, stay on current page
          console.error('[App] Setup check failed (non-blocking):', err.message);
        }
      }
    };

    checkSetup();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // run only when token changes

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-dark-950 text-dark-50 flex flex-col selection:bg-primary-500/30">

      {/* Emergency UI */}
      <EmergencyOverlay
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        data={emergencyData}
      />

      {/* Cart */}
      <Cart />

      {/* Navbar */}
      {token && <Navbar />}

      {/* Main Content */}
      <main className={`flex-1 flex flex-col overflow-x-hidden ${token ? 'pt-[96px] p-4 md:p-10' : ''}`}>
        <div className="flex-1 w-full">

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

              {/* Public Routes */}
              <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>} />
              <Route path="/drones" element={<PrivateRoute><PageWrapper><DroneManagement /></PageWrapper></PrivateRoute>} />
              <Route path="/assignments" element={<PrivateRoute><PageWrapper><Assignments /></PageWrapper></PrivateRoute>} />
              <Route path="/marketplace" element={<PrivateRoute><PageWrapper><Marketplace /></PageWrapper></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><PageWrapper><Profile /></PageWrapper></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><PageWrapper><Notifications /></PageWrapper></PrivateRoute>} />
              <Route path="/monitoring" element={<PrivateRoute><PageWrapper><DroneMonitoring /></PageWrapper></PrivateRoute>} />
              <Route path="/payment" element={<PrivateRoute><PageWrapper><Payment /></PageWrapper></PrivateRoute>} />
              <Route path="/success" element={<PrivateRoute><PageWrapper><Success /></PageWrapper></PrivateRoute>} />
              <Route path="/setup-company" element={<PrivateRoute><PageWrapper><CompanySetup /></PageWrapper></PrivateRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </AnimatePresence>

        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;