const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplicants, updateApplicationStatus, withdrawApplication } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Apply for a job
router.post('/jobs/:jobId/apply', protect, authorize('USER'), applyForJob);

// Get my applications
router.get('/my-applications', protect, authorize('USER'), getMyApplications);

// Get applicants for a job
router.get('/jobs/:jobId/applicants', protect, authorize('COMPANY'), getJobApplicants);

// Update application status
router.patch('/:id/status', protect, authorize('COMPANY'), updateApplicationStatus);

// Withdraw application
router.delete('/:id', protect, authorize('USER'), withdrawApplication);

module.exports = router;
