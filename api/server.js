const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();
const app = express();

// Apply security headers
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get balances
app.get('/public/balances', (req, res) => {
  const filePath = path.join(__dirname, 'balances.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading balances:', err);
      res.status(500).send('Error reading balances');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send('404: Not Found');
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500: Internal Server Error');
});

module.exports = app;
