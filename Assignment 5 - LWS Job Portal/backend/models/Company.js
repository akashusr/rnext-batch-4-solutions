const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
        defaultValue: 'COMPANY'
    },
    industry: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    location: {
        type: DataTypes.STRING // General location string, kept for backward compatibility or display
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
    phone: {
        type: DataTypes.STRING
    },
    socialLinks: {
        type: DataTypes.JSON // Stores object like { linkedin: '', facebook: '', twitter: '' }
    },
    websiteUrl: {
        type: DataTypes.STRING
    },
    hrEmail: {
        type: DataTypes.STRING,
        validate: { isEmail: true }
    },
    infoEmail: {
        type: DataTypes.STRING,
        validate: { isEmail: true }
    },
    logoUrl: {
        type: DataTypes.STRING
    },
    employeeCount: {
        type: DataTypes.STRING
    },
    foundedYear: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: true
});

module.exports = Company;
