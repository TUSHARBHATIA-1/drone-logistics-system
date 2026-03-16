import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, ArrowRight, CheckCircle, RefreshCcw, Plus, X, Loader2 } from 'lucide-react';
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
    try {
      const data = await getAssignments();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch assignments', error);
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
      alert('Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-white font-bold">Delivery Assignments</h2>
          <p className="text-dark-400 mt-1">Track and coordinate drone delivery missions.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={fetchAssignments} className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-dark-800 rounded-xl hover:bg-dark-800 transition-all text-sm font-bold text-dark-200">
             <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
           </button>
           <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
             <Plus className="w-4 h-4" /> New Assignment
           </button>
        </div>
      </div>

      {/* Route Visualization Section */}
      {lastMissionMap && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in zoom-in duration-500">
           <div className="lg:col-span-2 h-[400px]">
              <RouteMap data={lastMissionMap} />
           </div>
           <div className="glass-card p-6 border-primary-500/20 bg-primary-500/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-primary-400" />
                 Optimization Success
              </h3>
              <div className="space-y-4 text-sm">
                 <div className="flex justify-between">
                    <span className="text-dark-400">Calculated Path:</span>
                    <span className="text-white font-mono">{lastMissionMap.route.length} Nodes</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-dark-400">Engine Protocol:</span>
                    <span className="text-blue-400">Dijkstra v1.0</span>
                 </div>
                 <div className="pt-4 border-t border-dark-800">
                    <p className="text-dark-500 text-xs italic">
                       The drone has been dispatched and is following the high-speed route visualized on the left.
                    </p>
                 </div>
                 <button 
                   onClick={() => setLastMissionMap(null)}
                   className="w-full py-2 bg-dark-900 border border-dark-800 rounded-lg text-dark-300 text-xs hover:bg-dark-800 transition-all font-bold"
                 >
                   Clear Visualization
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-dark-900/50 border-b border-dark-800">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark-500">Task ID</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark-500">Route</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark-500">Drone</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark-500">Weight</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark-500">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dark-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/50">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-20 opacity-20"><Loader2 className="w-12 h-12 animate-spin mx-auto" /></td></tr>
            ) : tasks.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-20 opacity-40 font-bold">No active missions found.</td></tr>
            ) : tasks.map((task) => (
              <tr key={task._id} className="hover:bg-dark-900/30 transition-colors group">
                <td className="px-6 py-5 font-bold text-white tracking-tight">{task.deliveryId}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="text-dark-300 text-sm font-medium">{task.pickupLocation}</span>
                    <ArrowRight className="w-3 h-3 text-dark-600" />
                    <span className="text-primary-400 text-sm font-bold">{task.deliveryLocations[0]}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                     <span className="text-sm text-dark-100 font-bold">{task.assignedDrone?.modelNumber || 'Unassigned'}</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-sm text-dark-400 font-medium">{task.packageWeight}kg</td>
                <td className="px-6 py-5">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${
                    task.status === 'delivered' ? 'text-green-400 border-green-500/20 bg-green-500/5' : 
                    task.status === 'assigned' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5 animate-pulse' : 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button className="text-primary-500 hover:text-primary-400 text-[10px] font-black uppercase tracking-widest underline underline-offset-4 decoration-primary-500/30 group-hover:decoration-primary-500 transition-all">
                    Track Pulse
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-lg bg-dark-900 border border-dark-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-bold text-white">Initialize Mission</h3>
               <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-800 rounded-xl transition-colors text-dark-500"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-1">Pickup Name</label>
                  <input value={formData.pickup} onChange={(e) => setFormData({...formData, pickup: e.target.value})} placeholder="HQ Depot" className="input-field w-full" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-1">Destination Name</label>
                  <input value={formData.dest} onChange={(e) => setFormData({...formData, dest: e.target.value})} placeholder="Medical Hub" className="input-field w-full" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-1">Origin Node ID (0-5)</label>
                  <input type="number" min="0" max="5" value={formData.startNode} onChange={(e) => setFormData({...formData, startNode: parseInt(e.target.value)})} className="input-field w-full" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-1">Target Node ID (0-5)</label>
                  <input type="number" min="0" max="5" value={formData.endNode} onChange={(e) => setFormData({...formData, endNode: parseInt(e.target.value)})} className="input-field w-full" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 ml-1">Payload Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})} className="input-field w-full" required />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 group">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Launch Mission Optimizer'}
                {!submitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
