import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building, 
  Globe, 
  MapPin, 
  Users, 
  Briefcase, 
  Save, 
  Sparkles,
  Link as LinkIcon,
  Plus,
  Trash2
} from 'lucide-react';

import API from '../services/api';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    name: user?.companyName || 'Acme Corp',
    website: 'https://acme.sh',
    location: 'San Francisco, CA (Hybrid)',
    employees: '50-200 employees',
    industry: 'Technology / SaaS',
    description: 'Building next-generation workflows and developer tools to supercharge product development cycles. Our platform connects thousands of engineers worldwide with state-of-the-art AI pair-programming utilities.',
    logoUrl: '',
    techStack: ['React', 'Node.js', 'Tailwind CSS', 'MongoDB', 'AWS', 'TypeScript'],
    benefits: ['100% Remote-friendly', 'Comprehensive Health Coverage', 'Unlimited PTO', 'Home Office Stipend', 'Learning & Development Budget']
  });

  const [newTech, setNewTech] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  // Fetch company data on mount
  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/company');
      if (res.data.success && res.data.company) {
        setCompanyInfo(res.data.company);
      }
    } catch (err) {
      console.error('Failed to load company profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTech = (e) => {
    e.preventDefault();
    if (newTech && !companyInfo.techStack.includes(newTech)) {
      setCompanyInfo(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech]
      }));
      setNewTech('');
    }
  };

  const handleRemoveTech = (tech) => {
    setCompanyInfo(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleAddBenefit = (e) => {
    e.preventDefault();
    if (newBenefit && !companyInfo.benefits.includes(newBenefit)) {
      setCompanyInfo(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit]
      }));
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefit) => {
    setCompanyInfo(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefit)
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompanyInfo(prev => ({
        ...prev,
        logoUrl: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await API.put('/company', companyInfo);
      if (res.data.success) {
        setCompanyInfo(res.data.company);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update company details:', err);
      alert(err.response?.data?.message || 'Failed to save company branding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 border border-slate-800 text-white relative overflow-hidden mb-8 shadow-xl">
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 text-violet-300 text-xs font-semibold rounded-full border border-violet-500/30 mb-4">
            <Building size={12} />
            <span>Company Branding</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight margin-0!">
            Company Profile
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed max-w-xl">
            Customize how your organization appears to job seekers. A complete profile significantly boosts candidate application rates!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Logo and Core Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6">Logo & Branding</h3>
            
            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 mb-6">
              {companyInfo.logoUrl ? (
                <img 
                  src={companyInfo.logoUrl} 
                  alt="Company Logo Preview" 
                  className="h-20 w-20 rounded-2xl object-contain border border-slate-200 dark:border-slate-850 bg-white mb-4 shadow-md"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-3xl text-white shadow-xl shadow-violet-500/10 mb-4">
                  {companyInfo.name.charAt(0).toUpperCase()}
                </div>
              )}
              <input 
                type="file" 
                id="logo-upload-input" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={() => document.getElementById('logo-upload-input').click()}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 cursor-pointer"
              >
                Upload Custom Logo
              </button>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">PNG, JPG up to 2MB</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Company Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={companyInfo.name} 
                  onChange={handleChange}
                  className="mt-1.5 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Website</label>
                <div className="relative mt-1.5 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Globe size={12} />
                  </div>
                  <input 
                    type="url" 
                    name="website"
                    value={companyInfo.website} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Location</label>
                <div className="relative mt-1.5 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={12} />
                  </div>
                  <input 
                    type="text" 
                    name="location"
                    value={companyInfo.location} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Employee Count</label>
                <div className="relative mt-1.5 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Users size={12} />
                  </div>
                  <input 
                    type="text" 
                    name="employees"
                    value={companyInfo.employees} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Industry</label>
                <div className="relative mt-1.5 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Briefcase size={12} />
                  </div>
                  <input 
                    type="text" 
                    name="industry"
                    value={companyInfo.industry} 
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Bio, Tech Stack & Perks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">About the Company</h3>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Company Bio</label>
              <textarea 
                name="description"
                rows={4}
                value={companyInfo.description} 
                onChange={handleChange}
                className="mt-1.5 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Twitter URL</label>
                <div className="relative mt-1.5 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <LinkIcon size={12} />
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://twitter.com/acme"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">LinkedIn URL</label>
                <div className="relative mt-1.5 rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <LinkIcon size={12} />
                  </div>
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/company/acme"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-3.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack & Benefits */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6">Technologies & Perks</h3>
            
            {/* Tech stack */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Core Tech Stack</label>
              
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {companyInfo.techStack.map((tech) => (
                  <span 
                    key={tech} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200/60 dark:border-slate-700/50"
                  >
                    <span>{tech}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTech(tech)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Next.js, Postgres..."
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 flex-1"
                />
                <button 
                  type="button"
                  onClick={handleAddTech}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Workplace Benefits</label>
              
              <div className="space-y-2 mt-2 mb-3">
                {companyInfo.benefits.map((benefit) => (
                  <div 
                    key={benefit} 
                    className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/80 rounded-xl"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-300">{benefit}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveBenefit(benefit)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Flexible working hours..."
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 flex-1"
                />
                <button 
                  type="button"
                  onClick={handleAddBenefit}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            {saved && (
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <Sparkles size={14} className="animate-pulse" /> Changes saved successfully!
              </span>
            )}
            <button 
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;
