const express = require('express');
const router = express.Router();
const config1 = require('../../config/config.json');
const jwt = require('jsonwebtoken');
const verifytoken = require('../../middlewares/verifytoken');
const db = require('../../config/dbconnection');
router.post('/idle', verifytoken, async function (req, res) {
    const user_Id = res.locals.userId;
    console.log(`[${new Date().toLocaleString()}] info: POST /session/set-idle | userId=${user_Id}`);
    const refreshToken = jwt.sign({ sub: user_Id }, config1.refreshTokenSecret, {
        expiresIn: config1.refreshTokenLife
    });

    const token = jwt.sign({ sub: user_Id }, config1.secret, {
        expiresIn: config1.tokenLife
    });

    return res.status(200).send({
        response_code: 200,
        response_message: "Token refreshed successfully",
        accessToken: token,
        refreshToken: refreshToken
    });
});

 

module.exports = router;



