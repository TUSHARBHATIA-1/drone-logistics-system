import React, { useState } from 'react';
import { Search, Bell, Menu, User, Battery, Plane, Info, AlertTriangle, ChevronDown } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'Battery': return <Battery className="w-4 h-4 text-red-400" />;
      case 'Success': return <Plane className="w-4 h-4 text-green-400" />;
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <header className="h-20 bg-dark-950/50 backdrop-blur-xl border-b border-dark-900 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 group-focus-within:text-primary-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for drones, routes, or pilots..." 
            className="input-field w-full pl-12 bg-dark-900/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-dark-900 border border-dark-800 hover:border-dark-700 transition-all group"
          >
            <Bell className="w-5 h-5 text-dark-400 group-hover:text-dark-50 transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-primary-600 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-dark-900 animate-in zoom-in">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-dark-950 border border-dark-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-dark-900 flex items-center justify-between bg-dark-900/20">
                <h4 className="text-xs font-black uppercase tracking-widest text-white">Notifications</h4>
                <button 
                  onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                  className="text-[10px] text-primary-500 font-bold hover:underline py-1 px-2"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center opacity-40">
                    <Bell className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-xs font-medium">No alerts found</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div 
                      key={notif._id} 
                      onClick={() => {
                        markAsRead(notif._id);
                        setShowDropdown(false);
                      }}
                      className={`p-4 border-b border-dark-900/50 flex gap-3 hover:bg-dark-900 transition-colors cursor-pointer ${!notif.isRead ? 'bg-primary-500/5' : ''}`}
                    >
                      <div className="mt-1">{getIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{notif.title}</p>
                        <p className="text-xs text-dark-500 line-clamp-2 mt-0.5 leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-dark-600 font-medium mt-2 inline-block">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {!notif.isRead && <div className="w-2 h-2 bg-primary-600 rounded-full shrink-0 self-center"></div>}
                    </div>
                  ))
                )}
              </div>
              <Link 
                to="/notifications" 
                onClick={() => setShowDropdown(false)}
                className="block p-3 text-center text-[10px] font-black uppercase tracking-widest text-dark-400 hover:text-white hover:bg-dark-900 transition-colors border-t border-dark-900"
              >
                View all system logs
              </Link>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-dark-800"></div>

        <div className="flex items-center gap-4 pl-2 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">Global Logistics Corp</p>
            <p className="text-xs text-dark-400">Company Account</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center border border-primary-400/50 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all">
            <User className="text-white w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
