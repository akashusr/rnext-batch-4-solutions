const { Application, Job, User, Company } = require('../models');
const { Op } = require('sequelize');

// @desc    Apply for a job
// @route   POST /api/applications/jobs/:jobId/apply
// @access  Private (User)
const applyForJob = async (req, res) => {
    try {
        if (!req.body?.coverLetter) {
            return res.status(400).json({ success: false, message: 'Cover letter is required' });
        }
        const { coverLetter } = req.body;
        const jobId = req.params.jobId;
        const userId = req.user.id;

        // Check if job exists
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            where: { jobId, userId }
        });

        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }

        // Use user's current resume if not provided (logic can be expanded)
        const resumeUrl = req.user.resumeUrl;

        if (!resumeUrl) {
            return res.status(400).json({ success: false, message: 'Please upload a resume to your profile first' });
        }

        const application = await Application.create({
            jobId,
            userId,
            coverLetter,
            resumeUrl,
            status: 'New'
        });

        res.status(201).json({ success: true, data: application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (User)
// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (User)
const getMyApplications = async (req, res) => {
    try {
        const { status, date, sort } = req.query;
        let where = { userId: req.user.id };

        // 1. Status Filter (Multi-value)
        if (status) {
            const statusList = status.split(',').map(s => s.trim());
            // Filter out empty strings if any
            const cleanStatusList = statusList.filter(s => s);
            if (cleanStatusList.length > 0) {
                 where.status = { [Op.in]: cleanStatusList };
            }
        }

        // 2. Date Filter
        if (date) {
            const now = new Date();
            let pastDate = null;

            if (date === 'last 7 days') {
                pastDate = new Date();
                pastDate.setDate(now.getDate() - 7);
            } else if (date === 'last 30 days') {
                pastDate = new Date();
                pastDate.setDate(now.getDate() - 30);
            } else if (date === '3 months') {
                pastDate = new Date();
                pastDate.setMonth(now.getMonth() - 3);
            }
            // 'Any time' or others -> no filter

            if (pastDate) {
                where.createdAt = { [Op.gte]: pastDate };
            }
        }

        // 3. Sorting
        let order = [['createdAt', 'DESC']]; // Newest First (Default)
        if (sort === 'Oldest First') {
            order = [['createdAt', 'ASC']];
        }

        const applications = await Application.findAll({
            where,
            include: [
                {
                    model: Job,
                    as: 'job',
                    include: [
                        {
                            model: Company,
                            as: 'company',
                            attributes: ['name', 'logoUrl', 'location']
                        }
                    ]
                }
            ],
            order
        });

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get applicants for a job
// @route   GET /api/applications/jobs/:jobId/applicants
// @access  Private (Company)
const getJobApplicants = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        // Check if job belongs to company
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.companyId !== req.company.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const applicants = await Application.findAll({
            where: { jobId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'title', 'location', 'profilePictureUrl']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: applicants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (Company)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        const application = await Application.findByPk(applicationId, {
            include: [{ model: Job, as: 'job' }]
        });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Check if job belongs to company
        if (application.job.companyId !== req.company.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const allowedStatus = ['New', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired']
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        application.status = status;
        await application.save();

        res.status(200).json({ success: true, data: application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Withdraw application (Delete)
// @route   DELETE /api/applications/:id
// @access  Private (User)
const withdrawApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.user.id;

        const application = await Application.findByPk(applicationId);

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Check ownership
        if (application.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to withdraw this application' });
        }

        await application.destroy();

        res.status(200).json({ success: true, message: 'Application withdrawn successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
    withdrawApplication
};
