const sequelize = require('../config/database');
const User = require('./User');
const Company = require('./Company');
const Job = require('./Job');
const Application = require('./Application');

// Define Associations

// Company -> Jobs
Company.hasMany(Job, { foreignKey: 'companyId', as: 'jobs' });
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// User -> Applications
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Job -> Applications
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

module.exports = {
    sequelize,
    User,
    Company,
    Job,
    Application
};
