const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    companyId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'),
        allowNull: false
    },
    workMode: {
        type: DataTypes.ENUM('Remote', 'On-site', 'Hybrid'),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salaryMin: {
        type: DataTypes.INTEGER
    },
    salaryMax: {
        type: DataTypes.INTEGER
    },
    salaryPeriod: {
        type: DataTypes.ENUM('Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'),
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Other'),
        allowNull: true
    },
    experienceLevel: {
        type: DataTypes.ENUM('Entry', 'Mid', 'Senior', 'Expert', 'Lead'),
        allowNull: true
    },
    requirements: {
        type: DataTypes.TEXT
    },
    benefits: {
        type: DataTypes.TEXT
    },
    deadline: {
        type: DataTypes.DATE
    },
    vacancies: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },

    status: {
        type: DataTypes.ENUM('Active', 'Closed', 'Archived'),
        defaultValue: 'Active'
    },
    skills: {
        type: DataTypes.JSON, // Storing required skills as JSON array
        defaultValue: []
    }
}, {
    timestamps: true
});

module.exports = Job;
