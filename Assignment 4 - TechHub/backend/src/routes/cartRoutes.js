const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:id', cartController.updateCartItem);
router.delete('/', cartController.clearCart);
router.delete('/:id', cartController.deleteCartItem);

module.exports = router;
