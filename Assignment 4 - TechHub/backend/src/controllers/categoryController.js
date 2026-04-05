const { Category } = require('../models');

exports.createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll();

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        await category.update(req.body);

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        await category.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
