import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Footer from './components/Footer';
import EmergencyOverlay from './components/EmergencyOverlay';
import { AlertTriangle } from 'lucide-react';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import { AnimatePresence, motion } from 'framer-motion';

function AppContent() {
  const [emergencyData, setEmergencyData] = useState(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const { token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.triggerEmergencyUI = (data) => {
      setEmergencyData(data);
      setIsEmergencyOpen(true);
    };
  }, []);

  try {
    return (
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-dark-950 text-dark-50 flex flex-col selection:bg-primary-500/30">
      <EmergencyOverlay
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        data={emergencyData}
      />
      <Cart />

      {token && <Navbar />}

      <main className={`flex-1 flex flex-col overflow-x-hidden ${token ? 'pt-[96px] p-6 md:p-10' : ''}`}>
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

              <Route
                path="/dashboard"
                element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>}
              />
              <Route
                path="/drones"
                element={<PrivateRoute><PageWrapper><DroneManagement /></PageWrapper></PrivateRoute>}
              />
              <Route
                path="/assignments"
                element={<PrivateRoute><PageWrapper><Assignments /></PageWrapper></PrivateRoute>}
              />
              <Route
                path="/marketplace"
                element={<PrivateRoute><PageWrapper><Marketplace /></PageWrapper></PrivateRoute>}
              />
              <Route
                path="/profile"
                element={<PrivateRoute><PageWrapper><Profile /></PageWrapper></PrivateRoute>}
              />
              <Route
                path="/notifications"
                element={<PrivateRoute><PageWrapper><Notifications /></PageWrapper></PrivateRoute>}
              />
              <Route
                path="/monitoring"
                element={<PrivateRoute><PageWrapper><DroneMonitoring /></PageWrapper></PrivateRoute>}
              />
              <Route
                path="/payment"
                element={<PrivateRoute><PageWrapper><Payment /></PageWrapper></PrivateRoute>}
              />
              <Route
                path="/success"
                element={<PrivateRoute><PageWrapper><Success /></PageWrapper></PrivateRoute>}
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </div>
        <Footer />
      </main>
      </div>
    );
  } catch (err) {
    console.error("Global Render Error:", err);
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-red-600/20 rounded-3xl flex items-center justify-center border border-red-500/30 mb-8 animate-pulse">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Core System Critical Failure</h1>
        <p className="text-dark-400 max-w-md mx-auto mb-10 font-medium">The SkyLogist AI backbone has encountered an unrecoverable structural telemetry collapse.</p>
        <button onClick={() => window.location.reload()} className="btn-primary px-10 py-4 rounded-2xl">Re-initialize Core Uplink</button>
      </div>
    );
  }
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="h-full w-full"
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
