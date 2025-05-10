// Simplified Sabeel application without 3D visualization or complex components

const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
// Import API routes
const apiRoutes = require('./api-routes');
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Initialize API routes
apiRoutes(app);

// Basic route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API route for basic functionality
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Sabeel API is running',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Simplified Sabeel server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
  });
}

module.exports = app; // Export for testing