const ExpenseTable = require("../models/ExpenseModel");


exports.addExpense = async (req, res) => {
    try {
      const {month, category, expense  } = req.body;
  
      const newExpense = new ExpenseTable({
        expense,
        month,
        userId: req.user.userId,
        category,
      });
  
      const savedExpense = await newExpense.save();
  
      res.status(201).json(savedExpense);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.getExpenses = async (req, res) => {
    try {
      const expenses = await ExpenseTable.find({ userId: req.user.userId });
      res.json(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.updateExpense = async (req, res) => {
    try {
      const { month, category, expense  } = req.body;
  
      const updatedExpense = await ExpenseTable.findByIdAndUpdate(
        req.params.id,
        { month, category, expense },
        { new: true }
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      res.json(updatedExpense);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  exports.monthly = async (req, res) => {
    const userId = req.user.userId; 
   
    try {
      // Fetch monthly expenses for the specific user, categorized by month and expense category
      const monthlyExpenses = await ExpenseTable.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: { month: "$month", category: "$category" }, totalExpense: { $sum: "$expense" } } },
        { $group: { _id: "$_id.month", expenses: { $push: { category: "$_id.category", expense: "$totalExpense" } } } }
      ]);
  
      const formattedMonthlyExpenses = monthlyExpenses.reduce((acc, item) => {
        acc[item._id] = item.expenses.reduce((expenseAcc, expenseItem) => {
          expenseAcc[expenseItem.category] = expenseItem.expense;
          return expenseAcc;
        }, {});
        return acc;
      }, {});
  
      res.json(formattedMonthlyExpenses);
    } catch (error) {
      console.error('Error fetching monthly expenses for user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.deleteExpense = async (req, res) => {
    try {
      const deletedExpense = await ExpenseTable.findByIdAndDelete(req.params.id);
  
      if (!deletedExpense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

