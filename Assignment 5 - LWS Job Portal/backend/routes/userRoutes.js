const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, uploadResume, uploadProfilePicture, getUserById } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const imageUpload = require('../middleware/imageUpload');

router.route('/profile')
    .get(protect, authorize('USER'), getUserProfile)
    .put(protect, authorize('USER'), updateUserProfile);

router.post('/resume', protect, authorize('USER'), upload.single('resume'), uploadResume);
router.post('/profile-picture', protect, authorize('USER'), imageUpload.single('profilePicture'), uploadProfilePicture);

// Public route to get user by ID
router.get('/:id', getUserById);

module.exports = router;
