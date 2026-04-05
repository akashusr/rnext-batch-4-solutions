const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating_rate: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    rating_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Product;
