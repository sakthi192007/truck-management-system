const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const { storage } = require('../../middlewares/storage');
const db = require('../../config/dbconnection');
const ICD_Details = db.cfscreation;

router.post('/cfscreation', verifytoken, async (req, res) => {
    const jsondata = req.body;

    try {
        const newVehicle = await ICD_Details.create({
            LocationName: jsondata.cfs,
        });

        const response = CF.getStandardResponse(201, "CFS added created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postcfscreation: ' + err.message);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

module.exports = router;
