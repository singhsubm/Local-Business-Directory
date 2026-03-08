const express = require('express');
const { createBooking, getMyBookings, getBusinessBookings, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Sab routes protected hain

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/business/:businessId', getBusinessBookings);
router.put('/:id', updateBookingStatus);
router.delete("/:id", deleteBooking);


module.exports = router;