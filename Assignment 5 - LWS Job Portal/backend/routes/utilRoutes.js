const express = require('express');
const router = express.Router();
const { getSkills, getLocations } = require('../controllers/utilController');

router.get('/skills', getSkills);
router.get('/locations', getLocations);

module.exports = router;
