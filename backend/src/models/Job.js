const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true,
  },
  jobType: {
    type: String,
    required: [true, 'Please select a job type'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  requirements: {
    type: String,
    required: [true, 'Please add requirements'],
  },
  salaryRange: {
    type: String,
    trim: true,
  },
  experience: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Closed'],
    default: 'Active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', JobSchema);
