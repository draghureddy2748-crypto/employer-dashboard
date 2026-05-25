const Job = require('../models/Job');
const Applicant = require('../models/Applicant');
const Notification = require('../models/Notification');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res) => {
  try {
    const { title, department, location, jobType, description, requirements, salaryRange, experience } = req.body;

    const job = await Job.create({
      employer: req.user.id,
      title,
      department,
      location,
      jobType,
      description,
      requirements,
      salaryRange,
      experience,
    });

    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs for logged in employer
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort('-createdAt');

    // For each job, we can attach the count of candidates/applicants
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Applicant.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicantCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single job details
// @route   GET /api/jobs/:id
// @access  Private
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ensure job belongs to logged in employer
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this job' });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ensure job belongs to logged in employer
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this job' });
    }

    // Check if status has changed to notify
    const statusChanged = req.body.status && req.body.status !== job.status;

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (statusChanged) {
      await Notification.create({
        employer: req.user.id,
        type: 'job_status',
        title: 'Job Status Updated',
        message: `Your job posting "${job.title}" status has been changed to ${job.status}.`,
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ensure job belongs to logged in employer
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this job' });
    }

    // Remove job
    await job.deleteOne();

    // Remove all applicants associated with this job
    await Applicant.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job and associated applicants deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate an AI powered job description using OpenAI API or realistic local fallback
// @route   POST /api/jobs/generate-description
// @access  Private
exports.generateDescription = async (req, res) => {
  try {
    const { title, department } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a role title' });
    }

    let description = '';

    // If an OpenAI API Key exists in env, call OpenAI chat completion
    if (process.env.OPENAI_API_KEY) {
      try {
        const { OpenAI } = require('openai'); // Require dynamically
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { 
              role: "system", 
              content: "You are a professional recruiting assistant. Generate a premium, engaging, and comprehensive job description including an Overview, Key Responsibilities, and Company Alignment based on the job title and department." 
            },
            {
              role: "user",
              content: `Job Title: ${title}\nDepartment: ${department || 'General'}`
            }
          ]
        });
        description = completion.choices[0].message.content;
      } catch (err) {
        console.error('OpenAI Call failed, falling back to local generator:', err.message);
      }
    }

    // High fidelity template fallback if OpenAI is not configured or fails
    if (!description) {
      description = `### Role Overview\nWe are looking for a talented and highly motivated **${title}** to join our fast-growing **${department || 'Product'}** team. In this role, you will be responsible for designing, building, and deploying mission-critical features, collaborating with cross-functional product designers and engineers, and driving core product initiatives forward.\n\n### Key Responsibilities\n- Design, build, and maintain highly scalable, responsive, and robust application workflows.\n- Collaborate closely with product managers, UX/UI designers, and developer teams to gather and refine vacancy specifications.\n- Refactor legacy setups and improve overall code quality, scalability, and coverage.\n- Stay ahead of industry trends, incorporating cutting-edge utilities (e.g. AI pair-programming assistants) to maximize throughput.\n\n### Company Culture & Alignment\nWe are a premium, state-of-the-art organization dedicated to building premium interfaces similar to Stripe or Linear. We believe in visual excellence, smooth gradients, dark mode interfaces, and seamless micro-animations. If you are passionate about visual polish and robust backend scaling, you will fit in perfectly!`;
    }

    res.status(200).json({
      success: true,
      description,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
