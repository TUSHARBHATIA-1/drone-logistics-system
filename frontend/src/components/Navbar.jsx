import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plane, 
  Store, 
  Activity, 
  Bell, 
  User, 
  Package, 
  Search, 
  Battery, 
  AlertTriangle, 
  Info, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const notificationContext = useNotifications();
  const unreadCount = notificationContext?.unreadCount || 0;
  const notifications = notificationContext?.notifications || [];
  const markAsRead = notificationContext?.markAsRead || (() => {});
  const markAllAsRead = notificationContext?.markAllAsRead || (() => {});
  
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Fleet', path: '/drones', icon: Plane },
    { name: 'Marketplace', path: '/marketplace', icon: Store },
    { name: 'Tracking', path: '/monitoring', icon: Activity },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <header className="h-24 bg-dark-950/60 backdrop-blur-2xl border-b border-dark-900/50 sticky top-0 z-50 transition-all duration-500 overflow-hidden">
      <div className="max-w-screen-xl mx-auto w-full h-full px-4 flex items-center justify-between overflow-hidden">
        {/* Brand & Desktop Nav */}
        <div className="flex items-center gap-4 md:gap-8 overflow-hidden flex-wrap lg:flex-nowrap">
          <Link to="/" className="flex items-center gap-3 group relative shrink-0">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="bg-primary-600 p-2 rounded-2xl shadow-xl shadow-primary-600/20"
            >
              <Package className="text-white w-6 h-6" />
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tight text-white leading-none">
                SkyLogist <span className="text-primary-500">AI</span>
              </h1>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-dark-500 mt-0.5">Autonomous Ops</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-hidden flex-wrap">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `relative flex items-center gap-2 px-3 xl:px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-500 group shrink-0 ${
                    isActive 
                      ? 'text-white' 
                      : 'text-dark-500 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-3.5 h-3.5 transition-colors duration-500 ${isActive ? 'text-primary-500' : 'group-hover:text-primary-400'}`} />
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow"
                        className="absolute inset-0 bg-primary-500/10 border border-primary-500/20 rounded-xl -z-10 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 shrink-0">

        {/* Notifications */}
        <div className="relative">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowMobileMenu(false);
            }}
            className={`relative w-12 h-12 flex items-center justify-center rounded-2xl bg-dark-900 border transition-all ${showNotifDropdown ? 'border-primary-500/50 bg-primary-500/10' : 'border-dark-800'}`}
          >
            <Bell className={`w-5 h-5 transition-colors ${showNotifDropdown ? 'text-primary-400' : 'text-dark-400'}`} />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-[10px] font-black text-white flex items-center justify-center rounded-full border-4 border-dark-950 shadow-lg shadow-primary-900/40"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-96 premium-card overflow-hidden shadow-2xl z-50 border-primary-500/20"
              >
                <div className="p-5 border-b border-dark-800 flex items-center justify-between bg-dark-900/40">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">Neural Hub Notifications</h4>
                  <button 
                    onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                    className="text-[10px] text-primary-500 font-black uppercase tracking-widest hover:text-primary-400 transition-colors"
                  >
                    Purge All
                  </button>
                </div>
                <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                  {!Array.isArray(notifications) || notifications.length === 0 ? (
                    <div className="p-12 text-center opacity-40">
                      <Bell className="w-12 h-12 mx-auto mb-4 text-dark-700" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No active telemetry</p>
                    </div>
                  ) : (
                    notifications.map((notif, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={notif?._id || i} 
                        onClick={() => {
                          markAsRead(notif?._id);
                          setShowNotifDropdown(false);
                        }}
                        className={`p-5 border-b border-dark-900/50 flex gap-4 hover:bg-dark-900/80 transition-all cursor-pointer group/item ${!notif?.isRead ? 'bg-primary-500/5 shadow-inner shadow-primary-500/5' : ''}`}
                      >
                        <div className="mt-1 transform group-hover/item:scale-110 transition-transform">
                          {notif?.type === 'Battery' ? <Battery className="w-4 h-4 text-red-400" /> :
                           notif?.type === 'Success' ? <Plane className="w-4 h-4 text-green-400" /> :
                           notif?.type === 'Warning' ? <AlertTriangle className="w-4 h-4 text-yellow-400" /> :
                           <Info className="w-4 h-4 text-blue-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-white uppercase tracking-tight mb-1">{notif?.title || 'System Dispatch'}</p>
                          <p className="text-[11px] text-dark-500 leading-relaxed line-clamp-2">{notif?.message}</p>
                        </div>
                        {!notif?.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0 self-center animate-pulse"></div>}
                      </motion.div>
                    ))
                  )}
                </div>
                <Link 
                  to="/notifications" 
                  onClick={() => setShowNotifDropdown(false)}
                  className="block p-4 text-center text-[9px] font-black uppercase tracking-[0.3em] text-dark-500 hover:text-white hover:bg-dark-900 transition-all border-t border-dark-900"
                >
                  Access Global Logs
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User & Logout */}
        <div className="hidden sm:flex items-center gap-6 pl-4 border-l border-dark-900">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-black text-white mb-0.5 uppercase tracking-tight">{user?.companyName || 'Lead Admin'}</p>
            <div className="flex items-center justify-end gap-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               <p className="text-[9px] text-dark-600 uppercase font-black tracking-widest leading-none">Verified Pilot</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { logout(); navigate('/login'); }}
            className="w-12 h-12 rounded-2xl bg-dark-900 border border-dark-800 flex items-center justify-center text-red-500/80 hover:text-red-400 hover:border-red-500/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowMobileMenu(!showMobileMenu);
            setShowNotifDropdown(false);
          }}
          className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-dark-900 border border-dark-800 text-white"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[100px] left-6 right-6 bg-dark-950 border border-dark-900/50 rounded-[32px] p-8 shadow-2xl lg:hidden z-50 overflow-hidden backdrop-blur-3xl"
          >
            <nav className="flex flex-col gap-3">
              {navItems.map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.path}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-5 p-5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${
                        isActive 
                          ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/20' 
                          : 'text-dark-500 hover:bg-dark-900/80 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </motion.div>
              ))}
              <div className="h-px bg-dark-900 my-4 opacity-50"></div>
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-5 p-5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase tracking-widest text-xs"
              >
                <LogOut className="w-5 h-5" />
                <span>De-authorize Hub</span>
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;