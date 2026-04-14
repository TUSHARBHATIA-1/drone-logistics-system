import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../services/api';

// ── Drone type options ────────────────────────────────────────────────────────
const DRONE_TYPE_OPTIONS = [
  'Fixed-Wing', 'Multi-Rotor', 'Single-Rotor', 'Hybrid VTOL',
  'Nano Drone', 'Cargo Drone', 'Racing Drone', 'Other',
];

// ── Field wrapper — label + hint + children + error ──────────────────────────
const Field = ({ label, hint, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-dark-200 tracking-wide">{label}</label>
    {hint && <p className="text-xs text-dark-400">{hint}</p>}
    {children}
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

// ── Shared input class ────────────────────────────────────────────────────────
const inputClass =
  'w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-dark-100 ' +
  'placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ' +
  'focus:border-primary-500 transition-all';

// ─────────────────────────────────────────────────────────────────────────────
export default function CompanySetup() {
  const navigate = useNavigate();

  // ── All fields initialised to '' or [] — no undefined ────────────────────
  const [form, setForm] = useState({
    totalDrones: '',
    activeDrones: '',
    inactiveDrones: '',
    maxRange: '',
    minRange: '',
    locationAddress: '',
    locationLat: '',
    locationLng: '',
    droneTypes: [],
    maintenanceNotes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  // ── Derived totals for live hint ─────────────────────────────────────────
  const active = Number(form.activeDrones) || 0;
  const inactive = Number(form.inactiveDrones) || 0;
  const total = Number(form.totalDrones) || 0;
  const sumOk = total > 0 && active + inactive === total;

  // ── handleChange: functional updater so every keystroke updates state ────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  // ── Drone type pill toggle ────────────────────────────────────────────────
  const toggleDroneType = (type) => {
    setForm((prev) => ({
      ...prev,
      droneTypes: prev.droneTypes.includes(type)
        ? prev.droneTypes.filter((t) => t !== type)
        : [...prev.droneTypes, type],
    }));
  };

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.totalDrones) e.totalDrones = 'Required';
    if (!form.activeDrones) e.activeDrones = 'Required';
    if (!form.inactiveDrones) e.inactiveDrones = 'Required';
    if (!form.maxRange) e.maxRange = 'Required';
    if (!form.minRange) e.minRange = 'Required';
    if (!form.locationAddress) e.locationAddress = 'Warehouse location is required';
    if (active + inactive !== total) e.inactiveDrones = 'Active + Inactive must equal Total';
    if (Number(form.minRange) > Number(form.maxRange)) e.minRange = 'Min range cannot exceed max range';
    return e;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');

    try {
      const name = "My Company";
      const address = form.locationAddress;
      const latitude = form.locationLat ? parseFloat(form.locationLat) : undefined;
      const longitude = form.locationLng ? parseFloat(form.locationLng) : undefined;

      console.log({ name, address, latitude, longitude });

      const response = await axios.post("/company", {
        name,
        address,
        latitude,
        longitude
      });

      console.log('✅ [CompanySetup] Response:', response.data);

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {
      console.error('❌ [CompanySetup] Full error object:', err);

      if (err.response) {
        // Server replied with an error status code
        const status = err.response.status;
        const data = err.response.data;

        console.error(`❌ [CompanySetup] Server error ${status}:`, data);

        // Extract message — try multiple possible field names
        const serverMsg =
          data?.message ||
          data?.error ||
          (typeof data === 'string' ? data : null) ||
          `Server error ${status}`;

        setApiError(`${serverMsg} (HTTP ${status})`);

      } else if (err.request) {
        // Request was made but no response received — backend not running
        console.error('❌ [CompanySetup] No response — backend may be offline:', err.request);
        setApiError('Cannot connect to server. Make sure the backend is running on http://localhost:5000');
      } else {
        // Something else went wrong
        console.error('❌ [CompanySetup] Unexpected error:', err.message);
        setApiError(`Unexpected error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
            <span className="text-green-400 text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-black text-green-400 uppercase tracking-widest">Setup Complete!</h2>
          <p className="text-dark-400 text-sm">Redirecting to dashboard…</p>
        </motion.div>
      </div>
    );
  }

  // ── Main form — plain <form> tag (no motion wrapper on the form itself) ───
  return (
    <div className="min-h-screen bg-dark-950 flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-3xl space-y-6"
      >

        {/* Page heading */}
        <div className="space-y-1 mb-2">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Company Setup</h1>
          <p className="text-dark-400 text-sm">Configure your fleet and operational parameters.</p>
        </div>

        {/* API error banner */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-sm"
            >
              ⚠️ {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FLEET OVERVIEW ─────────────────────────────────────────────── */}
        <div className="premium-card p-6 space-y-5">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-dark-500 border-b border-dark-800 pb-3">
            Fleet Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Field label="Total Drones" hint="Overall fleet size" error={errors.totalDrones}>
              <input
                id="totalDrones"
                name="totalDrones"
                type="number"
                min="0"
                value={form.totalDrones}
                onChange={handleChange}
                placeholder="e.g. 20"
                className={inputClass}
                autoComplete="off"
              />
            </Field>

            <Field label="Active Drones" hint="Ready to deploy" error={errors.activeDrones}>
              <input
                id="activeDrones"
                name="activeDrones"
                type="number"
                min="0"
                value={form.activeDrones}
                onChange={handleChange}
                placeholder="e.g. 15"
                className={inputClass}
                autoComplete="off"
              />
            </Field>

            <Field label="Inactive Drones" hint="In maintenance / offline" error={errors.inactiveDrones}>
              <input
                id="inactiveDrones"
                name="inactiveDrones"
                type="number"
                min="0"
                value={form.inactiveDrones}
                onChange={handleChange}
                placeholder="e.g. 5"
                className={inputClass}
                autoComplete="off"
              />
              {form.totalDrones && form.activeDrones && form.inactiveDrones && (
                <p className={`text-xs mt-1 ${sumOk ? 'text-green-400' : 'text-yellow-400'}`}>
                  {sumOk
                    ? `✓ ${active} + ${inactive} = ${total}`
                    : `${active} + ${inactive} ≠ ${total}`}
                </p>
              )}
            </Field>

          </div>
        </div>

        {/* ── OPERATIONAL RANGE ──────────────────────────────────────────── */}
        <div className="premium-card p-6 space-y-5">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-dark-500 border-b border-dark-800 pb-3">
            Operational Range
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Max Range (km)" hint="Maximum delivery radius" error={errors.maxRange}>
              <input
                id="maxRange"
                name="maxRange"
                type="number"
                min="0"
                value={form.maxRange}
                onChange={handleChange}
                placeholder="e.g. 100"
                className={inputClass}
                autoComplete="off"
              />
            </Field>

            <Field label="Min Range (km)" hint="Minimum operational distance" error={errors.minRange}>
              <input
                id="minRange"
                name="minRange"
                type="number"
                min="0"
                value={form.minRange}
                onChange={handleChange}
                placeholder="e.g. 1"
                className={inputClass}
                autoComplete="off"
              />
            </Field>

          </div>
        </div>

        {/* ── WAREHOUSE LOCATION ─────────────────────────────────────────── */}
        <div className="premium-card p-6 space-y-5">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-dark-500 border-b border-dark-800 pb-3">
            Warehouse Location
          </h2>

          <Field label="Address" hint="Primary warehouse or HQ address" error={errors.locationAddress}>
            <input
              id="locationAddress"
              name="locationAddress"
              type="text"
              value={form.locationAddress}
              onChange={handleChange}
              placeholder="e.g. 123 Logistics Ave, Mumbai"
              className={inputClass}
              autoComplete="off"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Latitude" hint="Optional GPS coordinate">
              <input
                id="locationLat"
                name="locationLat"
                type="number"
                step="any"
                value={form.locationLat}
                onChange={handleChange}
                placeholder="e.g. 19.0760"
                className={inputClass}
                autoComplete="off"
              />
            </Field>

            <Field label="Longitude" hint="Optional GPS coordinate">
              <input
                id="locationLng"
                name="locationLng"
                type="number"
                step="any"
                value={form.locationLng}
                onChange={handleChange}
                placeholder="e.g. 72.8777"
                className={inputClass}
                autoComplete="off"
              />
            </Field>

          </div>
        </div>

        {/* ── DRONE TYPES ────────────────────────────────────────────────── */}
        <div className="premium-card p-6 space-y-5">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-dark-500 border-b border-dark-800 pb-3">
            Drone Types in Fleet
          </h2>
          <p className="text-xs text-dark-400">Select all aircraft categories operated by your company.</p>

          <div className="flex flex-wrap gap-3">
            {DRONE_TYPE_OPTIONS.map((type) => {
              const selected = form.droneTypes.includes(type);
              return (
                <motion.button
                  key={type}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDroneType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${selected
                    ? 'bg-primary-500/20 border-primary-500 text-primary-300'
                    : 'bg-dark-800 border-dark-600 text-dark-400 hover:border-dark-400'
                    }`}
                >
                  {selected ? '✓ ' : ''}{type}
                </motion.button>
              );
            })}
          </div>

          {form.droneTypes.length > 0 && (
            <p className="text-xs text-dark-500">
              Selected: <span className="text-primary-400">{form.droneTypes.join(', ')}</span>
            </p>
          )}
        </div>

        {/* ── MAINTENANCE NOTES ──────────────────────────────────────────── */}
        <div className="premium-card p-6 space-y-5">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-dark-500 border-b border-dark-800 pb-3">
            Maintenance Notes
          </h2>

          <Field label="Notes" hint="Optional — any fleet maintenance context or alerts">
            <textarea
              id="maintenanceNotes"
              name="maintenanceNotes"
              rows={4}
              value={form.maintenanceNotes}
              onChange={handleChange}
              placeholder="e.g. Drone #7 scheduled for propeller replacement on 15th..."
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        {/* ── SUBMIT ─────────────────────────────────────────────────────── */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed
            rounded-2xl text-white font-black uppercase tracking-widest text-sm
            transition-colors shadow-xl shadow-primary-900/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Saving…
            </span>
          ) : (
            'Complete Setup'
          )}
        </motion.button>

      </form>
    </div>
  );
}