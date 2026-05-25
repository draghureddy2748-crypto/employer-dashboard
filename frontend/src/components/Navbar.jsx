import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Building2, 
  User, 
  Sun, 
  Moon, 
  X, 
  Check, 
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Dark Mode Theme State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // Default to dark theme for premium Stripe/Linear styling
  });

  // Notifications States
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync theme to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Fetch every 15 seconds to simulate real-time updates
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await API.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, read: true } : n)
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await API.put('/notifications/read-all');
      if (res.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation(); // Avoid triggering markAsRead
    try {
      const res = await API.delete(`/notifications/${id}`);
      if (res.data.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Determine page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Overview';
      case '/jobs':
        return 'Job Postings';
      case '/applicants':
        return 'Applicants';
      case '/analytics':
        return 'Analytics';
      case '/profile':
        return 'Company Profile';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-8 flex items-center justify-between shrink-0 z-30 sticky top-0">
      {/* Left side: Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight margin-0!">
          {getPageTitle()}
        </h1>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-xs font-semibold rounded-full border border-violet-100/50 dark:border-violet-900/40">
          <Sparkles size={12} />
          <span>Employer Portal</span>
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block w-64">
          <input
            type="text"
            placeholder="Search candidate, job..."
            className="w-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/40 dark:border-slate-700/30 text-slate-500 dark:text-slate-300 rounded-xl cursor-pointer transition-colors duration-200"
          title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Dropdown Wrapper */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/40 dark:border-slate-700/30 text-slate-500 dark:text-slate-300 rounded-xl cursor-pointer transition-colors duration-200"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in-50 slide-in-from-top-3 duration-200">
              {/* Header */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-200">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-850">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n._id}
                      onClick={() => !n.read && handleMarkAsRead(n._id)}
                      className={`p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer relative ${
                        !n.read ? 'bg-slate-50/50 dark:bg-slate-800/10' : ''
                      }`}
                    >
                      {/* Left Dot indicator or icon */}
                      <div className="shrink-0 mt-0.5">
                        {n.type === 'new_applicant' ? (
                          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <User size={12} />
                          </div>
                        ) : n.type === 'job_status' ? (
                          <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <Info size={12} />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 rounded-lg">
                            <Sparkles size={12} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[11px] font-bold truncate ${
                            !n.read ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="h-1.5 w-1.5 bg-violet-500 rounded-full shrink-0"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed break-words">
                          {n.message}
                        </p>
                        <span className="text-[8px] text-slate-400 dark:text-slate-500 block mt-1.5 flex items-center gap-1">
                          <Calendar size={8} />
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Delete Trigger */}
                      <button 
                        onClick={(e) => handleDeleteNotification(n._id, e)}
                        className="absolute right-3 top-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 focus:opacity-100 p-0.5 rounded cursor-pointer"
                        style={{ opacity: 1 }} // Force visibility for easy access
                        title="Delete"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    No notifications yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        {/* User Info */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 justify-end">
              <User size={12} className="text-slate-400" />
              {user?.name}
            </p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
              <Building2 size={10} />
              {user?.companyName}
            </p>
          </div>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-100 to-indigo-100 dark:from-violet-950 dark:to-indigo-950 border border-violet-200/30 dark:border-violet-800/20 flex items-center justify-center font-bold text-violet-600 dark:text-violet-400">
            {user?.name?.charAt(0).toUpperCase() || 'E'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
