import React from 'react';
import { 
  Activity, 
  Battery, 
  MapPin, 
  TrendingUp, 
  Clock,
  ExternalLink,
  Plane,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  Plus,
  Store,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSimulateEmergency = async () => {
    try {
      const response = await axios.post('/api/emergency/trigger', {
        droneId: 'd2', // Raven-X
        triggerType: 'System-wide Sensor Failure',
        currentLocationID: 4 // Residential Park
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (window.triggerEmergencyUI) {
        window.triggerEmergencyUI(response.data);
      } else {
        alert(`EMERGENCY: Landing at ${response.data.nearestHub}`);
      }
    } catch (error) {
       console.error('Sim failed', error);
    }
  };

  const stats = [
    { name: 'Total Drones', value: '24', icon: Plane, trend: '4 New this month', color: 'text-blue-400' },
    { name: 'Active Deliveries', value: '18', icon: Activity, trend: '88% efficiency', color: 'text-green-400' },
    { name: 'Completed Deliveries', value: '1,240', icon: CheckCircle, trend: '+12% from last week', color: 'text-purple-400' },
    { name: 'Drones Under Repair', value: '3', icon: AlertTriangle, trend: '2 back by tomorrow', color: 'text-red-400' },
  ];

  const quickActions = [
    { name: 'View Assignments', icon: ClipboardList, path: '/assignments', color: 'bg-blue-600' },
    { name: 'New Assignment', icon: Plus, path: '/assignments', color: 'bg-primary-600' },
    { name: 'Marketplace', icon: Store, path: '/marketplace', color: 'bg-purple-600' },
    { name: 'Profile', icon: User, path: '/profile', color: 'bg-dark-800' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-white">Operations Center</h2>
          <p className="text-dark-400 mt-1">Real-time fleet monitoring and quick controls.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSimulateEmergency}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold transition-all hover:bg-red-500/20 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" /> Simulate E-Landing
          </button>
          {quickActions.map((action) => (
            <button 
              key={action.name}
              onClick={() => navigate(action.path)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 shadow-lg group ${action.color} ${action.color === 'bg-dark-800' ? 'border border-dark-700 hover:bg-dark-700' : 'hover:brightness-110 shadow-black/20'}`}
            >
              <action.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {action.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 group hover:border-primary-500/30 transition-all border-dark-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-dark-950 border border-dark-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-sm font-medium text-dark-400 font-inter">{stat.name}</p>
            <h3 className="text-3xl mt-1 text-white font-outfit font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 border-dark-800/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl">Network Topology</h3>
            <button className="text-primary-400 text-sm hover:underline flex items-center gap-1">
              Analyze Routes <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="aspect-[16/9] bg-dark-950 rounded-2xl border border-dark-800 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]"></div>
             <div className="text-dark-500 text-center z-10">
               <MapPin className="w-12 h-12 mx-auto mb-2 opacity-20" />
               <p className="font-outfit italic tracking-wide">Live Feed Synchronizing...</p>
             </div>
          </div>
        </div>

        <div className="glass-card p-8 border-dark-800/50">
          <h3 className="text-xl mb-6">System Health</h3>
          <div className="space-y-6">
            {[
              { label: 'Cloud Optimizer', status: 'Online', color: 'text-green-400' },
              { label: 'Sub-process Engine', status: 'Running', color: 'text-blue-400' },
              { label: 'Fleet Sync', status: 'Active', color: 'text-primary-400' },
            ].map((system) => (
              <div key={system.label} className="p-4 rounded-xl bg-dark-950/50 border border-dark-800 flex items-center justify-between group hover:border-primary-500/20 transition-all">
                <span className="text-sm text-dark-300 font-medium">{system.label}</span>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${system.color}`}>{system.status}</span>
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-dark-800 text-xs text-dark-500 italic">
              All systems operational. Signal quality: 98%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
