
const express = require('express');
const router = express.Router();
const jwtCheck = require('../middlewares/jwtCheck');
const budgetController = require('../controllers/budgetController');

router.post('/', jwtCheck, budgetController.addBudget);
router.get('/', jwtCheck, budgetController.getBudgets);
router.put('/:id', jwtCheck, budgetController.updateBudget);
router.delete('/:id', jwtCheck, budgetController.deleteBudget);

module.exports = router;
