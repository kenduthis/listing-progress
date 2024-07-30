const express = require('express');
const fs = require('fs');
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

app.use(express.static('public'));

app.get('/api/balances', (req, res) => {
  fs.readFile('public/balances.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading balances:', err);
      res.status(500).send('Error reading balances');
      return;
    }
    res.json(JSON.parse(data));
  });
});

module.exports = app;
