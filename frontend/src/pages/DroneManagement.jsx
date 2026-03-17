import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDrones, addDrone } from '../services/droneService';
import { sellDrone, repairDrone } from '../services/marketplaceService';
import { 
  Plus, 
  Plane, 
  Activity, 
  Zap, 
  Wrench, 
  Trash2, 
  AlertCircle, 
  Package, 
  ArrowRight,
  Image as ImageIcon,
  Loader2,
  X,
  Target,
  ShieldCheck,
  Cpu
} from 'lucide-react';

const DroneManagement = () => {
  const [drones, setDrones] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    droneId: '',
    modelNumber: '',
    status: 'available',
    currentBattery: 100,
    maxWeight: 5,
    maxDistance: 100,
    batteryCapacity: 5000,
    image: ''
  });
  const [error, setError] = React.useState(null);

  const fetchDrones = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDrones();
      setDrones(res.data || []);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch drones', error);
      setError('System communication error: Fleet telemetry unreachable.');
      // Fallback dummy for UI testing
      setDrones([
        { _id: 'd1', droneId: 'SKY-001', modelNumber: 'Phantom X-4', status: 'available', currentBattery: 85, battery: 85, maxWeight: 5, image: "https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?auto=format&fit=crop&q=80&w=800" },
        { _id: 'd2', droneId: 'SKY-002', modelNumber: 'Atlas-H1', status: 'busy', currentBattery: 32, battery: 32, maxWeight: 15, currentTask: 'MISSION-RAIDER-772', image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800" }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    console.log("Drone Fleet Loaded");
    fetchDrones();
  }, [fetchDrones]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const isNumber = ['currentBattery', 'maxWeight', 'maxDistance', 'batteryCapacity'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
  };

  const handleAddDrone = async (e) => {
    e.preventDefault();
    try {
      await addDrone(formData);
      setIsModalOpen(false);
      setFormData({
        droneId: '',
        modelNumber: '',
        status: 'available',
        currentBattery: 100,
        maxWeight: 5,
        maxDistance: 100,
        batteryCapacity: 5000,
        image: ''
      });
      await fetchDrones();
    } catch (error) {
       console.error('Failed to add drone', error);
       alert('System Error: Hull signature registration failed.');
    }
  };

  const handleSell = async (id, _id) => {
    if (window.confirm(`Are you sure you want to decommission drone ${id}?`)) {
      try {
        await sellDrone(_id);
        setDrones(prev => prev.filter(d => d._id !== _id));
      } catch (error) {
        alert('Decommission protocols failed.');
      }
    }
  };

  const handleRepair = async (id, _id) => {
    try {
      await repairDrone(_id);
      setDrones(prev => prev.map(d => d._id === _id ? { ...d, status: 'maintenance' } : d));
    } catch (error) {
      alert('Maintenance request rejected by sector hub.');
    }
  };

  const getStatusConfig = (status, battery) => {
    if (battery < 20) return { 
      color: 'badge-error', 
      icon: AlertCircle, 
      label: 'Low Power',
      pulse: true
    };
    
    switch (status) {
      case 'available': return { color: 'badge-success', icon: Plane, label: 'Ready' };
      case 'busy': return { color: 'badge-primary', icon: Activity, label: 'Active', glow: true };
      case 'charging': return { color: 'badge-warning', icon: Zap, label: 'Charging' };
      case 'maintenance': return { color: 'badge-warning', icon: Wrench, label: 'Repair' };
      default: return { color: 'badge-secondary', icon: Plane, label: status };
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?auto=format&fit=crop&q=80&w=800";
  };

  try {
    return (
      <div className="max-w-[1600px] mx-auto space-y-12 anim-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
        <div className="space-y-4">
           {error && (
             <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
               <AlertCircle className="w-5 h-5" /> {error}
             </div>
           )}
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-500">Fleet Sync Online</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">Fleet Command <span className="text-primary-500">Hub</span></h2>
              <p className="text-dark-400 font-medium text-base md:text-lg leading-relaxed max-w-2xl px-1">Visual telemetry and hull status for your autonomous industrial network.</p>
           </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary group py-5 px-10 rounded-[24px] w-full lg:w-auto"
        >
          <span className="flex items-center justify-center gap-3">
             <Plus className="w-6 h-6" /> Initialize New Asset
          </span>
        </button>
      </div>

      {/* Stats Quick Look (Minimalist) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Hulls', val: drones.length, icon: Cpu },
           { label: 'Avg Battery', val: '78%', icon: Zap },
           { label: 'Payload Cap', val: '240kg', icon: Package },
           { label: 'Active Links', val: drones.filter(d => d.status === 'busy').length, icon: Activity },
         ].map(stat => (
           <div key={stat.label} className="premium-card p-6 flex flex-col items-center justify-center space-y-2 group hover:border-primary-500/20">
              <stat.icon className="w-5 h-5 text-dark-700 group-hover:text-primary-500 transition-colors" />
              <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest">{stat.label}</p>
              <h5 className="text-2xl font-black text-white">{stat.val}</h5>
           </div>
         ))}
      </div>

      {/* Main Grid */}
      {loading && drones.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-8 opacity-50">
          <Loader2 className="w-16 h-16 animate-spin text-primary-500" />
          <p className="font-black uppercase tracking-[0.4em] text-dark-600 text-xs">Establishing Hull Link...</p>
        </div>
      ) : (
        <motion.div 
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {Array.isArray(drones) && drones.map((drone) => {
            const config = getStatusConfig(drone?.status, drone?.battery || drone?.currentBattery);
            const Icon = config?.icon || Plane;

            return (
              <motion.div 
                key={drone?._id}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10 }}
                className="premium-card group flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-dark-950">
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={drone?.image || "https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?auto=format&fit=crop&q=80&w=800"} 
                    alt={drone?.modelNumber} 
                    onError={handleImageError}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent"></div>
                  
                  <div className="absolute top-6 left-6 flex flex-col gap-1">
                     <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] leading-none">Designation</span>
                     <h3 className="text-2xl text-white font-black tracking-tight drop-shadow-lg uppercase leading-none mt-1">{drone?.droneId || 'HULL-TX'}</h3>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                     <span className={`badge ${config?.color} flex items-center gap-2 group-hover:scale-110 transition-transform`}>
                        {config?.pulse && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></span>}
                        <Icon className="w-3.5 h-3.5" />
                        {config?.label}
                     </span>
                     <div className="flex items-center gap-2 bg-dark-950/80 backdrop-blur-md border border-dark-900 px-4 py-2 rounded-2xl">
                        <Zap className={`w-3.5 h-3.5 ${drone?.battery < 20 ? 'text-red-500' : 'text-primary-500'}`} />
                        <span className={`text-[12px] font-black tracking-tight ${drone?.battery < 20 ? 'text-red-400' : 'text-white'}`}>{drone?.battery || drone?.currentBattery}%</span>
                     </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col space-y-6 md:space-y-8">
                  <div className="grid grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                       <p className="text-[9px] text-dark-500 font-black uppercase tracking-widest">Model Frame</p>
                       <p className="text-sm font-black text-white tracking-tight uppercase truncate">{drone?.modelNumber}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] text-dark-500 font-black uppercase tracking-widest">Payload Cap.</p>
                       <p className="text-sm font-black text-white tracking-tight">{drone?.maxWeight} kg</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">
                        <span>Energy Reserves</span>
                        <span className="text-white">{drone?.battery || drone?.currentBattery}%</span>
                     </div>
                     <div className="h-2.5 bg-dark-950 rounded-full overflow-hidden border border-dark-900 p-0.5 relative group/bar">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${drone?.battery || drone?.currentBattery || 0}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className={`h-full rounded-full ${drone?.battery < 20 ? 'bg-red-600 shadow-xl shadow-red-500/20' : drone?.battery < 50 ? 'bg-yellow-500 shadow-xl shadow-yellow-500/20' : 'bg-primary-600 shadow-xl shadow-primary-500/20'}`}
                        ></motion.div>
                     </div>
                  </div>

                  {/* Active Mission Vector */}
                  <div className="pt-6 border-t border-dark-900">
                    <p className="text-[9px] text-dark-500 font-black uppercase tracking-widest mb-4">Active Mission Matrix</p>
                    {drone?.currentTask ? (
                      <div className="bg-dark-950 p-4 md:p-5 rounded-[20px] md:rounded-[24px] border border-dark-800 flex items-center justify-between group/task hover:border-primary-500/30 transition-all cursor-pointer">
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className="p-3 md:p-4 bg-primary-600/15 rounded-xl md:rounded-2xl border border-primary-500/20 shadow-inner">
                            <Package className="w-5 h-5 md:w-6 md:h-6 text-primary-400" />
                          </div>
                          <div className="min-w-0">
                             <p className="text-[8px] md:text-[9px] text-dark-600 font-black uppercase tracking-widest leading-none mb-1 md:mb-2">Registry ID</p>
                             <span className="text-xs md:text-sm font-black text-white tracking-tight truncate block">{drone?.currentTask}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-dark-700 group-hover/task:text-primary-500 group-hover/task:translate-x-1 transition-all shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 py-4 md:py-5 px-6 md:px-8 bg-dark-950/40 rounded-[20px] md:rounded-[24px] border border-dashed border-dark-800 opacity-60">
                        <div className="w-2 h-2 rounded-full bg-dark-800"></div>
                        <span className="text-[8px] md:text-[10px] text-dark-600 font-black uppercase tracking-widest">Idle status: No vectors</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 md:px-8 py-5 md:py-6 bg-dark-950/40 flex flex-col sm:flex-row justify-end gap-3 md:gap-4 border-t border-dark-800 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRepair(drone?.droneId || drone?.id, drone?._id)}
                    type="button"
                    className="flex-1 py-3 md:py-4 text-[9px] font-black uppercase tracking-widest text-dark-500 hover:text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30 border border-transparent rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Wrench className="w-4 h-4" /> Repair Hub
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSell(drone?.droneId || drone?.id, drone?._id)}
                    type="button"
                    className="flex-1 py-3 md:py-4 text-[9px] font-black uppercase tracking-widest text-dark-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" /> Decommission
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Initialize Asset Modal (Enhanced) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark-950/95 backdrop-blur-3xl shadow-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl premium-card p-8 md:p-16 space-y-8 md:space-y-12 border-primary-500/20 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 md:top-10 right-6 md:right-10 p-2 md:p-3 hover:bg-dark-900 border border-dark-800 rounded-xl md:rounded-2xl text-dark-500 hover:text-white transition-all shadow-xl z-20"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                 <div className="w-16 h-16 bg-primary-600/20 rounded-3xl flex items-center justify-center border border-primary-500/30 shadow-xl shadow-primary-500/10 animate-float shrink-0">
                    <Plane className="w-8 h-8 text-primary-400" />
                 </div>
                 <div>
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Hull Entry Protocol</h3>
                    <p className="text-sm text-dark-400 font-medium mt-1">Broadcast new industrial signature to the autonomous sector hub.</p>
                 </div>
              </div>
              
                <form onSubmit={handleAddDrone} className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-2">Registry Designation (ID)</label>
                    <input name="droneId" value={formData.droneId} onChange={handleInputChange} placeholder="HULL-01-X" className="input-field w-full py-5 text-sm font-black uppercase" required />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-2">Model Frame Group</label>
                    <input name="modelNumber" value={formData.modelNumber} onChange={handleInputChange} placeholder="Phantom Raider v4" className="input-field w-full py-5 text-sm font-black uppercase" required />
                  </div>
                  
                  <div className="space-y-3 col-span-1 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-2">Digital Signature Imagery (URL)</label>
                    <input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://unsplash.com/orbital-signature-01" className="input-field w-full py-5 text-xs font-mono" />
                  </div>
  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 col-span-1 sm:col-span-2">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-2">Operational State</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="input-field w-full bg-dark-900 py-5 h-[68px] text-[10px] font-black uppercase">
                        <option value="available">Ready for Command</option>
                        <option value="busy">Active Deployment</option>
                        <option value="maintenance">Maintenance Link</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-2">Charge Initialization (%)</label>
                      <input name="currentBattery" type="number" value={formData.currentBattery} onChange={handleInputChange} className="input-field w-full py-5 text-sm font-black" required />
                    </div>
                  </div>
  
                  <div className="col-span-1 sm:col-span-2 pt-6">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="btn-primary w-full py-6 rounded-[28px] shadow-primary-500/20 hover:shadow-primary-500/40 group/submit"
                    >
                       <span className="flex items-center justify-center gap-4 text-xs md:text-sm">
                          <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 group-hover/submit:scale-125 transition-transform" />
                          Initialize Hull Clearance
                       </span>
                    </motion.button>
                  </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    );
  } catch (err) {
    console.error("DroneManagement Render Error:", err);
    return (
      <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-red-500/20 rounded-3xl bg-red-600/5 mx-auto max-w-4xl">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">System Initialization Failure</h3>
        <p className="text-dark-400 font-medium text-center mt-2 px-8">The command hub suffered a structural telemetry collapse. Error log cached.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-8 px-10 py-4 rounded-2xl">Re-initialize Uplink</button>
      </div>
    );
  }
};

export default DroneManagement;
