const sequelize = require('../config/database');
const Product = require('./Product');
const Category = require('./Category');
const Cart = require('./Cart');
const Order = require('./Order');

const db = {
    sequelize,
    Product,
    Category,
    Cart,
    Order
};

// Sync database
db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced');
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });

module.exports = db;
