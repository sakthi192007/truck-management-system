var express = require('express');
var router = express.Router();
// inactivityMiddleware.js
let lastActivity = Date.now();

const inactivityTimeout = 30 * 60 * 1000; // 30 minutes

function checkInactivity(req, res, next) {
  const currentTime = Date.now();
  
  // Check if the user has been inactive for more than 30 minutes
  if (currentTime - lastActivity > inactivityTimeout) {
    // Handle logout or session expiry here, maybe invalidate the session or JWT
    res.status(401).send('Session expired');
    return;
  }

  lastActivity = currentTime;
  next();
}

module.exports = checkInactivity;
