const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const nodemailer = require('nodemailer');
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const { storage } = require('../../middlewares/storage');
var upload = multer({ storage: storage }).single('file');
const moment = require('moment');
const bookingallocation = db.bookingallocation;
router.get("/getvendordata", verifytoken, function (req, res, next) {

    db.sequelize.query(
        "select CD_ID, CompanyName  from VendorsCompanyDetails", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("generalType");
        })
        .catch(error => {
            console.error("Error fetching generalType:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

//company
router.get("/getcompanydata", verifytoken, function (req, res, next) {

    db.sequelize.query(
        "select Client_Id, CompanyName  from SKY_CreateClients", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("generalType");
        })
        .catch(error => {
            console.error("Error fetching generalType:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
//booking
router.get("/getbookingnumber/:id/", verifytoken, function (req, res, next) {
    const id = req.params.id;


    db.sequelize.query(
        "SELECT BookingNumber FROM Import_Bookings WHERE CustomerName = " + id + " GROUP BY BookingNumber UNION SELECT BookingNumber FROM Export_Bookings WHERE CustomerName =" + id + " GROUP BY BookingNumber; ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.post('/bookingdata', verifytoken, async function (req, res, next) {

    const jsondata = req.body;

    console.log(jsondata);
    try {
        const newCompany = await bookingallocation.create({
            Vendor_ID: jsondata.Vendor,
            Client_ID: jsondata.company,
            BookingNumber: jsondata.bookingno,
            Status: jsondata.status,
            CreatedBy: jsondata.CreatedBy


        });


        const response = CF.getStandardResponse(201, "Booking Allocation created successfully", { id: newCompany.ID });
        res.status(201).send(response);

    } catch (err) {
        winston.error('postClientPrices: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }

});
router.put('/update/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;


    if (!id) {
        return res.status(400).json({ message: "Invalid ID for update" });
    }

    try {
        const updatedCompanyData = {
            Vendor_ID: jsondata.Vendor,
            Client_ID: jsondata.company,
            BookingNumber: jsondata.bookingno,
            Status: jsondata.status,

        };

        const updatedCompany = await bookingallocation.update(updatedCompanyData, {
            where: { ID: id }
        });

        console.log('Booking Allocation updated successfully:', updatedCompany);
        res.status(200).json({ message: 'Booking Allocation updated successfully' });
    } catch (err) {
        console.error('Error updating Booking Allocation:', err);
        winston.error('BookingAllocation: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
//grid
router.get("/allocationgrid/:id/:role", verifytoken, function (req, res, next) {
    const id = req.params.id;
    const role = req.params.role;
 var custoquery = "";
   if (role == 0) {
            custoquery = "SELECT a.ID,a.CreatedOn, b.CompanyName AS VendorCompanyName, c.CompanyName AS ClientCompanyName, a.BookingNumber, CASE WHEN a.Status = 0 THEN 'Ongoing' WHEN a.Status = 1 THEN 'Completed' ELSE 'Unknown' END AS Status FROM driverBookings a LEFT JOIN VendorsCompanyDetails b ON a.Vendor_ID = b.CD_ID LEFT JOIN SKY_CreateClients c ON a.Client_ID = c.Client_Id;";
        } else if (role == 4){
            custoquery = "SELECT a.ID,a.CreatedOn ,b.CompanyName AS VendorCompanyName, c.CompanyName AS ClientCompanyName, a.BookingNumber, CASE WHEN a.Status = 0 THEN 'Ongoing' WHEN a.Status = 1 THEN 'Completed' ELSE 'Unknown' END AS Status FROM SubAdminLoginDetails d inner join driverBookings a on d.SA_ID=a.CreatedBy LEFT JOIN VendorsCompanyDetails b ON a.Vendor_ID = b.CD_ID LEFT JOIN SKY_CreateClients c ON a.Client_ID = c.Client_Id where a.CreatedBy = '"+id+"'";
    
        }else if(role == 3){
            custoquery = "SELECT a.ID,a.CreatedOn, b.CompanyName AS VendorCompanyName, c.CompanyName AS ClientCompanyName, a.BookingNumber, CASE WHEN a.Status = 0 THEN 'Ongoing' WHEN a.Status = 1 THEN 'Completed' ELSE 'Unknown' END AS Status FROM  ClientLoginDetails h inner join SubAdminLoginDetails d on h.Client_ID=d.Client_ID inner join driverBookings a on d.SA_ID=a.CreatedBy LEFT JOIN VendorsCompanyDetails b ON a.Vendor_ID = b.CD_ID LEFT JOIN SKY_CreateClients c ON a.Client_ID = c.Client_Id where h.Client_ID='"+id+"'";
    
        }
        else {
            custoquery = "SELECT a.ID,a.CreatedOn, b.CompanyName AS VendorCompanyName, c.CompanyName AS ClientCompanyName, a.BookingNumber, CASE WHEN a.Status = 0 THEN 'Ongoing' WHEN a.Status = 1 THEN 'Completed' ELSE 'Unknown' END AS Status FROM driverBookings a LEFT JOIN VendorsCompanyDetails b ON a.Vendor_ID = b.CD_ID LEFT JOIN SKY_CreateClients c ON a.Client_ID = c.Client_Id where a.Vendor_ID = '" + id + "'";
        }
    
        db.sequelize.query(
            "" + custoquery + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
   
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success",
                data,
            });
            winston.info("Invoice Payment details fetched successfully");
        })
        .catch((error) => {
            console.error("Error fetching Invoice Payment details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error",
            });
        });
});
router.get("/Getupdate/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
        " select * from driverBookings where ID=" + id + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Clientspricedetails");
        })
        .catch(error => {
            console.error("Error fetching client details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

module.exports = router;
