const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobBySlug,
    updateJob,
    deleteJob,
    getRecommendedJobs,
    getSimilarJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getJobs)
    .post(protect, authorize('COMPANY'), createJob);

router.get('/recommendations', protect, authorize('USER'), getRecommendedJobs);

router.route('/:id')
    .put(protect, authorize('COMPANY'), updateJob)
    .delete(protect, authorize('COMPANY'), deleteJob);

router.get('/:id/similar', getSimilarJobs);

router.get('/:slug', getJobBySlug);

module.exports = router;
