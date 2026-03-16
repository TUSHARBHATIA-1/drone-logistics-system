import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plane, 
  ClipboardList, 
  Store, 
  Bell, 
  User, 
  LogOut,
  Package,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Drone Fleet', path: '/drones', icon: Plane },
    { name: 'Assignments', path: '/assignments', icon: ClipboardList },
    { name: 'Live Tracking', path: '/monitoring', icon: Activity },
    { name: 'Marketplace', path: '/marketplace', icon: Store },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-72 bg-dark-950 border-r border-dark-800 flex flex-col h-screen sticky top-0">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-primary-600 p-2 rounded-lg">
          <Package className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-outfit font-bold tracking-tight text-white">
          SkyLogist <span className="text-primary-500">AI</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-dark-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 group">
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
