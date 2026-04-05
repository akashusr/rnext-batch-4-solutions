const { Company, Job, Application, User } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// @desc    Get company profile
// @route   GET /api/companies/profile
// @access  Private (Company)
const getCompanyProfile = async (req, res) => {
    try {
        const company = await Company.findByPk(req.company.id, {
            attributes: { exclude: ['password'] }
        });

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        res.status(200).json({ success: true, data: company });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get public company profile by Slug
// @route   GET /api/companies/:slug
// @access  Public
const getCompanyBySlug = async (req, res) => {
    try {
        const company = await Company.findOne({
            where: { slug: req.params.slug },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Job,
                    as: 'jobs',
                    where: { status: 'Active' },
                    required: false,
                    include: [
                         { model: Company, as: 'company', attributes: ['name', 'logoUrl', 'location', 'slug'] }, // include company in job for completeness if needed
                         { model: Application, as: 'applications', attributes: ['id'] }
                    ]
                }
            ]
        });

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        // Add applicants count to jobs if needed, similar to jobController
        // Not strictly requested but good practice if jobs are returned
        const companyJSON = company.toJSON();
        if (companyJSON.jobs) {
             companyJSON.jobs = companyJSON.jobs.map(job => {
                job.applicants = job.applications ? job.applications.length : 0;
                delete job.applications;
                return job;
            });
        }

        res.status(200).json({ success: true, data: companyJSON });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update company profile
// @route   PUT /api/companies/profile
// @access  Private (Company)
const updateCompanyProfile = async (req, res) => {
    try {
        const company = await Company.findByPk(req.company.id);

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        const {
            name,
            industry,
            description,
            location,
            city,
            state,
            country,
            phone,
            socialLinks,
            websiteUrl,
            logoUrl,
            employeeCount,
            foundedYear,
            hrEmail,
            infoEmail
        } = req.body;

        company.name = name || company.name;
        company.industry = industry || company.industry;
        company.description = description || company.description;
        company.location = location || company.location;
        company.city = city || company.city;
        company.state = state || company.state;
        company.country = country || company.country;
        company.phone = phone || company.phone;
        company.socialLinks = socialLinks || company.socialLinks;
        company.websiteUrl = websiteUrl || company.websiteUrl;
        company.logoUrl = logoUrl || company.logoUrl;
        company.employeeCount = employeeCount || company.employeeCount;
        company.foundedYear = foundedYear || company.foundedYear;
        company.hrEmail = hrEmail || company.hrEmail;
        company.infoEmail = infoEmail || company.infoEmail;

        await company.save();

        const data = company.toJSON();
        delete data.password;

        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get company dashboard stats
// @route   GET /api/companies/dashboard/stats
// @access  Private (Company)
const getCompanyDashboardStats = async (req, res) => {
    try {
        const companyId = req.company.id;

        const totalJobs = await Job.count({ where: { companyId } });
        const activeJobs = await Job.count({ where: { companyId, status: 'Active' } });

        // Get all jobs for this company to count applicants
        const jobs = await Job.findAll({
            where: { companyId },
            include: [{ model: Application, as: 'applications' }]
        });

        let totalApplicants = 0; // Unique applicants? Or total applications? "Total Applications" requested.
        // If "Total Applicants" means unique users, we need to track userIds.
        // User requested "Total Applicants" AND "Total Applications".
        // Let's assume Total Applications = sum of all applications. Total Applicants = unique users.

        let totalApplications = 0;
        let uniqueApplicantIds = new Set();
        let pendingReviews = 0;
        let shortLists = 0;

        jobs.forEach(job => {
            const apps = job.applications || [];
            totalApplications += apps.length;

            apps.forEach(app => {
                uniqueApplicantIds.add(app.userId);
                if (['New', 'Pending'].includes(app.status)) { // Assuming 'Pending' exists or mapping 'New'
                     pendingReviews++;
                }
                if (app.status === 'Shortlisted') {
                    shortLists++;
                }
            });
        });

        res.status(200).json({
            success: true,
            data: {
                totalJobs,
                activeJobs,
                totalApplicants: uniqueApplicantIds.size,
                totalApplications,
                pendingReviews,
                shortLists
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Upload company logo
// @route   POST /api/companies/logo
// @access  Private (Company only)
const uploadLogo = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const company = await Company.findByPk(req.company.id);

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        // Delete old logo if exists
        if (company.logoUrl) {
            const oldPath = path.join(__dirname, '..', company.logoUrl);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        company.logoUrl = `/uploads/logos/${req.file.filename}`;
        await company.save();

        const data = {...company.toJSON()};
        delete data.password;

        res.status(200).json({
            success: true,
            message: 'Logo uploaded successfully',
            data: data
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get company open positions (Active Jobs)
// @route   GET /api/companies/:slug/jobs
// @access  Public
const getCompanyOpenPositions = async (req, res) => {
    try {
        const company = await Company.findOne({
            where: { slug: req.params.slug }
        });

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        const jobs = await Job.findAll({
            where: {
                companyId: company.id,
                status: 'Active'
            },
            include: [
                { model: Company, as: 'company', attributes: ['name', 'logoUrl', 'location', 'slug'] },
                { model: Application, as: 'applications', attributes: ['id'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Add applicants count
        const jobsData = jobs.map(job => {
            const jobJSON = job.toJSON();
            jobJSON.applicants = job.applications ? job.applications.length : 0;
            delete jobJSON.applications;
            return jobJSON;
        });

        res.status(200).json({ success: true, count: jobs.length, data: jobsData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get jobs posted by logged by company
// @route   GET /api/companies/jobs
// @access  Private (Company)
const getCompanyJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, sort } = req.query;
        const offset = (page - 1) * limit;

        const where = { companyId: req.company.id };

        // Validation for status
        const allowedStatuses = ['Active', 'Closed', 'Archived'];
        if (status !== undefined) {
             if (status === '' || status === 'null' || status === 'undefined') {
                // User said "Handle situation when provided query param empty, null, undefined" - "If query is not provided that's fine"
                // If it is provided as empty string, usually that means "no filter", but user said "if provided but is not correct return error".
                // An empty string is NOT a valid status enum. So strict validation implies error.
                // However, often frontend sends empty string for "All".
                // "If query is not provided, that's fine" -> implies optional.
                // "if provided but is not correct then return the error".
                // I will assume strictly checking against ENUM.
                // But specifically for 'null'/'undefined' strings or empty, I'll error if strict.
                // Let's implement strict check against allowed values.
                // Exception: if it is explicitly undefined in JS checks (already handled by `if (status !== undefined)`).

             }
             if (!allowedStatuses.includes(status)) {
                 return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
             }
             where.status = status;
        }

        if (search) {
             if (typeof search !== 'string') return res.status(400).json({ success: false, message: 'Invalid search parameter' });
             where.title = { [require('sequelize').Op.like]: `%${search}%` };
        }

        let order = [['createdAt', 'DESC']];
        if (sort) {
            if (!['newest', 'oldest'].includes(sort)) {
                return res.status(400).json({ success: false, message: 'Invalid sort parameter. Allowed: newest, oldest' });
            }
            if (sort === 'oldest') {
                order = [['createdAt', 'ASC']];
            }
        }

        const { count, rows } = await Job.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order,
            include: [{ model: Application, as: 'applications', attributes: ['id'] }],
            distinct: true
        });

        const jobsData = rows.map(job => {
            const jobJSON = job.toJSON();
            jobJSON.applicants = job.applications ? job.applications.length : 0;
            delete jobJSON.applications; // Clean up
            return jobJSON;
        });

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: jobsData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get applicants for logged in company
// @route   GET /api/companies/applicants
// @access  Private (Company)
// @desc    Get applicants for logged in company
// @route   GET /api/companies/applicants
// @access  Private (Company)
const getCompanyApplicants = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, sort, search, experienceLevel, date } = req.query;
        // Basic pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Find all jobs by this company
        const jobs = await Job.findAll({ where: { companyId: req.company.id }, attributes: ['id'] });
        const jobIds = jobs.map(job => job.id);

        // Base query for Application
        const where = { jobId: { [Op.in]: jobIds } };

        // 1. Status Filter (Multi-value, Case-insensitive)
        if (status) {
            const statusList = status.split(',').map(s => s.trim().toLowerCase());
            // Map to Enum values
            const statusMap = {
                'new': 'New',
                'shortlisted': 'Shortlisted',
                'interviewed': 'Interviewed',
                'rejected': 'Rejected',
                'hired': 'Hired'
            };
            const validStatuses = statusList
                .map(s => statusMap[s])
                .filter(s => s); // Remove undefined

            if (validStatuses.length > 0) {
                 where.status = { [Op.in]: validStatuses };
            }
        }

        // 2. Date Filter (Applied Date)
        if (date) {
            const now = new Date();
            let pastDate = null;
            const d = date.toLowerCase();

            if (d === 'last 7 day' || d === 'last 7 days') {
                pastDate = new Date();
                pastDate.setDate(now.getDate() - 7);
            } else if (d === 'last 30 day' || d === 'last 30 days') {
                pastDate = new Date();
                pastDate.setDate(now.getDate() - 30);
            } else if (d === '3 month' || d === '3 months') {
                pastDate = new Date();
                pastDate.setMonth(now.getMonth() - 3);
            }

            if (pastDate) {
                where.createdAt = { [Op.gte]: pastDate };
            }
        }

        // 3. User Filter (Experience Level & Search)
        const userWhere = {};

        // Experience Level (Multi-value, Case-insensitive)
        if (experienceLevel) {
             const expList = experienceLevel.split(',').map(e => e.trim().toLowerCase());
             const expMap = {
                 'entry': 'Entry',
                 'mid': 'Mid',
                 'senior': 'Senior',
                 'expert': 'Expert',
                 'lead': 'Lead'
             };
             const validExps = expList
                .map(e => expMap[e])
                .filter(e => e);

             if (validExps.length > 0) {
                 userWhere.experienceLevel = { [Op.in]: validExps };
             }
        }

        // Search (Name)
        if (search) {
             userWhere.name = { [Op.like]: `%${search}%` };
        }

        const userInclude = {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'experienceLevel', 'profilePictureUrl'],
            where: Object.keys(userWhere).length > 0 ? userWhere : undefined
        };

        // Sorting
        let order = [['createdAt', 'DESC']]; // Default
        if (sort === 'oldest') {
            order = [['createdAt', 'ASC']];
        } else if (sort === 'newest') {
             order = [['createdAt', 'DESC']];
        }

        const { count, rows } = await Application.findAndCountAll({
            where,
            include: [
                userInclude,
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'slug']
                }
            ],
            limit: limitNum,
            offset: offset,
            order,
            distinct: true
        });

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum,
            data: rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getCompanyProfile,
    getCompanyBySlug,
    updateCompanyProfile,
    getCompanyDashboardStats,
    uploadLogo,
    getCompanyOpenPositions,
    getCompanyJobs,
    getCompanyApplicants
};
