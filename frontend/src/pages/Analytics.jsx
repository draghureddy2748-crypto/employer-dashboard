import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Calendar,
  Sparkles,
  Percent,
  Award,
  CheckCircle
} from 'lucide-react';

const COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f43f5e', '#f59e0b'];

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch analytics metrics (totals, counts, status breakdowns)
      const analyticsRes = await API.get('/analytics');
      if (analyticsRes.data.success) {
        setMetrics(analyticsRes.data);
      }

      // 2. Fetch full applicant list for advanced trend computations
      const applicantsRes = await API.get('/applicants');
      if (applicantsRes.data.success) {
        setApplicants(applicantsRes.data.applicants);
      }

      // 3. Fetch jobs listings to map vacancy requirements
      const jobsRes = await API.get('/jobs');
      if (jobsRes.data.success) {
        setJobs(jobsRes.data.jobs);
      }
    } catch (err) {
      console.error('Error fetching analytical resources:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalJobs = metrics?.metrics?.totalJobs || jobs.length || 0;
  const totalApplicants = applicants.length;

  if (totalJobs === 0) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 flex flex-col items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="bg-slate-150 dark:bg-slate-900 p-3 rounded-2xl w-fit mx-auto mb-4 text-slate-400">
            <BarChart3 size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Recharts Analytics Compiled</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 mb-6 leading-relaxed">
            Analytics reports require at least one published job vacancy and candidate submission. Run the pipeline mock seeder from the main Dashboard!
          </p>
        </div>
      </div>
    );
  }

  // --- 1. PIPELINE DISTRIBUTION PIE CHART DATA ---
  const pieData = metrics?.charts?.statusBreakdown 
    ? Object.keys(metrics.charts.statusBreakdown).map(key => ({
        name: key,
        value: metrics.charts.statusBreakdown[key]
      })).filter(item => item.value > 0)
    : [];

  // --- 2. APPLICATIONS PER JOB BAR CHART DATA ---
  const appsPerJobData = jobs.map(job => ({
    name: job.title.length > 22 ? job.title.substring(0, 20) + '...' : job.title,
    Applications: job.applicantCount || 0
  })).sort((a, b) => b.Applications - a.Applications);

  // --- 3. HIRING TRENDS CHART DATA (Grouped by Date) ---
  // Group applicants by date (last 7 days or date of submission)
  const groupedTrends = {};
  applicants.forEach(app => {
    const dateStr = new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    groupedTrends[dateStr] = (groupedTrends[dateStr] || 0) + 1;
  });

  // Convert to chronological list
  const hiringTrendsData = Object.keys(groupedTrends).map(date => ({
    date,
    Candidates: groupedTrends[date]
  })).reverse().slice(-10); // Show last 10 dates with applicants

  // If trends data is empty, populate with placeholder dates so the Recharts AreaChart renders beautifully
  if (hiringTrendsData.length === 0) {
    hiringTrendsData.push(
      { date: 'May 20', Candidates: 0 },
      { date: 'May 21', Candidates: 0 },
      { date: 'May 22', Candidates: 0 },
      { date: 'May 23', Candidates: 0 },
      { date: 'May 24', Candidates: 0 },
      { date: 'May 25', Candidates: 0 }
    );
  }

  // KPI Calculations
  const shortlistedCount = applicants.filter(a => ['Shortlisted', 'Interview Scheduled', 'Hired'].includes(a.status)).length;
  const hiredCount = applicants.filter(a => a.status === 'Hired').length;
  const conversionRate = totalApplicants > 0 ? Math.round((shortlistedCount / totalApplicants) * 100) : 0;

  // Reusable KPI card component
  const KPICard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover-card">
      <div className={`p-3.5 rounded-xl shrink-0 ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{title}</span>
        <span className="text-2xl font-black text-slate-800 dark:text-white mt-0.5 block">{value}</span>
        <span className="text-[10px] text-slate-400 mt-0.5 block">{subtitle}</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-8 overflow-y-auto">
      {/* Upper Panel details */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Recharts Analytics Reports</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Explore funnel conversions, job allocations, and hiring timeline metrics.</p>
      </div>

      {/* Row 1: 4 Reusable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Positions" 
          value={totalJobs} 
          subtitle="Open vacancy postings"
          icon={Briefcase} 
          colorClass="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400"
        />
        <KPICard 
          title="Total Applicants" 
          value={totalApplicants} 
          subtitle="Unique candidate submissions"
          icon={Users} 
          colorClass="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
        />
        <KPICard 
          title="Shortlisted" 
          value={shortlistedCount} 
          subtitle="High-potential candidates"
          icon={Award} 
          colorClass="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
        />
        <KPICard 
          title="Conversion rate" 
          value={`${conversionRate}%`} 
          subtitle="Shortlisted ratio strength"
          icon={Percent} 
          colorClass="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Row 2: Recharts Layout (Hiring Trends AreaChart & Applications per Job BarChart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Hiring Trends Area Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col min-h-[360px]">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Hiring Pipeline Trends</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Chronological timeline tracking application submissions over time</p>
          </div>
          <div className="flex-1 w-full h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hiringTrendsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrends" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} tickMargin={8} />
                <YAxis stroke="#94a3b8" tickLine={false} tickMargin={8} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="Candidates" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTrends)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications per Job Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col min-h-[360px]">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Applications per Job Requisition</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Breakdown of candidate application counts grouped by position</p>
          </div>
          <div className="flex-1 w-full h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appsPerJobData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} tickMargin={8} />
                <YAxis stroke="#94a3b8" tickLine={false} tickMargin={8} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#a855f7' }}
                />
                <Bar dataKey="Applications" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 3: Pie Chart & Funnel Conversion Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pipeline Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col lg:col-span-1 min-h-[340px]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Pipeline Funnel Distribution</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Distribution of candidate status categories</p>
          </div>
          <div className="flex-1 h-48 text-xs relative flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-450">No data compiled</span>
            )}
          </div>
          
          {/* Pie Chart Legends */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3 shrink-0">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel conversion details progress bars */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm lg:col-span-2 min-h-[340px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Hiring Pipeline Conversions</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 mb-6">Percentage transitions of applications into key milestones</p>
          </div>

          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-1"><Sparkles size={13} className="text-violet-500" /> Reviewing Rate</span>
                <span>{totalApplicants > 0 ? Math.round((applicants.filter(a => a.status !== 'Applied').length / totalApplicants) * 100) : 0}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalApplicants > 0 ? Math.round((applicants.filter(a => a.status !== 'Applied').length / totalApplicants) * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-1"><Sparkles size={13} className="text-amber-500" /> Interview bidder strength</span>
                <span>{totalApplicants > 0 ? Math.round((applicants.filter(a => ['Interview Scheduled', 'Hired'].includes(a.status)).length / totalApplicants) * 100) : 0}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalApplicants > 0 ? Math.round((applicants.filter(a => ['Interview Scheduled', 'Hired'].includes(a.status)).length / totalApplicants) * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                <span className="flex items-center gap-1"><CheckCircle size={13} className="text-emerald-500" /> Hired Ratio</span>
                <span>{totalApplicants > 0 ? Math.round((hiredCount / totalApplicants) * 100) : 0}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalApplicants > 0 ? Math.round((hiredCount / totalApplicants) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
