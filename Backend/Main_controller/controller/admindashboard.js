//packages
const bcrypt = require("bcrypt");
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
//router
const router = express.Router();
//database connection
const db = require('../../config/dbconnection');
//config
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const { storage } = require('../../middlewares/storage');

router.get("/getclientcount/", verifytoken, function (req, res, next) {

    db.sequelize.query("SELECT FORMAT(CreatedOn, 'MMM yyyy') AS MonthYear, COUNT(*) AS ClientCount FROM UserLoginDetails where User_Roleid=3 and status=1 GROUP BY FORMAT(CreatedOn, 'MMM yyyy') ORDER BY MIN(CreatedOn);", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Clients");
        })
        .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/getclienttotalcount/", verifytoken, function (req, res, next) {

    db.sequelize.query("SELECT COUNT(*) AS TotalClients FROM UserLoginDetails where User_Roleid=3", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Clients");
        })
        .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getactiveclients", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "SELECT (SELECT COUNT(*) FROM UserLoginDetails WHERE User_Roleid=3 and status = 1) AS ActiveClients, (SELECT COUNT(*) FROM UserLoginDetails WHERE User_Roleid=3 and status = 0) AS InactiveClients;",
        { type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success",
            data: data[0],   
        });
    })
    .catch(error => {
        console.error("Error fetching client status count:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});


module.exports = router;