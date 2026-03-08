const express = require('express');
const { getStats, getPendingBusinesses, verifyBusiness, blacklistLocation, getSupportTickets, resolveTicket } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Sab routes protected hain aur sirf Admin ke liye hain
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/pending', getPendingBusinesses);
router.put('/verify/:id', verifyBusiness);

router.post('/blacklist', blacklistLocation);
router.get('/support', getSupportTickets);
router.put('/support/:id', resolveTicket);

module.exports = router;