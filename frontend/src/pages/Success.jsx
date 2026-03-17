import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight, LayoutDashboard } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-12">
        <div className="relative inline-block">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 bg-green-500/20 blur-[80px] rounded-full"
          ></motion.div>
          
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative w-40 h-40 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_20px_50px_rgba(34,197,94,0.3)] border-8 border-white/20"
          >
            <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
                d="M20 6L9 17l-5-5"
              />
            </svg>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none">
            Registry <span className="text-green-500">Confirmed</span>
          </h2>
          <p className="text-dark-400 font-medium text-lg leading-relaxed max-w-sm mx-auto">
            Payment verified. Your industrial payload is now synchronized with global logistics telemetry.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="premium-card p-8 bg-dark-900/30 border-green-500/20 flex items-center gap-6 text-left group hover:border-green-500/40 transition-all duration-700"
        >
           <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8 text-green-400" />
           </div>
           <div>
              <p className="text-[10px] text-dark-500 font-black uppercase tracking-[0.3em] mb-1">Network Status</p>
              <h4 className="text-white font-black uppercase text-sm tracking-widest">Active Delivery Vector</h4>
           </div>
           <motion.div 
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="ml-auto"
           >
              <ArrowRight className="w-5 h-5 text-green-500" />
           </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 gap-4 pt-6"
        >
          <motion.button 
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className="btn-primary py-6 rounded-3xl shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
          >
            <span className="flex items-center justify-center gap-4 text-xs">
              <LayoutDashboard className="w-5 h-5" />
              Access Command Center
            </span>
          </motion.button>
          
          <motion.button 
             whileHover={{ x: 5 }}
             onClick={() => navigate('/marketplace')}
             className="py-4 text-dark-500 hover:text-white font-black uppercase tracking-[0.3em] text-[10px] transition-colors flex items-center justify-center gap-4 group"
          >
             Return to Marketplace <ArrowRight className="w-4 h-4 text-primary-500 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;
