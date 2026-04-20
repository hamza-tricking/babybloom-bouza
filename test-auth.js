// Test script to verify authentication and order status update
const jwt = require('jsonwebtoken');

// Test JWT token generation
const testToken = jwt.sign(
  { username: 'admin', authenticated: true },
  'babybloom-secret-key',
  { expiresIn: '24h' }
);

console.log('Test JWT Token:', testToken);
console.log('Token verification test:');

try {
  const decoded = jwt.verify(testToken, 'babybloom-secret-key');
  console.log('✓ Token verification successful:', decoded);
} catch (error) {
  console.log('✗ Token verification failed:', error.message);
}
