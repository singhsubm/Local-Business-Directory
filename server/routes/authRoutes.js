const express = require('express');
const { register, login, logout, getMe, updateDetails, updatePassword, getUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;