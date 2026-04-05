const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');

router.use((req, res, next) => {
    console.log('Product Route Request:', req.method, req.path);
    next();
});

router.post('/reset-stock', productController.resetStock);
router.get('/filter', productController.filterProducts);

router.get('/search', productController.searchProducts);
router.post('/', upload.single('image'), productController.createProduct);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
