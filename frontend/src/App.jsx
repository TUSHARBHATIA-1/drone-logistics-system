import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DroneManagement from './pages/DroneManagement';
import Assignments from './pages/Assignments';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import DroneMonitoring from './pages/DroneMonitoring';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import EmergencyOverlay from './components/EmergencyOverlay';

function App() {
  const [emergencyData, setEmergencyData] = useState(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  useEffect(() => {
    window.triggerEmergencyUI = (data) => {
      setEmergencyData(data);
      setIsEmergencyOpen(true);
    };
  }, []);

  const isAuthenticated = true; // Placeholder for auth logic

  return (
    <Router>
      <div className="flex min-h-screen bg-dark-950 text-dark-50">
        <EmergencyOverlay 
          isOpen={isEmergencyOpen} 
          onClose={() => setIsEmergencyOpen(false)} 
          data={emergencyData} 
        />
        <Cart />
        {isAuthenticated && <Sidebar />}
        <div className="flex-1 flex flex-col">
          {isAuthenticated && <Navbar />}
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/drones" 
                element={isAuthenticated ? <DroneManagement /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/assignments" 
                element={isAuthenticated ? <Assignments /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/marketplace" 
                element={isAuthenticated ? <Marketplace /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/profile" 
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/notifications" 
                element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/monitoring" 
                element={isAuthenticated ? <DroneMonitoring /> : <Navigate to="/login" />} 
              />
              
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
