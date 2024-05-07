
const express = require('express');
const router = express.Router();
const jwtCheck = require('../middlewares/jwtCheck');
const expenseController = require('../controllers/expenseContoller');

router.post('/', jwtCheck, expenseController.addExpense);
router.get('/', jwtCheck, expenseController.getExpenses);
router.put('/:id', jwtCheck, expenseController.updateExpense);
router.delete('/:id', jwtCheck, expenseController.deleteExpense);
router.get('/monthly', jwtCheck, expenseController.monthly);

module.exports = router;
