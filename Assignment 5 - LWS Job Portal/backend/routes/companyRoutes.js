const express = require('express');
const router = express.Router();
const {
    getCompanyProfile,
    getCompanyBySlug,
    updateCompanyProfile,
    getCompanyDashboardStats,
    uploadLogo,
    getCompanyOpenPositions,
    getCompanyJobs,
    getCompanyApplicants
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const imageUpload = require('../middleware/imageUpload');

router.route('/profile')
    .get(protect, authorize('COMPANY'), getCompanyProfile)
    .put(protect, authorize('COMPANY'), updateCompanyProfile);

router.post('/logo', protect, authorize('COMPANY'), imageUpload.single('logo'), uploadLogo);

// Company Dashboard Routes
router.get('/jobs', protect, authorize('COMPANY'), getCompanyJobs);
router.get('/applicants', protect, authorize('COMPANY'), getCompanyApplicants);
router.get('/dashboard/stats', protect, authorize('COMPANY'), getCompanyDashboardStats);

router.get('/:slug/jobs', getCompanyOpenPositions);
router.get('/:slug', getCompanyBySlug);

module.exports = router;
