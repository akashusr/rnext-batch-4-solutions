const { Job, User } = require('../models');
const { Sequelize } = require('sequelize');

// @desc    Get unique skills
// @route   GET /api/utils/skills
// @access  Public
const getSkills = async (req, res) => {
    try {
        // In a real app, this might come from a Skills table.
        // Here we can aggregate from Jobs or Users, or just return a static list.
        // For now, let's return a static list combined with what we find in Jobs.

        const jobs = await Job.findAll({ attributes: ['skills'] });
        let allSkills = new Set([
            'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'Swift', 'Go',
            'React', 'Node.js', 'Angular', 'Vue.js', 'Django', 'Flask', 'Spring',
            'Laravel', 'PostgreSQL', 'MongoDB', 'MySQL', 'AWS', 'Docker', 'Kubernetes'
        ]);

        jobs.forEach(job => {
            if (Array.isArray(job.skills)) {
                job.skills.forEach(skill => allSkills.add(skill));
            }
        });

        res.status(200).json({ success: true, data: Array.from(allSkills).sort() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get unique locations
// @route   GET /api/utils/locations
// @access  Public
const getLocations = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('location')), 'location']],
            order: [['location', 'ASC']]
        });

        const locations = jobs.map(job => job.location);

        res.status(200).json({ success: true, data: locations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getSkills,
    getLocations
};
