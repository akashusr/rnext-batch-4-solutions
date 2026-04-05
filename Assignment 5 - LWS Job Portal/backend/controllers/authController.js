const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Company } = require('../models');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user or company
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {

    const { name, email, password, role, ...otherData } = req.body;

    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please add all required fields' });
        }

        // Check if user/company exists
        const userExists = await User.findOne({ where: { email } });
        const companyExists = await Company.findOne({ where: { email } });

        if (userExists || companyExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let data;
        let token;

        if (role === 'USER') {
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'USER',
                ...otherData
            });
            data = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };
            token = generateToken(user.id, 'USER');
        } else if (role === 'COMPANY') {
            // Generate slug
            let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            let slugExists = await Company.findOne({ where: { slug } });
            let counter = 1;
            while (slugExists) {
                const newSlug = `${slug}-${counter}`;
                slugExists = await Company.findOne({ where: { slug: newSlug } });
                if (!slugExists) {
                    slug = newSlug;
                } else {
                    counter++;
                }
            }

            const company = await Company.create({
                name,
                slug,
                email,
                password: hashedPassword,
                role: 'COMPANY',
                ...otherData
            });
            data = {
                id: company.id,
                name: company.name,
                email: company.email,
                role: company.role,
                slug: company.slug
            };
            token = generateToken(company.id, 'COMPANY');
        } else {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        res.status(201).json({
            success: true,
            data: data,
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Authenticate a user/company
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        let entity;
        if (role === 'USER') {
            entity = await User.findOne({ where: { email } });
        } else if (role === 'COMPANY') {
            entity = await Company.findOne({ where: { email } });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        if (entity && (await bcrypt.compare(password, entity.password))) {
            res.json({
                success: true,
                data: {
                    id: entity.id,
                    name: entity.name,
                    email: entity.email,
                    role: entity.role
                },
                token: generateToken(entity.id, role)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get current user/company profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        if (req.userRole === 'USER') {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });
            res.status(200).json({ success: true, data: user });
        } else if (req.userRole === 'COMPANY') {
            const company = await Company.findByPk(req.company.id, {
                attributes: { exclude: ['password'] }
            });
            res.status(200).json({ success: true, data: company });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    register,
    login,
    getMe
};
