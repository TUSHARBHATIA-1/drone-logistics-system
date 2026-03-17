import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  ShieldCheck,
  Smartphone as UpiIcon,
  Wallet
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

import { motion, AnimatePresence } from 'framer-motion';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { addNotification } = useNotifications();
  const { total, items } = location.state || { total: 0, items: [] };
  
  const [method, setMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (clearCart) clearCart();
      if (addNotification) {
        addNotification(
          "Payment Successful", 
          `Secured payload acquisition of ${items?.length || 0} items for $${total}.`, 
          "Success"
        );
      }
      navigate('/success');
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-12 px-6"
    >
      <motion.button 
        whileHover={{ x: -10 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-widest">Back to Fleet</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Payment Methods */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight uppercase tracking-tight">Pay <span className="text-primary-500">Method</span></h2>
            <p className="text-dark-400 mt-2 text-sm font-medium">Select automated transaction protocol.</p>
          </div>

          <div className="space-y-3">
            {[
              { id: 'upi', icon: UpiIcon, label: 'UPI', desc: 'Secure Instant Frequency' },
              { id: 'card', icon: CreditCard, label: 'Card', desc: 'Global Credit Matrix' },
              { id: 'wallet', icon: Wallet, label: 'Wallet', desc: 'Stored Energy Credits' }
            ].map((m) => (
              <motion.button 
                key={m.id}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMethod(m.id)}
                className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${method === m.id ? 'bg-primary-500/10 border-primary-500 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'bg-dark-900/50 border-dark-800 hover:border-dark-700'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${method === m.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-dark-950 text-dark-400'}`}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">{m.label}</h4>
                    <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest opacity-60">{m.desc}</p>
                  </div>
                </div>
                {method === m.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle className="w-5 h-5 text-primary-500" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Middle Column: Item List */}
        <div className="lg:col-span-1 border-x border-dark-800/30 px-10 flex flex-col h-full">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-500 mb-8">Manifest Summary</h3>
           <motion.div 
             variants={containerVariants}
             initial="hidden"
             animate="show"
             className="flex-1 space-y-4 overflow-y-auto max-h-[450px] pr-4 custom-scrollbar"
           >
              {!Array.isArray(items) || items.length === 0 ? (
                <p className="text-sm text-dark-600 italic font-medium">No items found in acquisition queue.</p>
              ) : items.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  variants={itemVariants}
                  className="flex items-center gap-4 p-4 bg-dark-900/40 rounded-2xl border border-dark-800/50 hover:border-primary-500/30 transition-colors group"
                >
                  <div className="w-12 h-12 bg-dark-950 rounded-xl flex items-center justify-center border border-dark-800 group-hover:bg-primary-500/10 transition-colors">
                     <span className="text-[11px] font-black text-primary-500">#{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-white truncate uppercase tracking-tight">{item?.modelNumber || 'Acquisition'}</h4>
                    <p className="text-[9px] text-dark-500 font-black uppercase tracking-widest opacity-60">{item?.type || 'Part'}</p>
                  </div>
                  <span className="text-sm font-black text-white">${item?.price || 0}</span>
                </motion.div>
              ))}
           </motion.div>
           <div className="mt-10 pt-8 border-t border-dark-800/50 space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Total Assets</span>
                 <span className="text-sm font-black text-white">{items?.length || 0}</span>
              </div>
              <div className="flex justify-between items-end">
                 <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">Vault Total</span>
                 <span className="text-3xl font-black text-primary-400 tracking-tighter">${total}</span>
              </div>
           </div>
        </div>

        {/* Right Column: QR/Card Entry & Action */}
        <div className="lg:col-span-1 glass-card p-10 flex flex-col space-y-8 bg-dark-900/40 border-dark-800/50 relative overflow-hidden h-fit">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 blur-[80px] rounded-full"></div>
          
          <div className="text-center">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-2">Initialize Transfer</h3>
            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">Authorized Transaction Protocol</p>
          </div>

          <AnimatePresence mode="wait">
            {method === 'upi' ? (
              <motion.div 
                key="upi"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6 flex flex-col items-center"
              >
                <div className="p-4 bg-white rounded-[2.5rem] inline-block shadow-2xl shadow-primary-500/20 relative group">
                  <div className="absolute inset-0 bg-primary-500/5 rounded-[2.5rem] scale-105 group-hover:scale-110 transition-transform blur-xl"></div>
                  <img 
                    src="/upi_qr_placeholder.png" 
                    alt="UPI QR Code" 
                    className="w-48 h-48 relative z-10 opacity-90 mix-blend-multiply"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SkyLogistPayment';
                    }}
                  />
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-dark-950 border border-dark-800 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-dark-400 uppercase tracking-widest">Waiting for Scan...</span>
                </div>
              </motion.div>
            ) : (
               <motion.div 
                key="other"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full space-y-4 py-12"
               >
                  <div className="p-8 bg-dark-950/80 border-2 border-dashed border-dark-800 rounded-3xl text-dark-500 font-black text-[10px] uppercase tracking-[0.3em] leading-loose text-center">
                    Payment Gateway Authentication <br />
                    Pending Secure Token Handshake
                  </div>
               </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePay}
            disabled={loading}
            className="btn-primary w-full py-6 rounded-3xl text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.2)] group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                Confirm Payment
                <ArrowLeft className="w-4 h-4 text-white rotate-180 group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </motion.button>

          <div className="flex items-center justify-center gap-3 pt-2">
            <ShieldCheck className="w-4 h-4 text-primary-500" />
            <span className="text-[9px] font-black text-dark-500 uppercase tracking-[0.2em]">AES-256 Secure Uplink</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;
