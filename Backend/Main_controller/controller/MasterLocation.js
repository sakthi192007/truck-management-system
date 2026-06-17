const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const pdf = require("pdf-creator-node");
const puppeteer = require('puppeteer');
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const { storage } = require('../../middlewares/storage');
const { Console, log } = require("console");
const { json } = require("body-parser");
var upload = multer({ storage: storage }).single('file');
//const pdf = require('html-pdf'); 
const MasterLocation = db.MasterLocation;



router.get("/getportdescription", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select LocationName from portdescription", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("portdescription");
        })
        .catch(error => {
            console.error("Error fetching portdescription:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.post('/', verifytoken, async function (req, res, next) {
    const jsondata = req.body;
    console.log("jsondata",jsondata);
    const latitude = parseFloat(jsondata.latitude);
    const longitude = parseFloat(jsondata.longitude);

    try {
        const newCompany = await MasterLocation.create({

            Ml_LocationType: jsondata.Location_Type,
            Ml_LocationName: jsondata.Location_Name,
            Ml_Address: jsondata.Address,
            Ml_latitude: jsondata.latitude,
            Ml_longitude: jsondata.longitude,
            Ml_City: jsondata.city,
            Ml_State: jsondata.State,
            Ml_Country: jsondata.Country,
            Ml_Createdby: jsondata.CreatedBy
        });
        const response = CF.getStandardResponse(201, "MasterLocation created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postMasterLocation: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
})

router.put('/update/:id', verifytoken, async function (req, res, next) {

    try {
        const id = req.params.id;
        const jsondata = req.body;

        const updatedLocation = {
            Ml_LocationType: jsondata.Location_Type,
            Ml_LocationName: jsondata.Location_Name,
            Ml_Address: jsondata.Address,
            Ml_latitude: jsondata.latitude,
            Ml_longitude: jsondata.longitude,
            Ml_City: jsondata.city,
            Ml_State: jsondata.State,
            Ml_Country: jsondata.Country,
            Ml_Modifiedby: jsondata.Ml_Modifiedby

        };
        try {
            const updatedLocations = await MasterLocation.update(updatedLocation, {
                where: { Ml_key: id }
            });
            console.log('Locations updated successfully:', updatedLocations);
            const response = CF.getStandardResponse(201, "Locations updated successfully");
            res.status(201).send(response);
        } catch (error) {
            console.error('Error updating Locations:', error);
        }

    } catch (err) {
        winston.error('putMasterLocation: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
})
router.get("/get/:id/:role", verifytoken, async (req, res) => {
    const id = req.params.id;
    const role = req.params.role;
   
    db.sequelize.query(
        "EXEC MasterLocation_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success",
                data,
            });
            winston.info("locationdetails fetched successfully.");
        })
        .catch((error) => {
            console.error("Error fetching location details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error",
            });
        });

});

router.get("/:id", verifytoken, async (req, res) => {
    const id = req.params.id;
    try {
        const data = await db.sequelize.query("SELECT Ml_key,Ml_LocationType, Ml_LocationName, Ml_Address, Ml_Latitude,Ml_Longitude, Ml_City, Ml_State, Ml_Country FROM MasterLocation where Ml_key=" + id + "",
            { type: db.Sequelize.QueryTypes.SELECT });
        res.status(200).json({ response_code: "200", response_message: "success", data, });
        winston.info("locationdetails fetched successfully.");
    }
    catch (error) {
        console.error("Error fetching location details:", error);
        res.status(500).json({ response_code: "500", response_message: "Internal Server Error" });
    }
});
module.exports = router;