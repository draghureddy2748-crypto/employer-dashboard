const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob, generateDescription } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createJob)
  .get(protect, getJobs);

router.post('/generate-description', protect, generateDescription);

router.route('/:id')
  .get(protect, getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;
