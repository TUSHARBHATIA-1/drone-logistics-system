import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, Clock, Trash2, Battery, Plane, CheckCheck, Package, ArrowRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const Notifications = () => {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  React.useEffect(() => {
    console.log("Notifications Loaded");
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'Battery': return <Battery className="w-5 h-5 text-red-400" />;
      case 'Success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return <Info className="w-5 h-5 text-primary-400" />;
    }
  };

  const getBadgeStyles = (type) => {
    switch (type) {
      case 'Battery': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Success': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-primary-500/10 text-primary-400 border-primary-500/20';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse p-8">
        <div className="h-10 w-64 bg-dark-900 rounded-xl mb-12"></div>
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-dark-900 rounded-2xl border border-dark-800"></div>)}
      </div>
    );
  }

  try {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-white font-bold">Center of Alerts</h2>
          <p className="text-dark-400 mt-1">Review critical system events and mission updates.</p>
        </div>
        <button 
          type="button"
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-dark-800 rounded-xl hover:bg-dark-800 transition-all text-xs font-bold text-dark-200 uppercase tracking-widest"
        >
          <CheckCheck className="w-4 h-4" /> Mark All Read
        </button>
      </div>

      <div className="space-y-4">
        {!Array.isArray(notifications) || notifications.length === 0 ? (
          <div className="glass-card py-24 flex flex-col items-center justify-center opacity-40">
            <Bell className="w-16 h-16 mb-6" />
            <p className="text-lg font-medium">No system notifications found.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif?._id || Math.random()} 
              className={`glass-card p-6 flex gap-6 group transition-all duration-300 ${!notif?.isRead ? 'border-primary-500/30 bg-primary-500/5 shadow-lg shadow-primary-500/5' : 'hover:border-dark-700'}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-dark-950 border border-dark-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                {getIcon(notif?.type)}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg text-white font-outfit font-bold">{notif?.title || 'System Notification'}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getBadgeStyles(notif?.type)}`}>
                      {notif?.type || 'Update'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] text-dark-600 font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> {new Date(notif?.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button 
                      type="button"
                      onClick={() => deleteNotification(notif?._id)}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg text-dark-600 hover:text-red-400 transition-all ml-2"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-dark-300 leading-relaxed font-medium">{notif?.message}</p>
                
                <div className="flex gap-4 pt-3 items-center">
                  {notif?.assignment && (
                    <button type="button" className="flex items-center gap-2 text-[10px] font-black uppercase text-primary-500 hover:text-primary-400 tracking-tighter transition-colors group/btn">
                      <Package className="w-3.5 h-3.5" /> Track Mission <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  )}
                  {!notif?.isRead && (
                    <button 
                      type="button"
                      onClick={() => markAsRead(notif?._id)}
                      className="text-[10px] font-black uppercase text-dark-500 hover:text-white tracking-tighter flex items-center gap-1.5"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    );
  } catch (err) {
    console.error("Notifications Render Error:", err);
    return (
      <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-primary-500/20 rounded-3xl bg-primary-600/5 mx-auto max-w-4xl">
        <Bell className="w-16 h-16 text-primary-500 mb-6" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Alert Center Offline</h3>
        <p className="text-dark-400 font-medium text-center mt-2 px-8">The notification bus has encountered a structural relay failure. Telemetry lost.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-8 px-10 py-4 rounded-2xl">Re-sync Alerts</button>
      </div>
    );
  }
};

export default Notifications;
