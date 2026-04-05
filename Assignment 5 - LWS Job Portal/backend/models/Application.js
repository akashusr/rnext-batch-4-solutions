const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    jobId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('New', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired'),
        defaultValue: 'New'
    },
    coverLetter: {
        type: DataTypes.TEXT
    },
    resumeUrl: {
        type: DataTypes.STRING // Snapshot of resume at time of application
    }
}, {
    timestamps: true
});

module.exports = Application;
