const express = require('express');
const router = express.Router();
const { getCompany, updateCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCompany)
  .put(protect, updateCompany);

module.exports = router;
