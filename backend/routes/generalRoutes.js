
const express = require('express');
const router = express.Router();

const categories = [
  "Entertainment",
  "Food",
  "Groceries",
  "Rent",
  "Travel",
  "Fees",
  "Insurance",
  "Others"
];

router.get('/', (req, res) => {
  res.json(categories);
});

module.exports = router;
