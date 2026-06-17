const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

router.use(function(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({ message: 'Forbidden Access: No Token Provided' });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            const errordata = {
                message: err.message,
                expiredAt: err.expiredAt || 'N/A'
            };
            console.log("JWT Error:", errordata);

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired', expiredAt: err.expiredAt });
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        }
  res.locals.userId = decoded.sub;
       // req.decoded = decoded; // Attach decoded data to request
        next();
    });
});

module.exports = router;
