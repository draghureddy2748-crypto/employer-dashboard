const Job = require('../models/Job');
const Applicant = require('../models/Applicant');

// @desc    Get dashboard metrics and analytics charts data
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const employerId = req.user.id;

    // 1. Get jobs belonging to the employer
    const jobs = await Job.find({ employer: employerId });
    const jobIds = jobs.map((job) => job._id);

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((job) => job.status === 'Active').length;
    const closedJobs = jobs.filter((job) => job.status === 'Closed').length;

    // 2. Get applicants for these jobs
    const applicants = await Applicant.find({ job: { $in: jobIds } });
    const totalApplicants = applicants.length;

    // 3. Status breakdown
    const statusCounts = {
      Applied: 0,
      Reviewing: 0,
      Shortlisted: 0,
      'Interview Scheduled': 0,
      Rejected: 0,
      Hired: 0,
    };
    
    applicants.forEach((app) => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    // 4. Job type breakdown
    const jobTypeCounts = {
      'Full-time': 0,
      'Part-time': 0,
      'Contract': 0,
      'Internship': 0,
      'Remote': 0,
    };
    jobs.forEach((job) => {
      if (jobTypeCounts[job.jobType] !== undefined) {
        jobTypeCounts[job.jobType]++;
      }
    });

    // 5. Department breakdown
    const departmentCounts = {};
    jobs.forEach((job) => {
      departmentCounts[job.department] = (departmentCounts[job.department] || 0) + 1;
    });

    // 6. Recent applicants list (last 5)
    const recentApplicants = await Applicant.find({ job: { $in: jobIds } })
      .populate('job', 'title department')
      .sort('-appliedDate')
      .limit(5);

    // 7. Success statistics / conversions
    const conversionRate = totalApplicants > 0 
      ? Math.round(((statusCounts['Shortlisted'] + statusCounts['Interview Scheduled'] + statusCounts['Hired']) / totalApplicants) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      metrics: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplicants,
        conversionRate,
      },
      charts: {
        statusBreakdown: statusCounts,
        jobTypeBreakdown: jobTypeCounts,
        departmentBreakdown: departmentCounts,
      },
      recentApplicants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
