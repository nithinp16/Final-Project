
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1m' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  
  try {
    const token = req.body.token;
    const username = req.body.username;
    const user = await User.findOne({ username });
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    jwt.verify(token, 'secret', (err) => {
      if (err) {
        
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1m' });
   
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  res.send({ message: "success" });
};
