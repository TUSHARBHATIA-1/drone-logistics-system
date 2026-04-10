import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { submitCompanySetup } from '../services/companyService';

const DRONE_TYPE_OPTIONS = [
  'Fixed-Wing', 'Multi-Rotor', 'Single-Rotor', 'Hybrid VTOL',
  'Nano Drone', 'Cargo Drone', 'Racing Drone', 'Other'
];

const Field = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-dark-200 tracking-wide">{label}</label>
    {hint && <p className="text-xs text-dark-400">{hint}</p>}
    {children}
  </div>
);

const inputClass =
  'w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-dark-100 ' +
  'placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ' +
  'focus:border-primary-500 transition-all';

export default function CompanySetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    totalDrones:      '',
    activeDrones:     '',
    inactiveDrones:   '',
    maxRange:         '',
    minRange:         '',
    locationAddress:  '',
    locationLat:      '',
    locationLng:      '',
    droneTypes:       [],
    maintenanceNotes: '',
  });

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  // ── Derived sum indicator ──────────────────────────────
  const active   = Number(form.activeDrones)   || 0;
  const inactive = Number(form.inactiveDrones) || 0;
  const total    = Number(form.totalDrones)    || 0;
  const sumOk    = total > 0 && active + inactive === total;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' }));
    setApiError('');
  };

  const toggleDroneType = (type) => {
    setForm((f) => ({
      ...f,
      droneTypes: f.droneTypes.includes(type)
        ? f.droneTypes.filter((t) => t !== type)
        : [...f.droneTypes, type],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.totalDrones)     e.totalDrones     = 'Required';
    if (!form.activeDrones)    e.activeDrones     = 'Required';
    if (!form.inactiveDrones)  e.inactiveDrones   = 'Required';
    if (!form.maxRange)        e.maxRange         = 'Required';
    if (!form.minRange)        e.minRange         = 'Required';
    if (!form.locationAddress) e.locationAddress  = 'Warehouse location is required';

    if (form.totalDrones && form.activeDrones && form.inactiveDrones) {
      if (active + inactive !== total) {
        e.inactiveDrones = `Active (${active}) + Inactive (${inactive}) ≠ Total (${total})`;
      }
    }
    if (form.minRange && form.maxRange && Number(form.minRange) > Number(form.maxRange)) {
      e.minRange = 'Min range cannot exceed max range';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      await submitCompanySetup({
        totalDrones:  Number(form.totalDrones),
        activeDrones: Number(form.activeDrones),
        inactiveDrones: Number(form.inactiveDrones),
        maxRange: Number(form.maxRange),
        minRange: Number(form.minRange),
        location: {
          address: form.locationAddress,
          lat: form.locationLat ? Number(form.locationLat) : undefined,
          lng: form.locationLng ? Number(form.locationLng) : undefined,
        },
        droneTypes:       form.droneTypes,
        maintenanceNotes: form.maintenanceNotes,
      });

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2200);
    } catch (err) {
      if (err.response) {
        setApiError(err.response.data?.message || 'Setup failed. Please try again.');
      } else if (err.request) {
        setApiError('Cannot reach the server. Check your internet connection.');
      } else {
        setApiError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Success State ────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Setup Complete!</h2>
          <p className="text-dark-400">Your drone fleet is configured. Redirecting to dashboard…</p>
          <div className="mt-4 h-1 bg-dark-800 rounded-full overflow-hidden w-48 mx-auto">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Main Form ─────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-dark-950 flex items-start justify-center p-4 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-600/20 border border-primary-500/30 rounded-xl flex items-center justify-center text-xl">
              🚁
            </div>
            <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">Step 2 of 2</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Configure Your Drone Fleet</h1>
          <p className="text-dark-400">Tell us about your operational capacity so we can optimise assignments for you.</p>
        </div>

        {/* API Error */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm"
            >
              {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {/* ── Section: Fleet Numbers ─────────────────── */}
          <section className="bg-dark-900 border border-dark-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="text-primary-400">📊</span> Fleet Numbers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Total Drones *" >
                <input
                  type="number" name="totalDrones" min="0"
                  className={`${inputClass} ${errors.totalDrones ? 'border-red-500/60' : ''}`}
                  placeholder="e.g. 20"
                  value={form.totalDrones}
                  onChange={handleChange}
                />
                {errors.totalDrones && <p className="text-xs text-red-400 mt-1">{errors.totalDrones}</p>}
              </Field>

              <Field label="Working Drones *" hint="Operational units">
                <input
                  type="number" name="activeDrones" min="0"
                  className={`${inputClass} ${errors.activeDrones ? 'border-red-500/60' : ''}`}
                  placeholder="e.g. 15"
                  value={form.activeDrones}
                  onChange={handleChange}
                />
                {errors.activeDrones && <p className="text-xs text-red-400 mt-1">{errors.activeDrones}</p>}
              </Field>

              <Field label="Non-Working Drones *" hint="In repair / offline">
                <input
                  type="number" name="inactiveDrones" min="0"
                  className={`${inputClass} ${errors.inactiveDrones ? 'border-red-500/60' : ''}`}
                  placeholder="e.g. 5"
                  value={form.inactiveDrones}
                  onChange={handleChange}
                />
                {errors.inactiveDrones && <p className="text-xs text-red-400 mt-1">{errors.inactiveDrones}</p>}
              </Field>
            </div>

            {/* Live validation indicator */}
            {form.totalDrones && form.activeDrones && form.inactiveDrones && (
              <div className={`mt-4 flex items-center gap-2 text-sm font-medium ${sumOk ? 'text-green-400' : 'text-red-400'}`}>
                <span>{sumOk ? '✅' : '❌'}</span>
                <span>
                  {active} working + {inactive} non-working = {active + inactive} &nbsp;
                  {sumOk ? `✓ matches total (${total})` : `≠ total (${total})`}
                </span>
              </div>
            )}
          </section>

          {/* ── Section: Operational Range ─────────────── */}
          <section className="bg-dark-900 border border-dark-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="text-primary-400">📡</span> Operational Range
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Maximum Range (km) *">
                <input
                  type="number" name="maxRange" min="0" step="0.1"
                  className={`${inputClass} ${errors.maxRange ? 'border-red-500/60' : ''}`}
                  placeholder="e.g. 50"
                  value={form.maxRange}
                  onChange={handleChange}
                />
                {errors.maxRange && <p className="text-xs text-red-400 mt-1">{errors.maxRange}</p>}
              </Field>

              <Field label="Minimum Range (km) *">
                <input
                  type="number" name="minRange" min="0" step="0.1"
                  className={`${inputClass} ${errors.minRange ? 'border-red-500/60' : ''}`}
                  placeholder="e.g. 5"
                  value={form.minRange}
                  onChange={handleChange}
                />
                {errors.minRange && <p className="text-xs text-red-400 mt-1">{errors.minRange}</p>}
              </Field>
            </div>
          </section>

          {/* ── Section: Warehouse Location ─────────────── */}
          <section className="bg-dark-900 border border-dark-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span className="text-primary-400">📍</span> Warehouse Location
            </h2>
            <div className="space-y-4">
              <Field label="Address / Location *" hint="City, area or full address">
                <input
                  type="text" name="locationAddress"
                  className={`${inputClass} ${errors.locationAddress ? 'border-red-500/60' : ''}`}
                  placeholder="e.g. Plot 12, Industrial Zone, Mumbai"
                  value={form.locationAddress}
                  onChange={handleChange}
                />
                {errors.locationAddress && <p className="text-xs text-red-400 mt-1">{errors.locationAddress}</p>}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Latitude (optional)">
                  <input
                    type="number" name="locationLat" step="any"
                    className={inputClass}
                    placeholder="e.g. 19.0760"
                    value={form.locationLat}
                    onChange={handleChange}
                  />
                </Field>
                <Field label="Longitude (optional)">
                  <input
                    type="number" name="locationLng" step="any"
                    className={inputClass}
                    placeholder="e.g. 72.8777"
                    value={form.locationLng}
                    onChange={handleChange}
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* ── Section: Drone Types (optional) ─────────── */}
          <section className="bg-dark-900 border border-dark-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <span className="text-primary-400">🤖</span> Drone Types
              <span className="text-xs font-normal text-dark-500 ml-1">(optional)</span>
            </h2>
            <p className="text-xs text-dark-400 mb-4">Select all types that apply to your fleet.</p>
            <div className="flex flex-wrap gap-2">
              {DRONE_TYPE_OPTIONS.map((type) => {
                const selected = form.droneTypes.includes(type);
                return (
                  <button
                    key={type} type="button"
                    onClick={() => toggleDroneType(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selected
                        ? 'bg-primary-600 border-primary-500 text-white'
                        : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-primary-500/50'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Section: Maintenance Notes ───────────────── */}
          <section className="bg-dark-900 border border-dark-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <span className="text-primary-400">🔧</span> Maintenance Notes
              <span className="text-xs font-normal text-dark-500 ml-1">(optional)</span>
            </h2>
            <p className="text-xs text-dark-400 mb-4">Any notes about maintenance schedules, known issues, or operational constraints.</p>
            <textarea
              name="maintenanceNotes"
              rows={4}
              className={inputClass + ' resize-none'}
              placeholder="e.g. 3 drones scheduled for battery replacement next week…"
              value={form.maintenanceNotes}
              onChange={handleChange}
              maxLength={1000}
            />
            <p className="text-xs text-dark-500 mt-1 text-right">{form.maintenanceNotes.length}/1000</p>
          </section>

          {/* ── Submit ─────────────────────────────────── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-primary-600/20"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving Configuration…
              </>
            ) : (
              <>🚀 Complete Setup &amp; Go to Dashboard</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
