const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'USER'
    },
    title: {
        type: DataTypes.STRING
    },
    bio: {
        type: DataTypes.TEXT
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    zipCode: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING // Keep for backward compatibility
    },
    phone: {
        type: DataTypes.STRING
    },
    portfolioUrl: {
        type: DataTypes.STRING
    },
    linkedinUrl: {
        type: DataTypes.STRING
    },
    githubUrl: {
        type: DataTypes.STRING
    },
    resumeUrl: {
        type: DataTypes.STRING
    },
    resumeOriginalName: {
        type: DataTypes.STRING
    },
    resumeSize: {
        type: DataTypes.STRING
    },
    resumeUploadDate: {
        type: DataTypes.DATE
    },
    profilePictureUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    experienceLevel: {
        type: DataTypes.ENUM('Entry', 'Mid', 'Senior', 'Expert', 'Lead'),
        allowNull: true
    },
    skills: {
        type: DataTypes.JSON, // Storing skills as a JSON array for simplicity
        defaultValue: []
    },
    experience: {
        type: DataTypes.JSON, // Storing experience as JSON array
        defaultValue: []
    },
    education: {
        type: DataTypes.JSON, // Storing education as JSON array
        defaultValue: []
    }
}, {
    timestamps: true
});

module.exports = User;
