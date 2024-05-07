const BudgetTable = require("../models/BudgetModel");


exports.addBudget = async (req, res) => {
    try {
      const { category, budget,month } = req.body;
      
      const newBudget = new BudgetTable({
        category,
        budget,
        month,
        userId: req.user.userId, 
      });
  
      const savedBudget = await newBudget.save();
  
      res.status(201).json(savedBudget);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.getBudgets = async (req, res) => {
    try {
      const budgets = await BudgetTable.find({ userId: req.user.userId });
      res.json(budgets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.updateBudget = async (req, res) => {
    try {
        const { category, budget,month } = req.body;
  
      const updatedBudget = await BudgetTable.findByIdAndUpdate(
        req.params.id,
        { category, budget,month },
        { new: true }
      );
  
      if (!updatedBudget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
  
      res.json(updatedBudget);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  exports.deleteBudget = async (req, res) => {
    try {
      const deletedBudget = await BudgetTable.findByIdAndDelete(req.params.id);
  
      if (!deletedBudget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
  
      res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

