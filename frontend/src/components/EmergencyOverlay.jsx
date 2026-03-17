import React from 'react';
import { AlertTriangle, MapPin, Navigation, Clock, X, Terminal, ShieldAlert } from 'lucide-react';

const EmergencyOverlay = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-red-950/40 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-dark-950 border border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-3xl overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-red-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg animate-pulse">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-outfit font-black text-white uppercase tracking-tighter">Emergency Protocol Active</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold text-white leading-tight">Safety Override Initiated</h3>
            <p className="text-dark-400 font-medium italic">"{data?.message}"</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-dark-900 border border-dark-800 rounded-2xl space-y-1">
              <p className="text-[10px] text-dark-500 uppercase tracking-widest font-black">Target Location</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-bold text-white truncate">{data?.nearestHub}</span>
              </div>
            </div>
            <div className="p-4 bg-dark-900 border border-dark-800 rounded-2xl space-y-1">
              <p className="text-[10px] text-dark-500 uppercase tracking-widest font-black">Est. Distance</p>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white">{data?.distance} Units</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-dark-900/50 border border-dark-800 rounded-2xl border-dashed">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-4 h-4 text-primary-500" />
              <p className="text-[10px] text-dark-500 uppercase tracking-widest font-black">Calculated Escape Route</p>
            </div>
            <p className="text-sm font-mono text-primary-400 leading-relaxed font-bold tracking-tight">
              {data?.route}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-dark-500">
            <Clock className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Redirecting Flight Vector...</span>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="w-full py-4 bg-dark-900 hover:bg-dark-800 border border-dark-800 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
          >
            Acknowledge & Sync Control
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyOverlay;
