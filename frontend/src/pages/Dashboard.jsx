import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  PlusCircle, 
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Play
} from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplicants: 0,
    conversionRate: 0,
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/analytics');
      if (res.data.success) {
        setMetrics(res.data.metrics);
        setRecentApplicants(res.data.recentApplicants);
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics', error);
    } finally {
      setLoading(false);
    }
  };

  // Seeding tool to populate mock data so the dashboard is immediately functional
  const handleSeedDemoData = async () => {
    try {
      setSeeding(true);
      
      // 1. Create a few mock job postings
      const job1 = await API.post('/jobs', {
        title: 'Senior Full Stack Engineer',
        department: 'Engineering',
        location: 'Remote (US/Canada)',
        jobType: 'Full-time',
        description: 'We are looking for a Senior Full Stack Engineer experienced with React, Node.js, and MongoDB.',
        requirements: '5+ years experience, React expertise, Node.js background, clean code practices',
        salaryRange: '$120,000 - $150,000',
      });

      const job2 = await API.post('/jobs', {
        title: 'Product Designer',
        department: 'Design',
        location: 'Hybrid (New York)',
        jobType: 'Full-time',
        description: 'Looking for a UI/UX expert with Figma mastery and strong web styling knowledge.',
        requirements: '3+ years experience, portfolio showcasing web apps, excellent communication',
        salaryRange: '$90,000 - $115,000',
      });

      const job3 = await API.post('/jobs', {
        title: 'Intern Frontend Developer',
        department: 'Engineering',
        location: 'Remote',
        jobType: 'Internship',
        description: 'Excellent learning opportunity for a junior react hacker willing to work on beautiful interfaces.',
        requirements: 'Basic Javascript, React familiarity, Tailwind CSS experience is a big plus',
        salaryRange: '$25 - $35 / hour',
      });

      // 2. Submit mock applications for these jobs
      const mockApplicants = [
        { jobId: job1.data.job._id, fullName: 'David Chen', email: 'david.chen@example.com', phone: '+1 555-0192', coverLetter: 'I have been writing react code for 6 years and absolutely love elegant SPAs.', status: 'Interview Scheduled' },
        { jobId: job1.data.job._id, fullName: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 555-0143', coverLetter: 'Excited about the role. Attached is my resume. Let me know if you need anything else.', status: 'Reviewing' },
        { jobId: job2.data.job._id, fullName: 'Alex Rivera', email: 'alex.design@example.com', phone: '+1 555-0188', coverLetter: 'I specialize in glassmorphism and Tailwind layouts. Hope to speak soon!', status: 'Hired' },
        { jobId: job2.data.job._id, fullName: 'Elena Rostova', email: 'elena.ros@example.com', phone: '+1 555-0174', coverLetter: 'Highly motivated designer with SaaS experience.', status: 'Applied' },
        { jobId: job3.data.job._id, fullName: 'Marcus Brody', email: 'marcus.b@example.com', phone: '+1 555-0112', coverLetter: 'Junior dev seeking to learn and build awesome features. Ready to code!', status: 'Applied' },
        { jobId: job3.data.job._id, fullName: 'Emily Watson', email: 'emily.watson@example.com', phone: '+1 555-0105', coverLetter: 'Coding boot camp graduate with a strong passion for CSS.', status: 'Rejected' },
      ];

      for (const app of mockApplicants) {
        await API.post('/applicants', app);
      }

      // Re-fetch data
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to seed demo data', error);
    } finally {
      setSeeding(false);
    }
  };

  if (loading && metrics.totalJobs === 0) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Active Jobs', value: metrics.activeJobs, subtitle: `${metrics.totalJobs} total postings`, icon: Briefcase, color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30' },
    { name: 'Total Applicants', value: metrics.totalApplicants, subtitle: 'Across all active listings', icon: Users, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30' },
    { name: 'Conversion Rate', value: `${metrics.conversionRate}%`, subtitle: 'Interviewed or Offered', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' },
    { name: 'Shortlisted', value: recentApplicants.filter(a => ['Shortlisted', 'Interview Scheduled', 'Hired'].includes(a.status)).length, subtitle: 'Needs response', icon: UserCheck, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30' },
  ];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto">
      {/* Welcome / Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 border border-slate-800 text-white relative overflow-hidden mb-8 shadow-xl">
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 text-violet-300 text-xs font-semibold rounded-full border border-violet-500/30 mb-4">
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span>Dashboard Overview</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight margin-0!">
            Welcome back to TalentFlow
          </h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Manage your open jobs, track candidate progress, and optimize your overall hiring pipelines from a single elegant interface.
          </p>
        </div>
      </div>

      {/* Seeding tool for empty dashboard */}
      {metrics.totalJobs === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center mb-8 shadow-md">
          <div className="max-w-md mx-auto">
            <div className="bg-violet-50 dark:bg-violet-950/30 p-3 rounded-2xl w-fit mx-auto mb-4 text-violet-600 dark:text-violet-400">
              <Sparkles size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Start with Demo Data</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 mb-6">
              Your dashboard is currently empty. Run our demo generator to seed realistic mock jobs and applicants so you can experience the analytics, applicant pipeline boards, and job panels instantly!
            </p>
            <button
              onClick={handleSeedDemoData}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {seeding ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Pipeline...</span>
                </>
              ) : (
                <>
                  <Play size={16} className="fill-current" />
                  <span>Seed Mock Pipeline Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.name} 
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {card.name}
                </span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  {card.value}
                </span>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Layout (Quick Actions & Recent Applicants) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Recent Applicants List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Recent Applications
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Latest candidates applying to your postings
                </p>
              </div>
              <Link 
                to="/applicants" 
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 flex items-center gap-1 transition-colors"
              >
                <span>View pipeline</span>
                <ChevronRight size={14} />
              </Link>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentApplicants.length > 0 ? (
                recentApplicants.map((app) => (
                  <div key={app._id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                        {app.fullName.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{app.fullName}</h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          <span>applied for</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-400">{app.job?.title}</span>
                          <span>•</span>
                          <span>{app.job?.department}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      {/* Status pill */}
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        app.status === 'Hired' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400' :
                        app.status === 'Interview Scheduled' ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-200/50 dark:border-violet-800/30 text-violet-600 dark:text-violet-400' :
                        app.status === 'Shortlisted' ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-200/50 dark:border-sky-800/30 text-sky-600 dark:text-sky-400' :
                        app.status === 'Reviewing' ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/50 dark:border-amber-800/30 text-amber-600 dark:text-amber-400' :
                        app.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200/50 dark:border-rose-800/30 text-rose-600 dark:text-rose-400' :
                        'bg-slate-100 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/50 text-slate-600 dark:text-slate-400'
                      }`}>
                        {app.status}
                      </span>
                      
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No applicants registered yet.
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar size={12} />
              <span>Real-time updates enabled</span>
            </span>
          </div>
        </div>

        {/* Right column: Quick Tools & Tips */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/jobs')} 
                className="w-full flex items-center justify-between p-3.5 bg-violet-50 dark:bg-violet-950/20 border border-violet-100/50 dark:border-violet-900/30 hover:bg-violet-100/40 dark:hover:bg-violet-950/40 text-violet-700 dark:text-violet-300 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle size={18} />
                  <span>Post a New Job</span>
                </div>
                <ArrowRight size={14} />
              </button>

              <button 
                onClick={() => navigate('/applicants')} 
                className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200"
              >
                <div className="flex items-center gap-2.5">
                  <Users size={18} />
                  <span>View All Candidates</span>
                </div>
                <ArrowRight size={14} />
              </button>

              <button 
                onClick={handleSeedDemoData} 
                disabled={seeding}
                className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles size={18} className="text-indigo-500" />
                  <span>Seed More Mock Data</span>
                </div>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Hiring Tip Card */}
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <h4 className="text-sm font-bold flex items-center gap-1.5 text-white/90">
              <CheckCircle size={16} />
              <span>Smart Hiring Tip</span>
            </h4>
            <p className="text-xs text-white/80 leading-relaxed mt-2.5">
              Shortening the "applied to screen" timeframe to less than 48 hours boosts offer conversion success by almost 24%. Keep close track of your 'Applied' tab on the Applicant Kanban Board!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
