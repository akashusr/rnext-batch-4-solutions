const { Cart, Product } = require('../models');

// Helper to populate cart item
const populateCartItem = async (cartItem) => {
    const product = await Product.findByPk(cartItem.productId);
    return {
        id: cartItem.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        expiresAt: cartItem.expiresAt,
        product: product ? product.toJSON() : null
    };
};

exports.getCart = async (req, res, next) => {
    try {
        const cartItems = await Cart.findAll();
        const populatedCart = await Promise.all(cartItems.map(item => populateCartItem(item)));

        res.status(200).json({
            success: true,
            count: populatedCart.length,
            data: populatedCart
        });
    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            const error = new Error('Product ID and Quantity are required');
            error.statusCode = 400;
            throw error;
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        if (product.stock < quantity) {
            const error = new Error(`Insufficient stock. Available: ${product.stock}`);
            error.statusCode = 400;
            throw error;
        }

        // Check if product already exists in cart
        let cartItem = await Cart.findOne({ where: { productId } });
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        if (cartItem) {
            // Update quantity
            const newQuantity = cartItem.quantity + quantity;
            if (product.stock < newQuantity) {
                 const error = new Error(`Insufficient stock for update. Available: ${product.stock}`);
                 error.statusCode = 400;
                 throw error;
            }
            await cartItem.update({ quantity: newQuantity, expiresAt });
        } else {
            // Create new item
            cartItem = await Cart.create({
                productId,
                quantity,
                expiresAt
            });
        }

        const populatedItem = await populateCartItem(cartItem);

        res.status(201).json({
            success: true,
            data: populatedItem
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const cartItem = await Cart.findByPk(req.params.id);

        if (!cartItem) {
            const error = new Error('Cart item not found');
            error.statusCode = 404;
            throw error;
        }

        const { quantity } = req.body;
        if (!quantity) {
             const error = new Error('Quantity is required');
             error.statusCode = 400;
             throw error;
        }

        const product = await Product.findByPk(cartItem.productId);
        if (product.stock < quantity) {
            const error = new Error(`Insufficient stock. Available: ${product.stock}`);
            error.statusCode = 400;
            throw error;
        }

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await cartItem.update({ quantity, expiresAt });

        const populatedItem = await populateCartItem(cartItem);

        res.status(200).json({
            success: true,
            data: populatedItem
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCartItem = async (req, res, next) => {
    try {
        const cartItem = await Cart.findByPk(req.params.id);

        if (!cartItem) {
            const error = new Error('Cart item not found');
            error.statusCode = 404;
            throw error;
        }

        await cartItem.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        await Cart.destroy({
            where: {},
            truncate: true
        });

        res.status(200).json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        next(error);
    }
};
