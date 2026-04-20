require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/database');

// Import routes
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
connectDB();

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:3000', 'https://babybloom-bouza.vercel.app', 'https://dmtart.pro'];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'babybloom-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to false for development and cross-domain
    httpOnly: true,
    sameSite: 'none', // Allow cross-site cookies
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// API routes
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

// Authentication middleware for protected routes
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Protected API routes
app.get('/api/dashboard', isAuthenticated, (req, res) => {
  res.json({ message: 'Welcome to dashboard', user: req.session.username });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'BabyBloom Backend API',
    version: '1.0.0',
    endpoints: {
      orders: '/api/orders',
      auth: '/api/auth',
      dashboard: '/api/dashboard'
    }
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'BabyBloom Backend API',
    version: '1.0.0',
    endpoints: {
      orders: '/api/orders',
      auth: '/api/auth',
      dashboard: '/api/dashboard'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {

  console.log(`Frontend should be accessed via Next.js dev server` ,PORT);
});
