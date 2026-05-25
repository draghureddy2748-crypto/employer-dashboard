import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  BarChart3, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Building,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Applicants', path: '/applicants', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Company Profile', path: '/profile', icon: Building },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div 
      className={`relative h-screen bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-6 -right-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full p-1 border border-slate-800 shadow-md cursor-pointer transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div>
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800/60">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-violet-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TalentFlow
            </span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-8 px-3 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-md shadow-violet-600/10'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                <Icon size={20} className="shrink-0 transition-transform group-hover:scale-105 duration-200" />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                
                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile / Log out */}
      <div className="p-4 border-t border-slate-800/60">
        {!collapsed ? (
          <div className="bg-slate-800/40 border border-slate-800/40 rounded-xl p-3.5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
                {user?.name?.charAt(0).toUpperCase() || 'E'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.companyName}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-red-500/10 border border-slate-700/50 hover:border-red-500/20 hover:text-red-400 text-slate-400 text-xs font-medium rounded-lg cursor-pointer transition-all duration-200"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="flex items-center justify-center w-full py-3 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-400 cursor-pointer transition-all duration-200 group relative"
          >
            <LogOut size={20} />
            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 border border-slate-800 text-xs text-red-400 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
              Log out
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
