import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  RefreshCcw, 
  Plus, 
  X, 
  Loader2,
  Navigation,
  Box,
  Target,
  ChevronRight,
  Zap,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { getAssignments, createAssignment } from '../services/assignmentService';
import RouteMap from '../components/RouteMap';

const Assignments = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [lastMissionMap, setLastMissionMap] = useState(null);
  const [formData, setFormData] = useState({
    pickup: '',
    dest: '',
    weight: 5,
    startNode: 0,
    endNode: 5
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const data = await getAssignments();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch assignments, using fallback', error);
      setTasks([
        {
          _id: 'd1',
          deliveryId: 'MISSION-RAIDER-772',
          pickupLocation: 'Main Logistics Hub',
          deliveryLocations: ['Northern Residential Center'],
          packageWeight: 12.5,
          status: 'assigned',
          assignedDrone: { modelNumber: 'SkyRaider v3' }
        },
        {
          _id: 'd2',
          deliveryId: 'MISSION-ATLAS-884',
          pickupLocation: 'Industrial Sector 7',
          deliveryLocations: ['Central Medical Depot'],
          packageWeight: 8.2,
          status: 'delivered',
          assignedDrone: { modelNumber: 'Atlas Heavy-X' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await createAssignment({
        pickupLocation: formData.pickup,
        deliveryLocations: [formData.dest],
        packageWeight: formData.weight,
        startNodeId: formData.startNode,
        targetNodeId: formData.endNode
      });
      setLastMissionMap(response.mapData);
      setShowModal(false);
      fetchAssignments();
      setFormData({ pickup: '', dest: '', weight: 5, startNode: 0, endNode: 5 });
    } catch (error) {
      alert('Mission calculation failed: Protocol error.');
    } finally {
      setSubmitting(false);
    }
  };

  try {
    return (
      <div className="max-w-[1600px] mx-auto space-y-12 anim-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-500">Mission Matrix Active</span>
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">Delivery <span className="text-primary-500">Assignments</span></h2>
           <p className="text-dark-400 font-medium text-base md:text-lg leading-relaxed max-w-2xl px-1">Coordinate and optimize autonomous delivery pathways across the sector.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <button 
             type="button" 
             onClick={fetchAssignments} 
             className="btn-secondary flex-1 sm:flex-none flex items-center justify-center gap-3 py-4"
           >
             <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Update Log
           </button>
           <button 
             type="button" 
             onClick={() => setShowModal(true)} 
             className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-3 py-4"
           >
             <Plus className="w-5 h-5" /> Initialize Mission
           </button>
        </div>
      </div>

      {/* Route Visualization Map (Enhanced) */}
      {lastMissionMap && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 anim-fade-in">
           <div className="lg:col-span-8 h-[350px] md:h-[500px] premium-card p-1">
              <div className="h-full bg-dark-950/80 rounded-[1.8rem] overflow-hidden">
                 <RouteMap data={lastMissionMap} />
              </div>
           </div>
           <div className="lg:col-span-4 premium-card p-8 md:p-10 flex flex-col justify-between bg-primary-900/10 border-primary-500/20">
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
                       <Navigation className="w-6 h-6 text-primary-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Path Analyzed</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-dark-950/50 rounded-2xl border border-dark-800">
                       <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Optimized Route</span>
                       <span className="text-sm font-black text-white">{lastMissionMap.route.length} Nodes Synchronized</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-dark-950/50 rounded-2xl border border-dark-800">
                       <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Latency Prot.</span>
                       <span className="text-sm font-black text-blue-400 uppercase tracking-tighter italic">Dijkstra v1.0.4</span>
                    </div>
                 </div>

                 <p className="text-xs text-dark-400 font-medium italic leading-relaxed opacity-60">
                    Proprietary pathfinding engine successfully broadcast mission telemetry to the active hull.
                 </p>
              </div>

              <button 
                type="button"
                onClick={() => setLastMissionMap(null)}
                className="btn-secondary w-full border-primary-500/20 hover:border-primary-500/50"
              >
                Clear Visual Link
              </button>
           </div>
        </div>
      )}

      {/* Mission Cards Grid */}
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-dark-500 mb-8 border-b border-dark-900 pb-4">Live Mission Feed</h4>
        
        {loading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 opacity-50">
             <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
             <p className="font-black uppercase tracking-[0.2em] text-[10px]">Filtering Mission Archives...</p>
          </div>
        ) : !Array.isArray(tasks) || tasks.length === 0 ? (
          <div className="premium-card p-20 text-center border-dashed opacity-40">
             <Box className="w-16 h-16 mx-auto mb-6 text-dark-700" />
             <p className="text-lg font-bold text-dark-500 uppercase tracking-widest">No orbital assets currently in-mission.</p>
          </div>
        ) : (
          <motion.div 
            variants={{
              animate: { transition: { staggerChildren: 0.1 } }
            }}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 gap-6"
          >
             {tasks.map((task) => (
              <motion.div 
                key={task?._id || Math.random()}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                className="premium-card group hover:bg-dark-900/60 p-6 md:p-8 lg:p-4 flex flex-col lg:flex-row items-center gap-8 md:gap-10"
              >
                {/* ID & Status */}
                <div className="lg:w-48 text-center lg:text-left space-y-2">
                   <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-primary-600"
                      ></motion.div>
                      <p className="text-[9px] font-black text-dark-500 uppercase tracking-widest">Registry ID</p>
                   </div>
                   <h5 className="text-lg font-black text-white tracking-tight">{task?.deliveryId || 'UNKN-ID'}</h5>
                   <span className={`px-3 py-1 bg-dark-950 border rounded-xl text-[8px] font-black uppercase tracking-[0.2em] inline-block ${
                      task?.status === 'delivered' ? 'text-green-400 border-green-500/20' : 
                      task?.status === 'assigned' ? 'text-blue-400 border-blue-500/20' : 'text-yellow-400 border-yellow-500/20'
                    }`}>
                      {task?.status || 'Pending Sync'}
                   </span>
                </div>

                {/* Logistics Info (Desktop Row) */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                   {/* Route */}
                   <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-dark-600 px-1">
                         <span>Origin Origin Hub</span>
                         <span>Destination Sector</span>
                      </div>
                      <div className="bg-dark-950/80 rounded-2xl p-4 border border-dark-800 flex items-center justify-between group-hover:border-primary-500/20 transition-all">
                         <span className="text-sm font-bold text-white max-w-[120px] truncate">{task?.pickupLocation}</span>
                         <motion.div
                           animate={{ x: [0, 5, 0] }}
                           transition={{ duration: 1.5, repeat: Infinity }}
                         >
                           <ArrowRight className="w-4 h-4 text-primary-500" />
                         </motion.div>
                         <span className="text-sm font-bold text-white max-w-[120px] truncate">{task?.deliveryLocations?.[0]}</span>
                      </div>
                   </div>

                   {/* Asset/Drone */}
                   <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-dark-600 px-1">Active Hull Signature</p>
                      <div className="bg-dark-950/80 rounded-2xl p-4 border border-dark-800 flex items-center gap-4 group-hover:border-primary-500/20 transition-all">
                         <motion.div 
                           whileHover={{ rotate: 15 }}
                           className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center border border-primary-500/10"
                         >
                            <Zap className="w-4 h-4 text-primary-400" />
                         </motion.div>
                         <div>
                            <p className="text-[10px] font-black text-white tracking-tight">{task?.assignedDrone?.modelNumber || 'Initializing...'}</p>
                            <p className="text-[9px] font-bold text-dark-500 uppercase leading-none">MKR-Alpha Protocol</p>
                         </div>
                      </div>
                   </div>

                   {/* Payload & Analytics */}
                   <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-dark-600 px-1">Payload Telemetry</p>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-dark-950/80 rounded-2xl p-4 border border-dark-800 flex flex-col items-center justify-center group-hover:border-primary-500/20 transition-all">
                            <p className="text-[8px] font-black text-dark-500 uppercase mb-0.5 tracking-tighter">Weight</p>
                            <span className="text-xs font-black text-white">{task?.packageWeight || 0}kg</span>
                         </div>
                         <div className="bg-dark-950/80 rounded-2xl p-4 border border-dark-800 flex flex-col items-center justify-center group-hover:border-primary-500/20 transition-all">
                            <p className="text-[8px] font-black text-dark-500 uppercase mb-0.5 tracking-tighter">ETA</p>
                            <span className="text-xs font-black text-green-400">Opt.</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Final Action */}
                <div className="lg:w-48 w-full">
                   <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-primary-600/5 border border-primary-500/30 rounded-2xl text-[9px] font-black uppercase tracking-widest text-primary-400 transition-all flex items-center justify-center gap-2 group/track"
                   >
                      Monitor Pulse
                      <ChevronRight className="w-3.5 h-3.5 group-hover/track:translate-x-1 transition-transform" />
                   </motion.button>
                </div>
              </motion.div>
             ))}
          </motion.div>
        )}
      </div>

      {/* Initialize Mission Modal (Enhanced) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 shadow-2xl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-950/95 backdrop-blur-2xl" 
              onClick={() => setShowModal(false)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl premium-card p-8 md:p-12 space-y-8 md:space-y-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="absolute top-8 right-8 p-2 hover:bg-dark-900 rounded-2xl text-dark-500 hover:text-white transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-primary-600/20 rounded-2xl flex items-center justify-center border border-primary-500/30">
                    <Box className="w-8 h-8 text-primary-400" />
                 </div>
                 <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Mission Initializer</h3>
                    <p className="text-sm text-dark-400 font-medium">Broadcast new delivery parameters to the autonomous grid.</p>
                 </div>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
                <div className="space-y-10 col-span-1 sm:col-span-1">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 flex items-center gap-2 px-1">
                       <MapPin className="w-3 h-3 text-primary-500" /> Origin Hub Entity
                    </label>
                    <input value={formData.pickup} onChange={(e) => setFormData({...formData, pickup: e.target.value})} placeholder="HQ Central Logistics" className="input-field w-full text-xs font-bold" required />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 flex items-center gap-2 px-1">
                       <Target className="w-3 h-3 text-blue-500" /> Target Drop Zone
                    </label>
                    <input value={formData.dest} onChange={(e) => setFormData({...formData, dest: e.target.value})} placeholder="Residential Hub X" className="input-field w-full text-xs font-bold" required />
                  </div>
                </div>

                <div className="space-y-10 col-span-2 md:col-span-1">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4 text-center">
                      <label className="text-[9px] font-black uppercase tracking-widest text-dark-500 block mb-2 px-1">Start Node Index</label>
                      <input type="number" min="0" max="100" value={formData.startNode} onChange={(e) => setFormData({...formData, startNode: parseInt(e.target.value)})} className="input-field w-full text-center text-lg font-black font-mono border-dark-800 py-6" required />
                    </div>
                    <div className="space-y-4 text-center">
                      <label className="text-[9px] font-black uppercase tracking-widest text-dark-500 block mb-2 px-1">End Node Index</label>
                      <input type="number" min="0" max="100" value={formData.endNode} onChange={(e) => setFormData({...formData, endNode: parseInt(e.target.value)})} className="input-field w-full text-center text-lg font-black font-mono border-dark-800 py-6" required />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 flex items-center justify-between px-1">
                       <span>Payload Weight Metrics</span>
                       <span className="text-primary-400 font-black">{formData.weight} kg</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={formData.weight} 
                      onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})} 
                      className="w-full h-1.5 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-primary-500 border border-dark-800" 
                    />
                    <div className="flex justify-between text-[8px] font-black text-dark-600 uppercase tracking-widest px-1">
                       <span>Light-Duty</span>
                       <span>Heavy-Lift</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 pt-6">
                   <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={submitting} 
                    className="btn-primary w-full py-6 rounded-[24px] flex items-center justify-center gap-4 group/submit shadow-primary-500/20 hover:shadow-primary-500/40"
                   >
                     {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <ShieldCheck className="w-6 h-6 group-hover/submit:scale-125 transition-transform" />
                          Initialize Optimization Engine
                        </>
                     )}
                   </motion.button>
                   <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-dark-600 mt-6 animate-pulse">Establishing secure link via sub-orbital router...</p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    );
  } catch (err) {
    console.error("Assignments Render Error:", err);
    return (
      <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-primary-500/20 rounded-3xl bg-primary-600/5 mx-auto max-w-4xl">
        <Target className="w-16 h-16 text-primary-500 mb-6" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Mission Matrix Desync</h3>
        <p className="text-dark-400 font-medium text-center mt-2 px-8">The orbital calculation engine has encountered a temporal anomaly. Mission log purged.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-8 px-10 py-4 rounded-2xl">Re-establish Uplink</button>
      </div>
    );
  }
};

export default Assignments;
