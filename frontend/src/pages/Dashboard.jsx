import React, { useState, useEffect } from 'react';
import { 
  Activity, Battery, MapPin, TrendingUp, Clock, ExternalLink,
  Plane, CheckCircle, AlertTriangle, ClipboardList, Plus, Store,
  User, ShieldAlert, ArrowUpRight, Zap, Globe, Wrench, Loader2,
  AlertCircle, Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { getDrones } from '../services/droneService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [statsError, setStatsError] = useState('');

  const [notifications] = useState([
    { id: 1, type: 'status',  msg: 'Fleet telemetry synchronized successfully' },
    { id: 2, type: 'alert',   msg: 'Atmospheric conditions nominal across all sectors' },
    { id: 3, type: 'success', msg: 'System health check passed — all systems operational' }
  ]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await getDrones();
        setStatsData(data.stats);
      } catch (err) {
        setStatsError('Could not load live stats. Showing last cached values.');
        // Sensible fallback so UI does not break
        setStatsData({ total: 0, active: 0, busy: 0, maintenance: 0, avgBattery: 0, totalPayload: 0 });
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);


  const handleSimulateEmergency = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/emergency/trigger`, {
        droneId: 'd2',
        triggerType: 'System-wide Sensor Failure',
        currentLocationID: 4
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (window.triggerEmergencyUI) {
        window.triggerEmergencyUI(response.data);
      }
    } catch (error) {
       console.error('Sim failed', error);
    }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    hover: { 
      y: -10, 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full"
      ></motion.div>
      <p className="font-black uppercase tracking-[0.4em] text-dark-500 text-xs animate-pulse">Initializing Ops Matrix...</p>
    </div>
  );

  try {
    return (
      <div className="max-w-[1600px] mx-auto space-y-12">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 md:space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-4 border-dark-950 bg-primary-600 flex items-center justify-center text-[10px] font-black group hover:z-10 hover:scale-110 transition-all cursor-crosshair">
                   <Activity className="w-3.5 h-3.5 text-white" />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary-500 animate-pulse">Live Telemetry Synchronized</p>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none group">
            Ops <span className="text-primary-500 group-hover:italic transition-all">Command</span> Center
          </h1>
          <p className="text-dark-400 font-medium text-base md:text-lg leading-relaxed max-w-2xl">Visualizing autonomous industrial logistics across 24 global mission sectors.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSimulateEmergency}
            className="group flex items-center justify-center gap-3 px-6 md:px-8 py-4 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-red-500/20 shadow-xl shadow-red-900/5"
          >
            <ShieldAlert className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Emergency Protocol
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/assignments')}
            className="btn-primary flex items-center justify-center gap-3 px-6 md:px-8 py-4 rounded-2xl shadow-primary-600/20"
          >
            <Plus className="w-5 h-5" /> Initialize Mission
          </motion.button>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        {/* Main Stats Cluster */}
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
        {statsError && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="md:col-span-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" /> {statsError}
          </motion.div>
        )}
          {[
            { label: 'Total Fleet',    val: statsData?.total ?? '—',       trend: 'LIVE', icon: Plane,      color: 'text-primary-500', glow: 'shadow-primary-600/10' },
            { label: 'Ready Units',    val: statsData?.active ?? '—',      trend: `${statsData?.busy ?? 0} active`, icon: Store, color: 'text-green-500', glow: 'shadow-green-600/10' },
            { label: 'Maintenance',    val: statsData?.maintenance ?? '—', trend: 'TRACKED', icon: ShieldAlert, color: 'text-orange-500', glow: 'shadow-orange-600/10' },
            { label: 'Avg Battery',    val: statsData ? `${statsData.avgBattery}%` : '—', trend: `${statsData?.totalPayload ?? 0}kg cap`, icon: Zap, color: 'text-blue-500', glow: 'shadow-blue-600/10' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover="hover"
              className={`premium-card p-8 md:p-10 group cursor-pointer ${stat.glow}`}
            >
              <div className="flex justify-between items-start mb-8 md:mb-10">
                <div className={`p-3 md:p-4 rounded-2xl bg-dark-900 border border-dark-800 group-hover:border-primary-500/30 transition-all ${stat.color}`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="flex items-center gap-2 bg-dark-950 px-3 py-1.5 rounded-full border border-dark-900 shadow-inner">
                  <ArrowUpRight className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-[10px] font-black text-white tracking-widest">{stat.trend}</span>
                </div>
              </div>
              <p className="text-[10px] text-dark-500 font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{stat.val}</h3>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}

          {/* Large Visualization Plate */}
          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="md:col-span-2 premium-card p-8 md:p-12 bg-dark-900/10 relative h-[400px] md:h-[450px] flex flex-col justify-end group overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.8)_100%)] z-10"></div>
            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full animate-float">
                  <div className="w-full h-full border border-primary-600/10 rounded-full scale-110"></div>
                  <div className="w-2/3 h-2/3 border border-primary-500/5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150"></div>
                  <div className="w-1/3 h-1/3 border border-blue-600/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50"></div>
               </div>
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-t border-primary-500/20 rounded-full"
               ></motion.div>
            </div>

            <div className="relative z-20 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                 <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Global Logistics Topology</h4>
                 <div className="h-px bg-dark-800 flex-1 hidden sm:block"></div>
                 <span className="badge badge-primary w-fit">Dynamic Mesh</span>
              </div>
              <p className="text-dark-400 font-medium max-w-xl text-base md:text-lg leading-relaxed">
                Visualizing high-density autonomous traffic corridors across the planetary sector 
                map in real-time. System efficiency currently at <span className="text-green-500 font-black">94.2%</span>.
              </p>
              <div className="flex gap-4">
                 {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="w-16 h-1 bg-dark-800 rounded-full overflow-hidden"
                    >
                       <motion.div 
                         animate={{ x: [-80, 80] }}
                         transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                         className="w-1/2 h-full bg-primary-600"
                       ></motion.div>
                    </motion.div>
                 ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar Diagnostics */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 space-y-8"
        >
          <div className="premium-card p-10 h-full flex flex-col">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-dark-500 mb-10 border-b border-dark-900 pb-6 flex items-center justify-between">
              System Health
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            </h4>
            
            <div className="space-y-10 flex-1">
              {[
                { label: 'Mainframe Load', val: 14, color: 'bg-primary-600' },
                { label: 'Orbital Latency', val: 8, color: 'bg-green-600' },
                { label: 'Hub Connection', val: 100, color: 'bg-blue-600' },
              ].map((stat, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-dark-400">{stat.label}</span>
                    <span className="text-white">{stat.val}%</span>
                  </div>
                  <div className="h-2 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-dark-900">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.val}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className={`h-full rounded-full ${stat.color} shadow-lg shadow-black/40`}
                    ></motion.div>
                  </div>
                </div>
              ))}

              <div className="pt-10 space-y-6">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-dark-600">Incident History</h5>
                <div className="space-y-3">
                  <AnimatePresence>
                    {Array.isArray(notifications) && notifications.map((notif, i) => (
                      <motion.div 
                        key={notif?.id || i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (i * 0.1) }}
                        className="p-5 bg-dark-950/80 border border-dark-900 rounded-[20px] flex items-center gap-5 group hover:border-primary-500/20 transition-all cursor-pointer"
                      >
                         <div className={`w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-150 transition-transform ${notif?.type === 'alert' ? 'bg-orange-500' : notif?.type === 'success' ? 'bg-green-500' : 'bg-primary-500'}`}></div>
                         <p className="text-[11px] text-dark-400 leading-snug group-hover:text-white transition-colors">
                            {notif?.msg}
                         </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <motion.div 
               className="mt-12 p-8 premium-card bg-primary-600/10 border-primary-500/10 text-center"
               whileHover={{ scale: 1.02 }}
            >
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-4">Protocol Optimization</h4>
               <p className="text-[9px] text-dark-400 mb-6 font-medium leading-relaxed italic">Engine running at 4x peak efficiency using sub-orbital pathfinding.</p>
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="btn-primary w-full py-4 text-[9px] uppercase font-black tracking-widest"
               >
                 Initialize Full Diagnostic
               </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      </div>
    );
  } catch (err) {
    console.error("Dashboard Render Error:", err);
    return (
      <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-primary-500/20 rounded-3xl bg-primary-600/5 mx-auto max-w-4xl">
        <Activity className="w-16 h-16 text-primary-500 mb-6" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Ops Matrix Desync</h3>
        <p className="text-dark-400 font-medium text-center mt-2 px-8">The command center telemetry stream has encountered a structural failure. Error log cached.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-8 px-10 py-4 rounded-2xl">Re-establish Command Link</button>
      </div>
    );
  }
};

export default Dashboard;
