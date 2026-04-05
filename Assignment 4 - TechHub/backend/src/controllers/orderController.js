const { Order } = require('../models');

exports.createOrder = async (req, res, next) => {
    try {
        const { products, totalAmount, status } = req.body;
        const order = await Order.create({
            products,
            totalAmount,
            status: status || 'pending'
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll();

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        await order.update(req.body);

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            const error = new Error('Order not found');
            error.statusCode = 404;
            throw error;
        }

        await order.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
