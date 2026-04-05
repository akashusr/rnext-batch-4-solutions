const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    products: {
        type: DataTypes.JSON, // Storing array of product IDs and quantities
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, completed, cancelled
    }
});

module.exports = Order;
