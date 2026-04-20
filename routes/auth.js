const express = require('express');
const router = express.Router();

// Simple authentication (you can enhance this with JWT or session management)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt - Username:', username);
  console.log('Login attempt - Session before:', req.session);
  console.log('Login attempt - Session ID:', req.sessionID);
  console.log('Login attempt - Headers:', req.headers);

  // Simple hardcoded credentials (for demo purposes)
  // In production, use proper authentication with database
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === validUsername && password === validPassword) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    console.log('Login successful - Session after:', req.session);
    
    res.json({ success: true, message: 'Login successful' });
  } else {
    console.log('Login failed - Invalid credentials');
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logout successful' });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  console.log('Auth status check - Session:', req.session);
  console.log('Auth status check - Session ID:', req.sessionID);
  console.log('Auth status check - Is authenticated:', req.session?.isAuthenticated);
  console.log('Auth status check - Headers:', req.headers);
  
  if (req.session && req.session.isAuthenticated) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
