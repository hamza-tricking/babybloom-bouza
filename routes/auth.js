const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// JWT authentication for cross-domain compatibility
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt - Username:', username);
  console.log('Login attempt - Headers:', req.headers);

  // Simple hardcoded credentials (for demo purposes)
  // In production, use proper authentication with database
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === validUsername && password === validPassword) {
    // Create JWT token
    const token = jwt.sign(
      { username, authenticated: true },
      process.env.SESSION_SECRET || 'babybloom-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log('Login successful - JWT token created');
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      token,
      username
    });
  } else {
    console.log('Login failed - Invalid credentials');
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Logout (JWT doesn't need server-side logout)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

// Check authentication status
router.get('/status', (req, res) => {
  console.log('Auth status check - Headers:', req.headers);
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No JWT token found');
    return res.json({ authenticated: false });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'babybloom-secret-key');
    console.log('JWT token verified:', decoded);
    res.json({ 
      authenticated: true, 
      username: decoded.username 
    });
  } catch (error) {
    console.log('JWT token verification failed:', error.message);
    res.json({ authenticated: false });
  }
});

module.exports = router;
