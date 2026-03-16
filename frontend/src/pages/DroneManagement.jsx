import { getAllDrones } from '../services/droneService';
import { sellDrone, repairDrone } from '../services/marketplaceService';

const DroneManagement = () => {
  const [drones, setDrones] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDrones = async () => {
      try {
        const data = await getAllDrones();
        setDrones(data);
      } catch (error) {
        console.error('Failed to fetch drones', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrones();
  }, []);

  const handleSell = async (id, _id) => {
    if (window.confirm(`Are you sure you want to sell drone ${id}?`)) {
      try {
        await sellDrone(_id);
        setDrones(prev => prev.filter(d => d._id !== _id));
        alert(`Drone ${id} sold successfully.`);
      } catch (error) {
        alert('Failed to sell drone.');
      }
    }
  };

  const handleRepair = async (id, _id) => {
    try {
      await repairDrone(_id);
      setDrones(prev => prev.map(d => d._id === _id ? { ...d, status: 'maintenance' } : d));
      alert(`Repair request sent for drone ${id}.`);
    } catch (error) {
      alert('Failed to request repair.');
    }
  };

  const getStatusConfig = (status, battery) => {
    if (battery < 20) return { 
      color: 'bg-red-500/10 text-red-400 border-red-500/20', 
      icon: AlertCircle, 
      label: 'Low Battery',
      pulse: true
    };
    
    switch (status) {
      case 'available': return { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: Plane, label: 'Ready' };
      case 'busy': return { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Activity, label: 'In Mission', glow: true };
      case 'charging': return { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Zap, label: 'Charging' };
      case 'maintenance': return { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: Wrench, label: 'Repairing' };
      default: return { color: 'bg-dark-800 text-dark-400 border-dark-700', icon: Plane, label: status };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-white font-bold">Fleet Monitoring</h2>
          <p className="text-dark-400 mt-1">Real-time status and telemetry for all registered drones.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Drone
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {drones.map((drone) => {
          const config = getStatusConfig(drone.status, drone.battery);
          const Icon = config.icon;

          return (
            <div key={drone.id} className={`glass-card overflow-hidden group transition-all duration-300 ${config.glow ? 'shadow-lg shadow-blue-500/5 border-blue-500/20' : ''} ${config.pulse ? 'border-red-500/30' : ''}`}>
              <div className="p-6 border-b border-dark-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-dark-950 rounded-xl flex items-center justify-center border border-dark-800 transition-colors ${config.pulse ? 'border-red-500/40 animate-pulse' : 'group-hover:border-primary-500/50'}`}>
                    <Icon className={`w-6 h-6 ${drone.battery < 20 ? 'text-red-400' : 'text-primary-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg text-white font-outfit font-bold">{drone.id}</h3>
                    <p className="text-xs text-dark-500 font-medium uppercase tracking-wider">{drone.model}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${config.color}`}>
                  {config.pulse && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></span>}
                  {config.label}
                </span>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-dark-500 uppercase tracking-widest font-bold">Battery Life</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-dark-950 rounded-full overflow-hidden border border-dark-800">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${drone.battery < 20 ? 'bg-red-500' : drone.battery < 50 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                          style={{ width: `${drone.battery}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold ${drone.battery < 20 ? 'text-red-400' : 'text-dark-100'}`}>{drone.battery}%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-dark-500 uppercase tracking-widest font-bold">Payload Cap.</p>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-bold text-dark-100">{drone.payload}</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Task Section */}
                <div className="mt-4 pt-4 border-t border-dark-800/50">
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest font-bold mb-3">Active Mission</p>
                  {drone.currentTask ? (
                    <div className="bg-dark-950/80 rounded-xl p-3 border border-dark-800 flex items-center justify-between group/task hover:border-primary-500/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-600/10 rounded-lg">
                          <Package className="w-4 h-4 text-primary-400" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">{drone.currentTask}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-dark-600 group-hover/task:text-primary-400 group-hover/task:translate-x-1 transition-all" />
                    </div>
                  ) : (
                    <div className="text-xs text-dark-600 italic py-2">
                      No active assignments.
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-dark-900/30 flex justify-end gap-3 border-t border-dark-900">
                <button 
                  onClick={() => handleRepair(drone.id, drone._id)}
                  className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-dark-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" /> Repair
                </button>
                <button 
                  onClick={() => handleSell(drone.id, drone._id)}
                  className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Sell
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DroneManagement;
