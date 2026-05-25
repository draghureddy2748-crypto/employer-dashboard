const express = require('express');
const router = express.Router();
const { 
  getApplicants, 
  updateApplicantStatus, 
  createApplicant,
  matchApplicantResume 
} = require('../controllers/applicantController');
const { protect } = require('../middleware/auth');

// Protected: Get list of applicants and update status
router.get('/', protect, getApplicants);
router.put('/:id/status', protect, updateApplicantStatus);
router.post('/:id/match', protect, matchApplicantResume);

// Public: Submit a mock application
router.post('/', createApplicant);

module.exports = router;
