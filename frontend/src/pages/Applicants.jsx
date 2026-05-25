import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Users, 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  ChevronLeft,
  Mail, 
  Phone, 
  Calendar, 
  User, 
  FileText, 
  X, 
  Check, 
  Info,
  CheckCircle,
  Building,
  GraduationCap,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

const COLUMNS = [
  { id: 'Applied', name: 'Applied', color: 'border-t-slate-400 bg-slate-500/5 text-slate-600 dark:text-slate-400' },
  { id: 'Reviewing', name: 'Reviewing', color: 'border-t-amber-400 bg-amber-500/5 text-amber-600 dark:text-amber-400' },
  { id: 'Shortlisted', name: 'Shortlisted', color: 'border-t-sky-400 bg-sky-500/5 text-sky-600 dark:text-sky-400' },
  { id: 'Interview Scheduled', name: 'Interview Scheduled', color: 'border-t-violet-400 bg-violet-500/5 text-violet-600 dark:text-violet-400' },
  { id: 'Rejected', name: 'Rejected', color: 'border-t-rose-400 bg-rose-500/5 text-rose-600 dark:text-rose-400' },
  { id: 'Hired', name: 'Hired', color: 'border-t-emerald-400 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' }
];

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Detail Modal State
  const [activeApplicant, setActiveApplicant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [matchResults, setMatchResults] = useState({});

  const handleScanResume = async (app) => {
    try {
      setScanning(true);
      const res = await API.post(`/applicants/${app._id}/match`, {});
      if (res.data.success) {
        const match = res.data.matchResult;
        setMatchResults(prev => ({
          ...prev,
          [app._id]: {
            score: match.score,
            matched: match.matchedSkills,
            missing: match.missingSkills,
            rank: match.rank
          }
        }));
        
        // Update local applicant list
        setApplicants(prev => prev.map(a => 
          a._id === app._id ? { ...a, matchResult: match } : a
        ));
        
        if (activeApplicant && activeApplicant._id === app._id) {
          setActiveApplicant(prev => ({ ...prev, matchResult: match }));
        }
      }
    } catch (err) {
      console.error('Error scanning candidate fit:', err);
    } finally {
      setScanning(false);
    }
  };

  const handleUploadResumeAndScan = async (appId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Resume file size must be less than 2MB.');
      return;
    }

    try {
      setScanning(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await API.post(`/applicants/${appId}/match`, { 
            resumeText: reader.result 
          });
          if (res.data.success) {
            const match = res.data.matchResult;
            setMatchResults(prev => ({
              ...prev,
              [appId]: {
                score: match.score,
                matched: match.matchedSkills,
                missing: match.missingSkills,
                rank: match.rank
              }
            }));
            
            // Update local applicant list
            setApplicants(prev => prev.map(a => 
              a._id === appId ? { ...a, matchResult: match } : a
            ));
            
            if (activeApplicant && activeApplicant._id === appId) {
              setActiveApplicant(prev => ({ ...prev, matchResult: match }));
            }
          }
        } catch (err) {
          console.error('Failed to parse and match resume:', err);
          alert(err.response?.data?.message || 'Failed to analyze resume.');
        } finally {
          setScanning(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.error('Failed to read file:', err);
      setScanning(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch applicants
      const appRes = await API.get('/applicants');
      if (appRes.data.success) {
        setApplicants(appRes.data.applicants);
      }
      
      // Fetch jobs for filter selection
      const jobRes = await API.get('/jobs');
      if (jobRes.data.success) {
        setJobs(jobRes.data.jobs);
      }
    } catch (err) {
      console.error('Error fetching applicants/jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      const res = await API.put(`/applicants/${id}/status`, { status: nextStatus });
      if (res.data.success) {
        // Refresh local applicants list
        setApplicants((prev) => 
          prev.map((app) => (app._id === id ? { ...app, status: nextStatus } : app))
        );
        // If active applicant is current, update it too
        if (activeApplicant && activeApplicant._id === id) {
          setActiveApplicant((prev) => ({ ...prev, status: nextStatus }));
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Get index of columns to handle moving candidates left/right
  const getNextStatus = (currentStatus, direction) => {
    const currentIndex = COLUMNS.findIndex(col => col.id === currentStatus);
    if (direction === 'right' && currentIndex < COLUMNS.length - 1) {
      return COLUMNS[currentIndex + 1].id;
    }
    if (direction === 'left' && currentIndex > 0) {
      return COLUMNS[currentIndex - 1].id;
    }
    return null;
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.job?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    if (selectedJobFilter === 'All') return matchesSearch;
    return matchesSearch && app.job?._id === selectedJobFilter;
  });

  // Group applicants by status
  const groupedApplicants = COLUMNS.reduce((acc, col) => {
    acc[col.id] = filteredApplicants.filter((app) => app.status === col.id);
    return acc;
  }, {});

  const handleOpenDetails = (app) => {
    setActiveApplicant(app);
    setModalOpen(true);
    if (app.matchResult && app.matchResult.score !== undefined) {
      setMatchResults(prev => ({
        ...prev,
        [app._id]: {
          score: app.matchResult.score,
          matched: app.matchResult.matchedSkills || [],
          missing: app.matchResult.missingSkills || [],
          rank: app.matchResult.rank || ''
        }
      }));
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto flex flex-col">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Applicant Pipeline</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Track candidate progressions through the stages of your hiring funnel.</p>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search candidate by name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
            <SlidersHorizontal size={14} />
            <span>Job filter:</span>
          </span>
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
          >
            <option value="All">All Open Opportunities</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="h-8 w-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 items-start overflow-x-auto min-h-[500px] pb-6">
          {COLUMNS.map((col) => {
            const list = groupedApplicants[col.id] || [];
            return (
              <div 
                key={col.id}
                className="bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col max-h-[calc(100vh-280px)]"
              >
                {/* Column header */}
                <div className={`border-t-4 ${col.color} pt-3 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 mb-4 shrink-0`}>
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">{col.name}</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {list.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
                  {list.length > 0 ? (
                    list.map((app) => (
                      <div 
                        key={app._id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-violet-500/20 dark:hover:border-violet-500/10 cursor-pointer transition-all duration-200 relative group flex flex-col justify-between min-h-[120px]"
                        onClick={() => handleOpenDetails(app)}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{app.fullName}</h4>
                          </div>
                          
                          <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 mt-1 line-clamp-1">
                            {app.job?.title || 'Unknown Job'}
                          </p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                            {app.job?.department}
                          </p>
                        </div>

                        {/* Card controls (move columns easily) */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            disabled={col.id === 'Applied'}
                            onClick={() => {
                              const next = getNextStatus(app.status, 'left');
                              if (next) handleUpdateStatus(app._id, next);
                            }}
                            className="p-1 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent rounded cursor-pointer transition-all"
                            title="Move left"
                          >
                            <ChevronLeft size={14} />
                          </button>
                          
                          <span className="text-[9px] text-slate-400 font-semibold">
                            {new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                          
                          <button
                            disabled={col.id === 'Hired'}
                            onClick={() => {
                              const next = getNextStatus(app.status, 'right');
                              if (next) handleUpdateStatus(app._id, next);
                            }}
                            className="p-1 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent rounded cursor-pointer transition-all"
                            title="Move right"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Candidate Detail Modal / Drawer */}
      {modalOpen && activeApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                  {activeApplicant.fullName.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">{activeApplicant.fullName}</h3>
                  <span className="text-[10px] font-semibold text-slate-400">Applied for {activeApplicant.job?.title}</span>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Pipeline Status Selector */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-200/50 dark:border-slate-850 rounded-2xl">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Update Candidate Workflow Stage
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COLUMNS.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleUpdateStatus(activeApplicant._id, col.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-200 border ${
                        activeApplicant.status === col.id
                          ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-l-2 border-violet-500 pl-2">
                  Contact details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span>{activeApplicant.email}</span>
                  </div>
                  {activeApplicant.phone && (
                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span>{activeApplicant.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>Applied on {new Date(activeApplicant.appliedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {activeApplicant.coverLetter && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-l-2 border-violet-500 pl-2">
                    Cover Letter / Statement
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/30 dark:border-slate-850 rounded-2xl text-xs text-slate-650 dark:text-slate-400 leading-relaxed max-h-[200px] overflow-y-auto">
                    {activeApplicant.coverLetter}
                  </div>
                </div>
              )}

              {/* Resume Info mock placeholder */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-l-2 border-violet-500 pl-2">
                  Resume Attachments
                </h4>
                <div className="p-4 bg-violet-50/40 dark:bg-violet-950/20 border border-violet-100/50 dark:border-violet-900/30 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                    <FileText size={16} className="text-violet-600 shrink-0 animate-pulse" />
                    <span className="font-semibold">{activeApplicant.fullName.replace(/\s+/g, '_')}_CV.pdf</span>
                  </div>
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider bg-violet-100/50 dark:bg-violet-950 px-2 py-0.5 rounded border border-violet-100 dark:border-violet-900">
                    Verified
                  </span>
                </div>
              </div>

              {/* AI Resume Matching Engine */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-5 border border-slate-200/50 dark:border-slate-850 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <Sparkles size={16} className="text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-bold">AI Resume Matching Scan</span>
                  </div>
                  {!matchResults[activeApplicant._id] && !scanning && (
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        id="resume-upload-input" 
                        accept=".txt,.pdf,.doc,.docx" 
                        onChange={(e) => handleUploadResumeAndScan(activeApplicant._id, e)} 
                        className="hidden" 
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('resume-upload-input').click()}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-250 text-[10px] font-bold rounded-lg cursor-pointer transition-colors border border-slate-200 dark:border-slate-800 shadow-sm"
                      >
                        Upload CV & Match
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScanResume(activeApplicant)}
                        className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors border border-transparent shadow-sm"
                      >
                        AI Scan Fit
                      </button>
                    </div>
                  )}
                </div>

                {scanning && (
                  <div className="py-4 text-center space-y-3">
                    <div className="h-6 w-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold animate-pulse">
                      Parsing keywords, evaluating skill sets, and matching job requirements...
                    </p>
                  </div>
                )}

                {matchResults[activeApplicant._id] && !scanning && (
                  <div className="space-y-4">
                    {/* Gauge metrics */}
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-xl p-3.5 shadow-sm">
                      <div className="text-left">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Match Score</span>
                        <span className={`text-2xl font-black block mt-0.5 ${
                          matchResults[activeApplicant._id].score >= 80 ? 'text-emerald-500' :
                          matchResults[activeApplicant._id].score >= 60 ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                          {matchResults[activeApplicant._id].score}%
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Applicant Rank</span>
                        <span className="text-xl font-extrabold text-violet-600 dark:text-violet-400 block mt-0.5">
                          {matchResults[activeApplicant._id].rank} <span className="text-[10px] text-slate-450 font-medium">in pool</span>
                        </span>
                      </div>
                    </div>

                    {/* Skill matching stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      {/* Matched */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Matched Keywords ({matchResults[activeApplicant._id].matched.length})</span>
                        <div className="flex flex-wrap gap-1">
                          {matchResults[activeApplicant._id].matched.map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-semibold rounded">
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider block">Missing Requisites ({matchResults[activeApplicant._id].missing.length})</span>
                        <div className="flex flex-wrap gap-1">
                          {matchResults[activeApplicant._id].missing.map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-semibold rounded">
                              ⚠ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!matchResults[activeApplicant._id] && !scanning && (
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-relaxed text-center py-2">
                    Click scan to parse candidate's CV and automatically cross-reference it against the role's skills requirements list.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end shrink-0 rounded-b-3xl">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
