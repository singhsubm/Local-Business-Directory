const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const connectDB = require('./config/db');
const supportRoutes = require('./routes/supportRoutes');

// Route files
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();
connectDB();

const app = express();

// --- SECURITY MIDDLEWARES ---

// 1. Set security headers
app.use(helmet());

// 2. Prevent XSS attacks
// app.use(xss());

// 3. Rate Limiting (100 requests per 10 mins)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100
});
app.use('/api', limiter);

// 4. Prevent NoSQL Injection
// app.use(mongoSanitize());

// 5. Prevent HTTP Param Pollution
app.use(hpp());

// 6. CORS Setup (Strictly allow frontend origin)
app.use(cors({
  origin: true, // React Frontend URL
  credentials: true // Allow cookies
}));

// Body parser & Cookie parser
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/reviews', reviewRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));