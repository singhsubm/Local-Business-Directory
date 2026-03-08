const express = require('express');
const { createTicket, getMyTickets } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Sab kuch protected hai

router.route('/')
  .post(createTicket);

router.route('/me')
  .get(getMyTickets);

module.exports = router;