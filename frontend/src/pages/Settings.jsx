import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Moon, 
  Key, 
  Save, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states
  const [accountInfo, setAccountInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    candidateApplies: true,
    interviewAcceptance: true,
    weeklyReport: false,
    marketingEmails: false,
  });

  const [darkMode, setDarkMode] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    // Simulate saving changes
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 border border-slate-800 text-white relative overflow-hidden mb-8 shadow-xl">
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 text-violet-300 text-xs font-semibold rounded-full border border-violet-500/30 mb-4">
            <SettingsIcon size={12} />
            <span>Control Panel</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight margin-0!">
            Portal Settings
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed max-w-xl">
            Manage your account credentials, toggle notification preferences, and configure developer credentials from a clean central workspace.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Account Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Profile */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User size={18} className="text-violet-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Account Credentials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</label>
                <div className="relative mt-1.5 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User size={14} />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    value={accountInfo.name}
                    onChange={handleAccountChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Work Email Address</label>
                <div className="relative mt-1.5 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={14} />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={accountInfo.email}
                    onChange={handleAccountChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Lock size={18} className="text-violet-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Change Password</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Current Password</label>
                <div className="relative mt-1.5 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={14} />
                  </div>
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    name="currentPassword"
                    value={accountInfo.currentPassword}
                    onChange={handleAccountChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">New Password</label>
                  <div className="relative mt-1.5 rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={14} />
                    </div>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      name="newPassword"
                      value={accountInfo.newPassword}
                      onChange={handleAccountChange}
                      placeholder="Min 6 characters"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Confirm New Password</label>
                  <div className="relative mt-1.5 rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={14} />
                    </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={accountInfo.confirmPassword}
                      onChange={handleAccountChange}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Keys Configuration */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-violet-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Developer Tokens</h3>
              </div>
              <button 
                type="button" 
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer transition-colors"
              >
                Generate Token
              </button>
            </div>
            
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed mb-4">
              Use API tokens to connect your dashboard with external applicant tracking systems, build custom application webhooks, or query job listings programmatically.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 rounded-xl flex items-center justify-between font-mono text-[10px] text-slate-500 dark:text-slate-400">
              <span>tf_live_2026_5e100f72da0c7...</span>
              <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded font-sans font-semibold">Active</span>
            </div>
          </div>

        </div>

        {/* Right Column: Preferences, Notifications & Save */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Notifications Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Bell size={18} className="text-violet-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Email Notifications</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Candidate Applications</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Receive immediate alert when a new resume is submitted.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.candidateApplies}
                  onChange={() => handleNotificationToggle('candidateApplies')}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Interview Confirmations</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Alert when candidates accept or reschedule interview bids.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.interviewAcceptance}
                  onChange={() => handleNotificationToggle('interviewAcceptance')}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Weekly Performance Report</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Summary of applicant counts, hiring trends and conversions.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.weeklyReport}
                  onChange={() => handleNotificationToggle('weeklyReport')}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Theme Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Moon size={18} className="text-violet-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Portal Display</h3>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
              <div className="flex items-center gap-2">
                <Moon size={14} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Force Dark Theme</span>
              </div>
              <input 
                type="checkbox" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Save panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm text-center">
            {saved && (
              <div className="text-xs text-emerald-500 font-semibold mb-4 flex items-center justify-center gap-1">
                <Sparkles size={14} className="animate-pulse" /> Settings applied!
              </div>
            )}
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={16} />
                  <span>Apply Changes</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
};

export default Settings;
