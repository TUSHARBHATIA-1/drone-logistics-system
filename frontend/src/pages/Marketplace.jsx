import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Key, 
  Tag, 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  Plane, 
  Zap, 
  DollarSign, 
  User, 
  MapPin, 
  CheckCircle2,
  X,
  Loader2,
  ShoppingCart,
  Phone,
  MessageSquare,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

const Marketplace = () => {
  const { addToCart, setIsCartOpen, cart } = useCart();
  const { addNotification } = useNotifications();
  const [activeSection, setActiveSection] = useState('purchase');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(15000);
  const [itemType, setItemType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Mock Data with Images
  const purchaseItems = [
    { 
      _id: 'p1', 
      modelNumber: 'SkyRaider v3', 
      type: 'drone', 
      price: 4500, 
      category: 'Urban Delivery', 
      maxWeight: 15, 
      maxDistance: 30,
      image: "https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?auto=format&fit=crop&q=80&w=800"
    },
    { 
      _id: 'p2', 
      modelNumber: 'Atlas Heavy-X', 
      type: 'drone', 
      price: 12000, 
      category: 'Industrial', 
      maxWeight: 60, 
      maxDistance: 20,
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800"
    },
    { 
      _id: 'p3', 
      modelNumber: 'Carbon Propeller Set', 
      type: 'parts', 
      price: 299, 
      category: 'Components', 
      stock: 15,
      image: "https://images.unsplash.com/photo-1559133967-372986477fc4?auto=format&fit=crop&q=80&w=800"
    },
    { 
      _id: 'p4', 
      modelNumber: 'High-Cap Battery 5000', 
      type: 'parts', 
      price: 150, 
      category: 'Power', 
      stock: 42,
      image: "https://images.unsplash.com/photo-1610056494052-6a4f83a8368c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const rentItems = [
    { 
      _id: 'r1', 
      modelNumber: 'Phantom X Rent', 
      price: 25, 
      type: 'drone', 
      category: 'Photography', 
      maxWeight: 2, 
      maxDistance: 10,
      image: "https://images.unsplash.com/photo-1527977966376-1c8418f9f108?auto=format&fit=crop&q=80&w=800"
    },
    { 
      _id: 'r2', 
      modelNumber: 'Industrial Crane Drone', 
      price: 85, 
      type: 'drone', 
      category: 'Construction', 
      maxWeight: 120, 
      maxDistance: 5,
      image: "https://images.unsplash.com/photo-1506941433945-99a2aa4bd50a?auto=format&fit=crop&q=80&w=800"
    },
    { 
      _id: 'r3', 
      modelNumber: 'Agricultural Sprayer', 
      price: 45, 
      type: 'drone', 
      category: 'Farming', 
      maxWeight: 40, 
      maxDistance: 15,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const sellItems = [
    { 
      _id: 's1', 
      name: 'Slightly Used Skyhawk', 
      price: 3200, 
      desc: 'Used for 3 months, perfect condition.', 
      seller: 'Apex Logistics', 
      contact: '+1 (555) 123-4567',
      image: "https://images.unsplash.com/photo-1524143986875-3b098d78b363?auto=format&fit=crop&q=80&w=800"
    },
    { 
      _id: 's2', 
      name: 'Custom Frame (Open Box)', 
      price: 450, 
      desc: 'Ordered wrong size. Still in plastic.', 
      seller: 'DroneHub', 
      contact: 'sales@dronehub.io',
      image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const repairServices = [
    { 
      _id: 'rp1', 
      name: 'Standard Maintenance', 
      price: 199, 
      desc: 'Software update, motor cleaning, sensor check.',
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800"
    },
    { 
      _id: 'rp2', 
      name: 'Crash Reconstruction', 
      price: 499, 
      desc: 'Full frame and component replacement service.',
      image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800"
    },
    { 
      _id: 'rp3', 
      name: 'Battery Re-Conditioning', 
      price: 75, 
      desc: 'Restore lost cell capacity and cycle count.',
      image: "https://images.unsplash.com/photo-1610056494052-6a4f83a8368c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  useEffect(() => {
    console.log("Marketplace Loaded");
    setTimeout(() => setLoading(false), 800);
  }, []);

  const sections = [
    { id: 'purchase', label: 'Purchase', icon: ShoppingBag },
    { id: 'rent', label: 'Rent', icon: Key },
    { id: 'sell', label: 'Sell', icon: Tag },
    { id: 'repair', label: 'Repair', icon: Wrench }
  ];

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800";
  };

  const renderSidebar = () => (
    <div className="w-80 flex-shrink-0 space-y-10 premium-card p-8 h-fit sticky top-28 bg-dark-900/60">
      <div className="space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-500 flex items-center gap-3 px-1">
          <Filter className="w-4 h-4 text-primary-500" /> Filters
        </h4>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-dark-400">Price Ceiling</label>
            <span className="text-xs font-black text-primary-400 tracking-tighter">${priceRange}</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="15000" 
            step="100" 
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-dark-950 rounded-lg appearance-none cursor-pointer accent-primary-500 border border-dark-800"
          />
        </div>

        <div className="space-y-4 pt-6 border-t border-dark-800">
          <label className="text-[10px] font-black uppercase tracking-widest text-dark-400 px-1">Asset Category</label>
          <div className="grid grid-cols-1 gap-2">
            {['all', 'drone', 'parts'].map(type => (
              <button 
                key={type}
                type="button"
                onClick={() => setItemType(type)}
                className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${itemType === type ? 'bg-primary-600/10 text-primary-400 border border-primary-500/30' : 'text-dark-500 hover:bg-dark-900 border border-transparent hover:text-white'}`}
              >
                <div className={`w-2 h-2 rounded-full ${itemType === type ? 'bg-primary-500' : 'bg-dark-800'}`}></div>
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 space-y-6 border-t border-dark-800">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-dark-500 px-1">Promoted Assets</h4>
        <div className="relative group overflow-hidden rounded-3xl border border-dark-800 hover:border-primary-500/30 transition-all">
          <img src="https://images.unsplash.com/photo-1544006659-f0b21884cb1d?auto=format&fit=crop&q=80&w=400" alt="Ad" className="w-full h-40 object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent p-6 flex flex-col justify-end">
            <p className="text-[9px] font-black text-primary-400 uppercase tracking-[0.3em] mb-2">Verified Partner</p>
            <h5 className="text-sm font-black text-white leading-tight uppercase tracking-tight">Sky-Link Pro Training</h5>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGrid = (data) => {
    if (!Array.isArray(data)) return null;
    
    const filtered = data.filter(item => {
      const matchSearch = (item?.modelNumber || item?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = (item?.price || 0) <= priceRange;
      const matchType = itemType === 'all' || item?.type === itemType;
      return matchSearch && matchPrice && matchType;
    });

    if (filtered.length === 0) return (
      <div className="col-span-full py-40 text-center opacity-40">
        <ImageIcon className="w-16 h-16 text-dark-700 mx-auto mb-6" />
        <p className="text-dark-500 font-black uppercase tracking-[0.3em] text-[10px]">No orbital signatures detected</p>
      </div>
    );

    return (
      <motion.div 
        variants={{
          animate: { transition: { staggerChildren: 0.1 } }
        }}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        {filtered.map((item) => (
          <motion.div 
            key={item?._id}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -10 }}
            className="premium-card group flex flex-col"
          >
            <div className="relative aspect-[16/11] overflow-hidden bg-dark-950">
              <motion.img 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                src={item?.image} 
                alt={item?.modelNumber || item?.name} 
                onError={handleImageError}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark-950 to-transparent"></div>
              <div className="absolute top-6 right-6">
                <span className="badge badge-primary">
                  {item?.type === 'parts' ? 'Comp.' : 'Ind.'}
                </span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl text-white uppercase tracking-tight leading-none">{item?.modelNumber || item?.name}</h3>
                <span className="text-2xl font-black text-primary-400 font-mono tracking-tighter leading-none">${item?.price}</span>
              </div>
              <p className="text-[10px] text-dark-500 font-black uppercase tracking-[0.2em] mb-8">
                {activeSection === 'purchase' ? item?.category : `${item?.price} / PH Rate`}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-dark-950 p-4 rounded-2xl border border-dark-900 group-hover:border-primary-500/20 transition-all">
                  <p className="text-[8px] text-dark-600 font-black uppercase mb-1 tracking-widest">Availability</p>
                  <p className="text-[10px] text-white font-black uppercase">Immediate</p>
                </div>
                <div className="bg-dark-950 p-4 rounded-2xl border border-dark-800 group-hover:border-primary-500/20 transition-all">
                  <p className="text-[8px] text-dark-600 font-black uppercase mb-1 tracking-widest">Protocol</p>
                  <p className="text-[10px] text-white font-black uppercase">Standard</p>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(item)}
                  type="button"
                  className="btn-primary flex-1 py-5 rounded-[20px] shadow-primary-500/10"
                >
                  <span className="flex items-center justify-center gap-3">
                     <ShoppingCart className="w-4 h-4" />
                     {activeSection === 'repair' ? 'Book Hub' : 'Initialize'}
                  </span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-dark-950 border border-dark-900 rounded-[20px] flex items-center justify-center hover:border-primary-500/50 hover:text-primary-400 transition-all text-dark-500"
                >
                  <ImageIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderSell = () => (
    <div className="space-y-10">
      <div className="premium-card p-12 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent flex flex-wrap items-center justify-between gap-10 border-primary-500/10">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-primary-600/20 rounded-3xl flex items-center justify-center border border-primary-500/30 shadow-xl shadow-primary-500/5 animate-float">
            <Tag className="w-10 h-10 text-primary-400" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Global Trading Hub</h3>
            <p className="text-dark-400 font-medium max-w-sm mt-1 leading-relaxed">Broadcast pre-owned industrial signatures to authorized agency pilots.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary group py-5 px-10 rounded-[24px]"
        >
          <span className="flex items-center gap-3">
             <Plus className="w-5 h-5" /> Initialize Fleet Listing
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sellItems.map(item => (
          <div key={item?._id} className="premium-card flex group overflow-hidden h-64 hover:-translate-y-1">
            <div className="w-56 h-full overflow-hidden bg-dark-950 relative">
              <img src={item?.image} alt={item?.name} className="w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-80 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-dark-950"></div>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div className="space-y-4">
                 <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight truncate max-w-[150px]">{item?.name}</h3>
                    <span className="text-2xl font-black text-primary-400 font-mono tracking-tighter">${item?.price}</span>
                 </div>
                 <div className="flex items-center gap-3 px-1">
                    <div className="w-2 h-2 rounded-full bg-primary-500 group-hover:animate-ping"></div>
                    <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">{item?.seller} Agent</span>
                 </div>
                 <p className="text-xs text-dark-400 line-clamp-2 font-medium italic opacity-70">"{item?.desc}"</p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedSeller(item)}
                  className="flex-1 py-4 bg-dark-950 border border-dark-800 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest hover:border-primary-500/50 transition-all flex items-center justify-center gap-3"
                >
                  <Phone className="w-4 h-4 text-primary-500" /> Access Intel
                </button>
                <button className="w-14 h-14 bg-dark-950 border border-dark-800 rounded-2xl flex items-center justify-center hover:border-primary-500/30 transition-all text-dark-500">
                  <MessageSquare className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  try {
    return (
      <div className="max-w-[1600px] mx-auto anim-fade-in space-y-12">
      <div className="flex gap-10 relative items-start">
        {renderSidebar()}

        <div className="flex-1 space-y-12 pb-20">
          <div className="flex flex-col xl:flex-row items-center gap-8">
            <div className="flex-1 relative group w-full">
              <div className="absolute inset-0 bg-primary-600/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-dark-600 group-focus-within:text-primary-500 transition-colors z-10" />
              <input 
                type="text" 
                placeholder="Synchronize searches for orbital hulls, sub-components, or agency services..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-900/60 backdrop-blur-2xl border border-dark-800 rounded-[28px] pl-16 pr-8 py-6 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:ring-8 focus:ring-primary-500/5 transition-all relative z-0"
              />
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-dark-900 border border-dark-800 rounded-[28px] hover:border-primary-500/50 transition-all group flex items-center gap-6 pr-10 pl-3 w-full xl:w-fit"
            >
              <div className="w-14 h-14 bg-dark-950 rounded-full flex items-center justify-center border border-dark-800 group-hover:border-primary-500/30 transition-all">
                <ShoppingCart className="w-6 h-6 text-dark-400 group-hover:text-primary-400 transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-dark-500 uppercase tracking-[0.2em] leading-none mb-1.5">Active Cargo</p>
                <p className="text-sm font-black text-white leading-none">{cart.length} Unit Signature{cart.length !== 1 ? 's' : ''}</p>
              </div>
              {cart.length > 0 && (
                <span className="absolute top-2 left-10 w-6 h-6 bg-primary-600 text-[10px] font-black text-white flex items-center justify-center rounded-full border-4 border-dark-950 shadow-lg shadow-primary-900/40">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-2 p-2 bg-dark-900/60 backdrop-blur-3xl rounded-[24px] border border-dark-800/80 w-fit">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-4 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeSection === s.id ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/40 translate-y-[-2px]' : 'text-dark-500 hover:text-white hover:bg-dark-900/50'}`}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              )
            })}
          </div>

          <div className="min-h-[800px]">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="premium-card aspect-[16/20] animate-pulse bg-dark-900/50 border-dark-800"></div>
                ))}
              </div>
            ) : (
              <div className="anim-fade-in">
                {activeSection === 'purchase' && renderGrid(purchaseItems)}
                {activeSection === 'rent' && renderGrid(rentItems)}
                {activeSection === 'sell' && renderSell()}
                {activeSection === 'repair' && renderGrid(repairServices)}
              </div>
            )}
          </div>
        </div>

        {/* Informational Modals */}
        {selectedSeller && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark-950/95 backdrop-blur-3xl anim-fade-in">
            <div className="relative w-full max-w-md premium-card p-12 space-y-10 text-center scale-up shadow-primary-500/10">
              <button 
                onClick={() => setSelectedSeller(null)} 
                className="absolute top-8 right-8 text-dark-500 hover:text-white transition-all bg-dark-900/50 p-2 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-28 h-28 bg-primary-600/15 rounded-full flex items-center justify-center mx-auto border border-primary-500/30 shadow-2xl shadow-primary-500/20 animate-float">
                <ImageIcon className="w-12 h-12 text-primary-400" />
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Access Granted</h3>
                <p className="text-sm text-dark-500 font-medium">Authorized link for {selectedSeller.seller} Entity</p>
              </div>

              <div className="p-8 bg-dark-950/80 rounded-[32px] border border-dark-800 font-mono text-2xl text-primary-400 select-all shadow-inner tracking-tight">
                {selectedSeller.contact}
              </div>

              <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-dark-600">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 Secure Session Established
              </div>
            </div>
          </div>
        )}

        {/* Submission Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark-950/95 backdrop-blur-3xl anim-fade-in">
            <div className="relative w-full max-w-2xl premium-card p-16 space-y-12 border-primary-500/20 shadow-primary-500/5">
              <button 
                onClick={() => setShowAddModal(false)} 
                className="absolute top-10 right-10 text-dark-500 hover:text-white bg-dark-900/50 p-3 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-6">
                <div className="bg-primary-600/20 p-4 rounded-3xl border border-primary-600/30 shadow-lg shadow-primary-500/10">
                  <Tag className="w-8 h-8 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tight leading-none">Initialize Listing</h3>
                  <p className="text-sm text-dark-400 font-medium mt-2">Submit your fleet signature for global verification.</p>
                </div>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  addNotification(
                    "Listing Initialized", 
                    "Fleet signature broadcast successful. Monitoring hub for buyer telemetry.", 
                    "Success"
                  );
                  setShowAddModal(false);
                }}
                className="grid grid-cols-2 gap-10"
              >
                <div className="space-y-4 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 px-1">Operational Designation</label>
                  <input type="text" placeholder="e.g. SKY-MASTER Core-7" className="input-field w-full py-5" required />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 px-1">Market Valuation ($)</label>
                  <input type="number" placeholder="4500" className="input-field w-full py-5" required />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 px-1">Logistics Tier</label>
                  <select className="input-field w-full bg-dark-900 py-5 h-[68px] text-xs font-black uppercase">
                    <option>Grade-A Signature</option>
                    <option>Field Operational</option>
                    <option>Refurbished Module</option>
                    <option>Structural Only</option>
                  </select>
                </div>

                <div className="space-y-4 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-dark-500 px-1">Telemetry Description</label>
                  <textarea rows="4" placeholder="Detail mission history, hull integrity, and orbital cycles..." className="input-field w-full resize-none py-5" required></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary col-span-2 py-6 rounded-[28px] mt-8 flex items-center justify-center gap-4 group/submit"
                >
                  <span className="flex items-center justify-center gap-4 text-xs">
                     Confirm Telemetry Broadcast
                     <ArrowRight className="w-5 h-5 group-hover/submit:translate-x-2 transition-transform" />
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    );
  } catch (err) {
    console.error("Marketplace Render Error:", err);
    return (
      <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-primary-500/20 rounded-3xl bg-primary-600/5 mx-auto max-w-4xl">
        <ShoppingCart className="w-16 h-16 text-primary-500 mb-6" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Marketplace Protocol Failure</h3>
        <p className="text-dark-400 font-medium text-center mt-2 px-8">The digital bazaar has encountered a structural integrity breach. Transactions paused.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-8 px-10 py-4 rounded-2xl">Re-sync Marketplace</button>
      </div>
    );
  }
};

export default Marketplace;
