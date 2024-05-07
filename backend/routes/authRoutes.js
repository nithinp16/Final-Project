const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jwtCheck = require('../middlewares/jwtCheck');

router.post("/login", authController.loginUser);
router.post("/signup", authController.registerUser);
router.post("/refreshToken", authController.refreshToken);

module.exports = router;
