import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Plus, 
  X, 
  Check, 
  AlertCircle, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  Building,
  ListTodo,
  Edit2,
  Award
} from 'lucide-react';

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterExperience, setFilterExperience] = useState('All');
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleAIGenerateDescription = async () => {
    if (!title) return;
    try {
      setGeneratingAI(true);
      setError('');
      const res = await API.post('/jobs/generate-description', { title, department });
      if (res.data.success) {
        setDescription(res.data.description);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'AI Generation failed');
    } finally {
      setGeneratingAI(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/jobs');
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (err) {
      console.error('Error fetching jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingJobId(null);
    setTitle('');
    setDepartment('');
    setLocation('');
    setJobType('Full-time');
    setSalaryRange('');
    setExperience('');
    setDescription('');
    setRequirements('');
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJobId(job._id);
    setTitle(job.title);
    setDepartment(job.department);
    setLocation(job.location);
    setJobType(job.jobType);
    setSalaryRange(job.salaryRange || '');
    setExperience(job.experience || '');
    setDescription(job.description);
    setRequirements(job.requirements);
    setError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingJobId(null);
    setTitle('');
    setDepartment('');
    setLocation('');
    setJobType('Full-time');
    setSalaryRange('');
    setExperience('');
    setDescription('');
    setRequirements('');
    setError('');
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!title || !department || !location || !description || !requirements) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    const payload = {
      title,
      department,
      location,
      jobType,
      salaryRange,
      experience,
      description,
      requirements,
    };

    try {
      let res;
      if (editingJobId) {
        res = await API.put(`/jobs/${editingJobId}`, payload);
      } else {
        res = await API.post('/jobs', payload);
      }

      if (res.data.success) {
        handleCloseModal();
        fetchJobs();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingJobId ? 'update' : 'create'} job`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
      await API.put(`/jobs/${id}`, { status: nextStatus });
      fetchJobs();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting? This will also remove all candidate applications connected to it.')) {
      try {
        await API.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (err) {
        console.error('Failed to delete job', err);
      }
    }
  };

  // Filter & Search Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || job.jobType === filterType;
    const matchesLocation = filterLocation === 'All' || job.location === filterLocation;
    const matchesExperience = filterExperience === 'All' || job.experience === filterExperience;

    return matchesSearch && matchesType && matchesLocation && matchesExperience;
  });

  // Get unique locations and experiences for filters
  const uniqueLocations = ['All', ...new Set(jobs.map(j => j.location).filter(Boolean))];
  const uniqueExperiences = ['All', ...new Set(jobs.map(j => j.experience).filter(Boolean))];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Job Directory</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Create, edit, and audit your organization's open postings.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md cursor-pointer transition-all duration-200"
        >
          <Plus size={16} />
          <span>Post a Job</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-4 pr-10 text-xs text-slate-650 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          />
        </div>

        {/* Dropdown Filters & Type Toggles */}
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          {/* Location Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Location:</span>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
            >
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Experience Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Experience:</span>
            <select
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
            >
              {uniqueExperiences.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Job Type selector */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200/60 dark:border-slate-800/80 rounded-xl">
            {['All', 'Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-200 ${
                  filterType === type 
                    ? 'bg-white dark:bg-slate-850 text-violet-600 dark:text-violet-400 shadow-sm'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div 
              key={job._id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover-card relative overflow-hidden"
            >
              {/* Top Details */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="px-2 py-0.5 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-[10px] font-bold rounded border border-violet-100/50 dark:border-violet-900/40 uppercase tracking-wider">
                      {job.department}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-2 line-clamp-1">{job.title}</h3>
                  </div>
                  
                  {/* Status Indicator */}
                  <button 
                    onClick={() => handleToggleStatus(job._id, job.status)}
                    title="Click to toggle status"
                    className={`px-2 py-1 text-[10px] font-bold rounded-full cursor-pointer transition-all duration-205 border ${
                      job.status === 'Active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-800/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {job.status}
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                  {job.description}
                </p>

                {/* Badges details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <MapPin size={14} className="shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <Clock size={14} className="shrink-0" />
                    <span>{job.jobType}</span>
                  </div>
                  {job.experience && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <Award size={14} className="shrink-0" />
                      <span>{job.experience}</span>
                    </div>
                  )}
                  {job.salaryRange && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <DollarSign size={14} className="shrink-0" />
                      <span>{job.salaryRange}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer details */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {job.applicantCount || 0} candidates
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(job)}
                    className="p-2 text-slate-400 hover:text-violet-500 hover:bg-violet-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Edit Job"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Delete Job"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl py-16 text-center text-slate-400 dark:text-slate-500 shadow-sm">
          <Briefcase className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={36} />
          <p className="text-sm font-semibold">No job listings found matching filters.</p>
        </div>
      )}

      {/* New Job Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col my-8 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <Building size={18} className="text-violet-600" />
                <h3 className="text-lg font-bold">{editingJobId ? 'Edit Opportunity' : 'Post an Opportunity'}</h3>
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-start gap-2.5 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handlePostJob} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    placeholder="e.g. Engineering"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    placeholder="e.g. New York, NY (Hybrid)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Type *
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Salary Range (Optional)
                  </label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    placeholder="e.g. $100,000 - $130,000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Experience Required (Optional)
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    placeholder="e.g. 3+ years experience"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Job Description *</span>
                    {title && (
                      <button
                        type="button"
                        onClick={handleAIGenerateDescription}
                        disabled={generatingAI}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        {generatingAI ? (
                          <>
                            <div className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={10} />
                            <span>AI Generate</span>
                          </>
                        )}
                      </button>
                    )}
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    placeholder="Provide an overview of the role, responsibilities, company vibe, etc..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Requirements *
                  </label>
                  <textarea
                    required
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    placeholder="List core tech stack, experience requirements, soft skills (one per line)..."
                  />
                </div>
              </div>
            </form>

            {/* Footer Buttons */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0 rounded-b-3xl">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                onClick={handlePostJob}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer transition-all duration-200 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>Publish Listing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostings;
