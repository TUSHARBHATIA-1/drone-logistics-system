import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDrones, addDrone, updateDrone, markRepair, deleteDrone } from '../services/droneService';
import {
  Plus, Plane, Activity, Zap, Wrench, Trash2, AlertCircle,
  Package, ArrowRight, Loader2, X, ShieldCheck, Cpu, MapPin,
  RefreshCw, Edit2, Check, ChevronDown
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?auto=format&fit=crop&q=80&w=800';

const STATUS_CONFIG = {
  available:   { label: 'Ready',       badge: 'bg-green-500/15 text-green-400 border-green-500/30',   icon: Plane,       dot: 'bg-green-500' },
  busy:        { label: 'Active',       badge: 'bg-primary-500/15 text-primary-400 border-primary-500/30', icon: Activity, dot: 'bg-primary-500' },
  charging:    { label: 'Charging',     badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', icon: Zap,       dot: 'bg-yellow-500' },
  maintenance: { label: 'Maintenance',  badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30', icon: Wrench,    dot: 'bg-orange-500' },
  retired:     { label: 'Retired',      badge: 'bg-dark-600/30 text-dark-400 border-dark-700',          icon: X,         dot: 'bg-dark-500' },
};

const EMPTY_FORM = {
  droneId: '', modelNumber: '', status: 'available',
  currentBattery: 100, maxWeight: 5, maxDistance: 100,
  batteryCapacity: 5000, locationCity: 'New Delhi', image: ''
};

const inputCls = 'w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all text-sm';

// ── Sub-components ────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="bg-dark-900 border border-dark-700 rounded-2xl p-5 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <Icon className="w-4 h-4 text-dark-400" />
      <span className="text-xs text-dark-500 font-semibold uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-2xl font-black text-white">{value}</p>
    {sub && <p className="text-xs text-dark-500">{sub}</p>}
  </div>
);

const BatteryBar = ({ level }) => {
  const color = level < 20 ? 'bg-red-500' : level < 50 ? 'bg-yellow-500' : 'bg-primary-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-dark-500">
        <span>Battery</span><span className={level < 20 ? 'text-red-400' : 'text-white'}>{level}%</span>
      </div>
      <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────
const DroneManagement = () => {
  const [drones, setDrones]         = useState([]);
  const [stats, setStats]           = useState({});
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError]     = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [formError, setFormError]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [filter, setFilter]         = useState('all');

  // ── Data fetch ─────────────────────────────────────────
  const fetchDrones = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setApiError('');
    try {
      const { data } = await getDrones();
      setDrones(data.data || []);
      setStats(data.stats || {});
    } catch (err) {
      if (err.response) {
        setApiError(err.response.data?.message || 'Failed to load fleet data.');
      } else if (err.request) {
        setApiError('Server unreachable. Check backend connection.');
      } else {
        setApiError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchDrones(); }, [fetchDrones]);

  // ── Filter ─────────────────────────────────────────────
  const filtered = filter === 'all' ? drones : drones.filter(d => d.status === filter);

  // ── Form handlers ──────────────────────────────────────
  const handleInput = (e) => {
    const { name, value } = e.target;
    const numeric = ['currentBattery', 'maxWeight', 'maxDistance', 'batteryCapacity'];
    setFormData(p => ({ ...p, [name]: numeric.includes(name) ? parseFloat(value) || 0 : value }));
    setFormError('');
  };

  const handleAddDrone = async (e) => {
    e.preventDefault();
    if (!formData.modelNumber) return setFormError('Model name is required.');
    setSubmitting(true);
    setFormError('');
    try {
      await addDrone(formData);
      setIsModalOpen(false);
      setFormData(EMPTY_FORM);
      await fetchDrones(true);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to register drone.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (droneDbId, newStatus) => {
    setEditingStatusId(droneDbId);
    try {
      await updateDrone(droneDbId, { status: newStatus });
      setDrones(prev => prev.map(d => d._id === droneDbId ? { ...d, status: newStatus } : d));
    } catch (err) {
      setApiError('Status update failed. ' + (err.response?.data?.message || ''));
    } finally {
      setEditingStatusId(null);
    }
  };

  const handleRepair = async (droneDbId) => {
    setEditingStatusId(droneDbId);
    try {
      await markRepair(droneDbId);
      setDrones(prev => prev.map(d => d._id === droneDbId ? { ...d, status: 'maintenance' } : d));
    } catch (err) {
      setApiError('Repair request failed. ' + (err.response?.data?.message || ''));
    } finally {
      setEditingStatusId(null);
    }
  };

  const handleDelete = async (droneId, droneDbId) => {
    if (!window.confirm(`Decommission drone ${droneId}? This cannot be undone.`)) return;
    setDeletingId(droneDbId);
    try {
      await deleteDrone(droneDbId);
      setDrones(prev => prev.filter(d => d._id !== droneDbId));
      setStats(prev => ({ ...prev, total: (prev.total || 1) - 1 }));
    } catch (err) {
      setApiError('Delete failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  // ── Loading screen ─────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
      <p className="text-xs font-black uppercase tracking-[0.4em] text-dark-500 animate-pulse">
        Establishing Fleet Telemetry…
      </p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-10">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-500">Fleet Sync Online</span>
            {refreshing && <RefreshCw className="w-3 h-3 text-dark-500 animate-spin ml-1" />}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Fleet <span className="text-primary-500">Command</span>
          </h1>
          <p className="text-dark-400 mt-1">Real-time drone management — {drones.length} unit{drones.length !== 1 ? 's' : ''} registered</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchDrones(true)}
            disabled={refreshing}
            className="p-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-400 hover:text-white hover:border-dark-600 transition-all disabled:opacity-40"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { setIsModalOpen(true); setFormData(EMPTY_FORM); setFormError(''); }}
            className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary-600/20"
          >
            <Plus className="w-5 h-5" /> Add Drone
          </button>
        </div>
      </div>

      {/* ── API Error ───────────────────────────────────── */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0" /> {apiError}
            <button onClick={() => setApiError('')} className="ml-auto text-red-500 hover:text-red-300"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Live Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Cpu}      label="Total"       value={stats.total ?? drones.length} />
        <StatCard icon={Plane}    label="Ready"        value={stats.active ?? 0}           sub="Available" />
        <StatCard icon={Activity} label="Active"       value={stats.busy ?? 0}             sub="In flight" />
        <StatCard icon={Wrench}   label="Maintenance"  value={stats.maintenance ?? 0}      />
        <StatCard icon={Zap}      label="Avg Battery"  value={`${stats.avgBattery ?? 0}%`} />
        <StatCard icon={Package}  label="Total Payload" value={`${stats.totalPayload ?? 0} kg`} />
      </div>

      {/* ── Filter Bar ─────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'available', 'busy', 'maintenance', 'charging', 'retired'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
              filter === f
                ? 'bg-primary-600 border-primary-500 text-white'
                : 'bg-dark-900 border-dark-700 text-dark-400 hover:border-dark-600'
            }`}
          >
            {f === 'all' ? `All (${drones.length})` : `${STATUS_CONFIG[f]?.label ?? f} (${drones.filter(d => d.status === f).length})`}
          </button>
        ))}
      </div>

      {/* ── Drone Grid ──────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-dark-700 rounded-3xl gap-4">
          <Plane className="w-12 h-12 text-dark-600" />
          <p className="text-dark-500 font-bold uppercase tracking-widest text-sm">
            {drones.length === 0 ? 'No drones registered yet' : `No drones with status "${filter}"`}
          </p>
          {drones.length === 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Register Your First Drone
            </button>
          )}
        </div>
      ) : (
        <motion.div
          variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
          initial="initial" animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map(drone => {
            const cfg     = STATUS_CONFIG[drone.status] || STATUS_CONFIG.available;
            const Icon    = cfg.icon;
            const battery = drone.currentBattery ?? 0;
            const isDeleting = deletingId === drone._id;
            const isUpdating = editingStatusId === drone._id;

            return (
              <motion.div
                key={drone._id}
                variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`bg-dark-900 border rounded-2xl overflow-hidden flex flex-col ${isDeleting ? 'opacity-40 pointer-events-none' : 'border-dark-700 hover:border-dark-600'}`}
              >
                {/* Image */}
                <div className="relative h-44 bg-dark-950 overflow-hidden">
                  <img
                    src={drone.image || FALLBACK_IMG}
                    alt={drone.modelNumber}
                    onError={e => { e.target.src = FALLBACK_IMG; }}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent" />

                  {/* Drone ID badge */}
                  <div className="absolute top-4 left-4">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">ID</p>
                    <h3 className="text-xl font-black text-white uppercase drop-shadow">{drone.droneId}</h3>
                  </div>

                  {/* Status + Battery */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border ${cfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                      <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                    <span className={`text-sm font-black px-3 py-1.5 rounded-lg bg-dark-900/80 backdrop-blur border border-dark-800 ${battery < 20 ? 'text-red-400' : 'text-white'}`}>
                      <Zap className="w-3 h-3 inline mr-1" />{battery}%
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[9px] text-dark-500 font-black uppercase tracking-widest">Model</p>
                      <p className="text-white font-bold truncate">{drone.modelNumber}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-dark-500 font-black uppercase tracking-widest">Payload</p>
                      <p className="text-white font-bold">{drone.maxWeight} kg</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-dark-500 font-black uppercase tracking-widest">Range</p>
                      <p className="text-white font-bold">{drone.maxDistance} km</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-dark-500 font-black uppercase tracking-widest flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />Location</p>
                      <p className="text-white font-bold truncate">{drone.locationCity || 'Unknown'}</p>
                    </div>
                  </div>

                  <BatteryBar level={battery} />

                  {/* Mission */}
                  {drone.assignedDelivery ? (
                    <div className="bg-dark-800 border border-dark-700 rounded-xl p-3 flex items-center gap-3">
                      <Package className="w-4 h-4 text-primary-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-dark-500 uppercase tracking-widest">Mission</p>
                        <p className="text-xs text-white font-bold truncate">{drone.assignedDelivery}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-dark-600 ml-auto shrink-0" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 border border-dashed border-dark-700 rounded-xl opacity-50">
                      <div className="w-2 h-2 bg-dark-700 rounded-full" />
                      <span className="text-[10px] text-dark-600 uppercase tracking-widest font-bold">No active mission</span>
                    </div>
                  )}

                  {/* Quick status change */}
                  <div className="relative">
                    <label className="text-[9px] text-dark-500 uppercase tracking-widest font-black block mb-1">Change Status</label>
                    <div className="relative">
                      <select
                        value={drone.status}
                        disabled={isUpdating}
                        onChange={e => handleStatusChange(drone._id, e.target.value)}
                        className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white font-semibold appearance-none focus:outline-none focus:border-primary-500 disabled:opacity-40 cursor-pointer"
                      >
                        <option value="available">✅ Ready</option>
                        <option value="busy">🔵 Active</option>
                        <option value="charging">⚡ Charging</option>
                        <option value="maintenance">🔧 Maintenance</option>
                        <option value="retired">⚫ Retired</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex border-t border-dark-800">
                  <button
                    onClick={() => handleRepair(drone._id)}
                    disabled={isUpdating || drone.status === 'maintenance'}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark-500 hover:text-orange-400 hover:bg-orange-500/5 transition-all disabled:opacity-30"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Repair
                  </button>
                  <div className="w-px bg-dark-800" />
                  <button
                    onClick={() => handleDelete(drone.droneId, drone._id)}
                    disabled={isDeleting}
                    className="flex-1 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark-500 hover:text-red-400 hover:bg-red-500/5 transition-all disabled:opacity-30"
                  >
                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Decommission
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── Add Drone Modal ─────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-xl bg-dark-900 border border-dark-700 rounded-2xl p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-600/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                  <Plane className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase">Register Drone</h3>
                  <p className="text-xs text-dark-500">Add a new unit to your fleet</p>
                </div>
              </div>

              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" /> {formError}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleAddDrone} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-dark-400 font-black uppercase tracking-widest">Drone ID <span className="text-dark-600">(leave blank to auto-generate)</span></label>
                  <input name="droneId" value={formData.droneId} onChange={handleInput} placeholder="e.g. HULL-007" className={inputCls} />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-dark-400 font-black uppercase tracking-widest">Model Name *</label>
                  <input name="modelNumber" value={formData.modelNumber} onChange={handleInput} placeholder="e.g. Phantom X-4" className={inputCls} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400 font-black uppercase tracking-widest">Max Payload (kg)</label>
                  <input type="number" name="maxWeight" value={formData.maxWeight} onChange={handleInput} min="0.1" step="0.1" className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400 font-black uppercase tracking-widest">Max Range (km)</label>
                  <input type="number" name="maxDistance" value={formData.maxDistance} onChange={handleInput} min="1" className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400 font-black uppercase tracking-widest">Battery Capacity (mAh)</label>
                  <input type="number" name="batteryCapacity" value={formData.batteryCapacity} onChange={handleInput} min="100" className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400 font-black uppercase tracking-widest">Current Battery (%)</label>
                  <input type="number" name="currentBattery" value={formData.currentBattery} onChange={handleInput} min="0" max="100" className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400 font-black uppercase tracking-widest">Location / City</label>
                  <input name="locationCity" value={formData.locationCity} onChange={handleInput} placeholder="e.g. Mumbai" className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400 font-black uppercase tracking-widest">Initial Status</label>
                  <select name="status" value={formData.status} onChange={handleInput} className={inputCls}>
                    <option value="available">Ready</option>
                    <option value="charging">Charging</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-dark-400 font-black uppercase tracking-widest">Image URL <span className="text-dark-600">(optional)</span></label>
                  <input name="image" value={formData.image} onChange={handleInput} placeholder="https://..." className={inputCls} />
                </div>
                <div className="col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Registering…</> : <><ShieldCheck className="w-5 h-5" /> Register Drone</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DroneManagement;
