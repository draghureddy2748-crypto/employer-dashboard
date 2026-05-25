const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Get logged-in employer's company profile
// @route   GET /api/company
// @access  Private
exports.getCompany = async (req, res) => {
  try {
    let company = await Company.findOne({ employer: req.user.id });

    // If company profile does not exist yet, auto-initialize with User companyName
    if (!company) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Employer not found' });
      }

      company = await Company.create({
        employer: req.user.id,
        name: user.companyName || 'Acme Corp',
        website: 'https://example.com',
        location: 'San Francisco, CA',
        employees: '1-10 employees',
        industry: 'Technology',
        description: 'Update your company bio and details here...',
        techStack: ['React', 'Node.js'],
        benefits: ['Flexible working hours'],
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update employer's company profile
// @route   PUT /api/company
// @access  Private
exports.updateCompany = async (req, res) => {
  try {
    const { name, logoUrl, website, location, employees, industry, description, techStack, benefits } = req.body;

    let company = await Company.findOne({ employer: req.user.id });

    if (!company) {
      company = await Company.create({
        employer: req.user.id,
        name: name || 'Acme Corp',
        logoUrl,
        website,
        location,
        employees,
        industry,
        description,
        techStack: techStack || [],
        benefits: benefits || [],
      });
    } else {
      company.name = name || company.name;
      if (logoUrl !== undefined) company.logoUrl = logoUrl;
      if (website !== undefined) company.website = website;
      if (location !== undefined) company.location = location;
      if (employees !== undefined) company.employees = employees;
      if (industry !== undefined) company.industry = industry;
      if (description !== undefined) company.description = description;
      if (techStack !== undefined) company.techStack = techStack;
      if (benefits !== undefined) company.benefits = benefits;

      await company.save();
    }

    // Proactively update user's companyName to match the new company name if changed
    if (name) {
      await User.findByIdAndUpdate(req.user.id, { companyName: name });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
