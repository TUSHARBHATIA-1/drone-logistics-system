import React from 'react';
import { User, Building, MapPin, Mail, Phone, Shield, CreditCard, Bell } from 'lucide-react';

import { motion } from 'framer-motion';

const Profile = () => {
  const [loading, setLoading] = React.useState(true);
  const [userInfo, setUserInfo] = React.useState(null);

  React.useEffect(() => {
    console.log("Profile Loaded");
    try {
      const saved = localStorage.getItem('userInfo');
      if (saved) setUserInfo(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to parse userInfo', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-primary-500 font-outfit text-2xl font-black italic tracking-[0.3em] uppercase"
      >
        Syncing Identity...
      </motion.div>
    </div>
  );

  try {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto space-y-12"
      >
      <motion.div variants={cardVariants}>
        <h2 className="text-4xl text-white font-black uppercase tracking-tight">Operator <span className="text-primary-500">Matrix</span></h2>
        <p className="text-dark-400 mt-2 font-medium">Manage your global industrial credentials and fleet protocols.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-8">
          <motion.div variants={cardVariants} className="premium-card p-8 text-center bg-dark-900/40">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-primary-900 mx-auto flex items-center justify-center border-4 border-dark-900 shadow-2xl mb-6 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Building className="text-white w-12 h-12" />
            </motion.div>
            <h3 className="text-xl text-white font-black uppercase tracking-tight truncate px-2">{userInfo?.companyName || userInfo?.name || 'Logistics Partner'}</h3>
            <p className="text-[10px] text-dark-500 font-black uppercase tracking-[0.3em] mt-2 opacity-60">
              Payload Sector {new Date(userInfo?.createdAt || Date.now()).getFullYear()}
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button" 
              className="mt-8 w-full btn-secondary py-3 text-[10px] font-black uppercase tracking-widest"
            >
              Update Fleet Logo
            </motion.button>
          </motion.div>

          <motion.div variants={cardVariants} className="premium-card p-6 space-y-4 bg-dark-900/40">
            <h4 className="text-[10px] font-black text-dark-500 uppercase tracking-[0.3em] pl-2">System Trust</h4>
            <div className="flex items-center gap-4 p-4 bg-green-500/5 border border-green-500/20 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Shield className="text-green-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-green-400 font-black uppercase tracking-widest">KYC Status</p>
                <p className="text-xs text-white font-black uppercase tracking-tight">Verified Protocol</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={cardVariants} className="premium-card p-10 bg-dark-900/40">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8 border-b border-dark-800 pb-6 opacity-60">General Manifest</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest pl-2">Master Terminal Admin</label>
                  <div className="flex items-center gap-4 px-6 py-4 bg-dark-950 border border-dark-800 rounded-2xl text-dark-100 transition-colors hover:border-primary-500/30">
                    <User className="w-5 h-5 text-dark-600" /> 
                    <span className="text-sm font-bold truncate">{userInfo?.contactPerson || 'Account Admin'}</span>
                  </div>
                </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest pl-2">Secured Frequency</label>
                  <div className="flex items-center gap-4 px-6 py-4 bg-dark-950 border border-dark-800 rounded-2xl text-dark-100 transition-colors hover:border-primary-500/30">
                    <Mail className="w-5 h-5 text-dark-600" /> 
                    <span className="text-sm font-bold truncate">{userInfo?.email || 'contact@company.io'}</span>
                  </div>
                </div>
               <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest pl-2">Global Operations Hub</label>
                  <div className="flex items-center gap-4 px-6 py-4 bg-dark-950 border border-dark-800 rounded-2xl text-dark-100 transition-colors hover:border-primary-500/30">
                    <MapPin className="w-5 h-5 text-dark-600" /> 
                    <span className="text-sm font-bold">{userInfo?.warehouseAddress || 'Main Hub Location'}</span>
                  </div>
                </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button" 
              className="btn-primary mt-12 px-12 py-5 rounded-2xl"
            >
              Push Manifest Updates
            </motion.button>
          </motion.div>

          <motion.div variants={cardVariants} className="premium-card p-10 bg-dark-900/40">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8 border-b border-dark-800 pb-6 opacity-60">Security & Billing Protocls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: CreditCard, title: 'Acquisition Method', desc: 'Secure Terminal (•••• 4242)' },
                { icon: Bell, title: 'Alert Protocols', desc: 'Real-time telemetry active' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  className="flex items-center justify-between p-6 bg-dark-950 rounded-2xl border border-dark-800 group cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-dark-900 rounded-xl border border-dark-800 group-hover:bg-primary-500/10 transition-colors">
                      <item.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-xs text-white font-black uppercase tracking-tight">{item.title}</p>
                      <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mt-1 opacity-60">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-dark-700 group-hover:text-primary-400 transition-all group-hover:translate-x-1" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      </motion.div>
    );
  } catch (err) {
    console.error("Profile Render Error:", err);
    return (
      <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-primary-500/20 rounded-3xl bg-primary-600/5 mx-auto max-w-4xl">
        <User className="w-16 h-16 text-primary-500 mb-6" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Identity Matrix Fault</h3>
        <p className="text-dark-400 font-medium text-center mt-2 px-8">The operator profile data stream has encountered a structural parity error. Credentials cached.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-8 px-10 py-4 rounded-2xl">Re-verify Identity</button>
      </div>
    );
  }
};

const ArrowRight = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-7-7l7 7-7 7"/>
    </svg>
);

export default Profile;
