import React, { useState, useEffect } from 'react';
import { 
  Activity, Plane, ShieldAlert, ArrowUpRight, Zap, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { getDrones } from '../services/droneService';

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [statsError, setStatsError] = useState('');
  const [company, setCompany] = useState(null);

  const [notifications] = useState([
    { id: 1, type: 'status', msg: 'Fleet telemetry synchronized successfully' },
    { id: 2, type: 'alert', msg: 'Atmospheric conditions nominal across all sectors' },
    { id: 3, type: 'success', msg: 'System health check passed — all systems operational' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Company
        const companyRes = await axios.get("/company/me");
        setCompany(companyRes.data);

        // Fetch Drone Stats
        try {
          const { data } = await getDrones();
          setStatsData(data.stats);
        } catch (err) {
          console.error('[Dashboard] Drone stats error:', err);
          setStatsError('Could not load live stats.');
          setStatsData({ total: 0, active: 0, maintenance: 0, avgBattery: 0 });
        }

      } catch (err) {
        console.error("Error fetching company:", err);
        setCompany({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSimulateEmergency = async () => {
    try {
      await axios.post('/emergency/trigger', {
        droneId: 'd2',
        triggerType: 'System-wide Sensor Failure',
        currentLocationID: 4
      });
    } catch (error) {
      console.error('Sim failed', error);
    }
  };

  if (loading || !company) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">

      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between gap-8">
        <div>
          <p className="text-primary-500 text-xs font-bold mb-2">
            Live System Connected to MongoDB
          </p>

          <h1 className="text-4xl font-black text-white">
            {company?.name || 'Dashboard'}
          </h1>

          <p className="text-dark-400 mt-2">
            {company?.address}
            <br />
            Lat: {company?.location?.coordinates?.[1]} | 
            Lng: {company?.location?.coordinates?.[0]}
          </p>
        </div>

        <button 
          onClick={handleSimulateEmergency}
          className="px-6 py-3 bg-red-500/20 text-red-500 rounded-xl"
        >
          Emergency
        </button>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {statsError && (
          <div className="col-span-2 text-yellow-400 flex items-center gap-2">
            <AlertCircle /> {statsError}
          </div>
        )}

        {[
          { label: 'Total Drones', value: statsData?.total, icon: Plane },
          { label: 'Active Drones', value: statsData?.active, icon: Activity },
          { label: 'Maintenance', value: statsData?.maintenance, icon: ShieldAlert },
          { label: 'Avg Battery', value: `${statsData?.avgBattery}%`, icon: Zap },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-dark-900 rounded-xl">
            <div className="flex justify-between mb-3">
              <stat.icon />
              <ArrowUpRight />
            </div>
            <p className="text-sm text-dark-400">{stat.label}</p>
            <h2 className="text-3xl font-bold">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* NOTIFICATIONS */}
      <div className="space-y-4">
        <h3 className="text-white font-bold">System Logs</h3>

        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-dark-900 rounded-xl text-dark-300"
            >
              {n.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Dashboard;