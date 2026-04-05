const { User } = require('../models');
const fs = require('fs');
const path = require('path');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (User)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (User)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const {
            name,
            title,
            bio,
            city,
            state,
            country,
            zipCode,
            phone,
            portfolioUrl,
            linkedinUrl,
            githubUrl,
            skills,
            experience,
            education,
            experienceLevel
        } = req.body;

        // Update fields
        user.name = name || user.name;
        user.title = title || user.title;
        user.bio = bio || user.bio;
        user.city = city || user.city;
        user.state = state || user.state;
        user.country = country || user.country;
        user.zipCode = zipCode || user.zipCode;
        // Keep location synced as string for backward capability
        if (city && country) {
             user.location = `${city}, ${country}`;
        }

        user.phone = phone || user.phone;
        user.portfolioUrl = portfolioUrl || user.portfolioUrl;
        user.linkedinUrl = linkedinUrl || user.linkedinUrl;
        user.githubUrl = githubUrl || user.githubUrl;
        user.experienceLevel = experienceLevel || user.experienceLevel;

        if (skills) user.skills = skills;
        if (experience) {
            // Validate experience structure
            if (Array.isArray(experience)) {
                const isValid = experience.every(exp =>
                    exp.title &&  exp.companyName && exp.employmentType && exp.startDate && exp.location && exp.description
                );
                if (!isValid) {
                    return res.status(400).json({ success: false, message: 'Experience items must have companyName, employmentType, startDate, location, and description' });
                }
                user.experience = experience;
            }
        }
        if (education) user.education = education;

        await user.save();

        // Remove Password Field
        user.password = undefined;

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Upload resume
// @route   POST /api/users/resume
// @access  Private (User)
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Delete old resume if exists
        // if (user.resumeUrl) {
        //     const oldPath = path.join(__dirname, '..', user.resumeUrl);
        //     if (fs.existsSync(oldPath)) {
        //         fs.unlinkSync(oldPath);
        //     }
        // }

        // Save relative path and metadata
        user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
        user.resumeOriginalName = req.file.originalname;
        user.resumeSize = (req.file.size / 1024 / 1024).toFixed(2) + ' MB'; // Convert to MB string
        user.resumeUploadDate = Date.now();

        await user.save();

        res.status(200).json({
            success: true,
            data: {
                resumeUrl: user.resumeUrl,
                resumeOriginalName: user.resumeOriginalName,
                resumeSize: user.resumeSize,
                resumeUploadDate: user.resumeUploadDate
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile-picture
// @access  Private (User only)
const uploadProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Delete old profile picture if exists
        if (user.profilePictureUrl) {
            const oldPath = path.join(__dirname, '..', user.profilePictureUrl);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        user.profilePictureUrl = `/uploads/profiles/${req.file.filename}`;
        await user.save();
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Profile picture uploaded successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile by ID (Public)
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    uploadResume,
    uploadProfilePicture,
    getUserById
};
