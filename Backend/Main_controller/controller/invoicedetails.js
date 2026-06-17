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
var upload = multer({ storage: storage }).single('file');
//const pdf = require('html-pdf'); 



router.get("/details/:id/:vehicle", verifytoken, function (req, res, next) {
    const id = req.params.id;
    const vehicle = req.params.vehicle;
    db.sequelize.query(
        "select c.In_key,b.FirstName name,a.VehicleNumber,b.Email,b.PhoneNumber,c.invoiceDate,c.containerNmber,c.sgst_amount,c.igst_amount,c.sub_amount,c.total  from bookingRegisters a left join SKY_CreateClients b on a.Customer=b.Client_Id left join seller_Invoices c on a.VehicleNumber=c.vehicle_number where a.status='1' and b.Client_Id='" + id + "' and a.VehicleNumber='" + vehicle + "' ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((invoice) => {
            if (!invoice) {
                winston.error("/getinvoice" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            } else {
                db.sequelize.query(
                    "select a.* from seller_Items a left join seller_Invoices c on a.In_key=c.In_key where c.vehicle_number='" + vehicle + "'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
                )
                    .then((items) => {
                        console.log(items);
                        res.status(200).send({
                            response_code: "200",
                            response_message: "success.",
                            data: invoice,
                            invoiceitems: items,
                        });
                        winston.info("Clients");
                    })

            }

        })
        .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getvendor", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select  c.VehicleNumber,a.CD_ID,a.CompanyName from VendorsCompanyDetails a left join vehicleDetails c on a.CD_ID=c.CD_ID where c.status='1' union all select  c.VehicleNumber,a.CD_ID,a.CompanyName from VendorsCompanyDetails a left join AdditionalvehicleDetails c on a.CD_ID=c.CD_ID where a.status='1' and c.status='1'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getportofloading/:id", verifytoken, function (req, res, next) {
         var id = req.params.id;
    db.sequelize.query(
       "EXEC PortLocations_list @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

router.get("/description", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select * from description", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

router.get("/invoicegrid/:id/:role", verifytoken, function (req, res, next) {
     const id = req.params.id;
 
 
     db.sequelize.query(
        "EXEC Invoicepending_Grid @LoginUserID='"+id+"'",  { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
     )
   
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success",
                data,
            });
            winston.info("Invoice details fetched successfully");
        })
        .catch((error) => {
            console.error("Error fetching Invoice details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error",
            });
        });
});
router.get("/invoicegridcomplete/:id/:role", verifytoken, function (req, res, next) {
     const id = req.params.id;
    const role = req.params.role;
 var custoquery = "";
  
 
     db.sequelize.query(
         "EXEC InvoiceDownload_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
     )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success",
                data,
            });
            winston.info("Invoice details fetched successfully");
        })
        .catch((error) => {
            console.error("Error fetching Invoice details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error",
            });
        });
});

router.get("/getupdate/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
        "select a.*,b.State from Invoices a left join SKY_CreateClients b on a.CompanyName = b.Client_Id where a.I_id=" + id + " ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((booking) => {
            if (!booking) {
                winston.error("/getInvoicedetails" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            } else {
                db.sequelize.query(
                    "select b.IGST as sgstper,b.IGST as igstper,a.* from InvoiceLine_ItemDetails a left join ChargeCode b on a.Description=b.ChargeDescription where a.I_id=" + id + " ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
                )
                    .then((items) => {
                        console.log(items);
                        res.status(200).send({
                            response_code: "200",
                            response_message: "success.",
                            data: booking,
                            lineitems: items,
                        });
                        winston.info("Invoicedetails");
                    })

            }

        })
        .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });


});
///invoice
router.get("/getbookingnumber/:id/:Dep/:userId", verifytoken, function (req, res, next) {
    const id = req.params.id;
    const Dep = req.params.Dep;
    const userId = req.params.userId;

    let dep = "";


    if (Dep == 1) {
        dep = "EXEC InvoiceCompanyBooking_list @LoginUserID='"+userId+"' , @CustomerID ='"+id+"'";
    } else {
         dep = "EXEC ImportInvoiceCompanyBooking_list @LoginUserID='"+userId+"' , @CustomerID ='"+id+"'";
    }
    db.sequelize.query(
        "" + dep + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getcompany/:id/:userId", verifytoken, function (req, res, next) {

    const id = req.params.id;
    const userId = req.params.userId;

    let department = '';
    if (id == 1) {
        department =   "EXEC InvoiceCompany_list @LoginUserID='"+userId+"'";
    } else {
        department = "EXEC ImportInvoiceCompany_list @LoginUserID='"+userId+"'";
    }
    db.sequelize.query(
        " "+ department + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getDesc/:id", verifytoken, function (req, res, next) {

    const id = req.params.id;


    db.sequelize.query(
        "select * from ChargeCode where Cd_id=" + id + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/invoicegetcontainer/:booking/:dep", verifytoken, function (req, res, next) {
    const booking = req.params.booking;
    const dep = req.params.dep;

    let department = "";
    if (dep == 1) {
        department = "EXEC GetExportChargesByBooking @BookingNumber = '"+booking+"'";
    } else {
        department = "EXEC GetImportChargesByBooking @BookingNumber = '"+booking+"'";
    }
    db.sequelize.query(
        "" + department + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getcontainernumber/:booking", verifytoken, function (req, res, next) {
    const booking = req.params.booking;
    db.sequelize.query(
        "select b.containernumber from Export_Bookings a left outer join EB_ItemDetails b on a.EB_id=b.EB_id where a.BookingNumber='" + booking + "' union all select b.containernumber from Import_Bookings a left outer join IB_ItemDetails b on a.IB_id=b.IB_id where a.BookingNumber='" + booking + "'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getHalting/:bookinNumber/:Halting/:containertype", verifytoken, function (req, res, next) {
    let booking = req.params.bookinNumber;
    let Halting = req.params.Halting;
    let containertype = req.params.containertype;
    db.sequelize.query("SELECT HaltingChargeType AS [HaltingCharges Type], HaltingChargeAmount AS [Amount] FROM Client_selling_price a left outer join Export_Bookings b on a.ClientName=b.CustomerName left outer join general c on a.ContainerType=c.G_key CROSS APPLY (VALUES ('HaltingCharges1to2days', HaltingCharges1to2days), ('HaltingCharges2to5days', HaltingCharges2to5days), ('HaltingChargesabove5days', HaltingChargesabove5days) ) AS Unpivoted(HaltingChargeType, HaltingChargeAmount) WHERE b.BookingNumber = '" + booking + "' and HaltingChargeType='" + Halting + "' and c.generalType='" + containertype + "' group by HaltingChargeType,HaltingChargeAmount union all SELECT HaltingChargeType AS [HaltingCharges Type], HaltingChargeAmount AS [Amount] FROM Client_selling_price a left outer join Import_Bookings b on a.ClientName=b.CustomerName left outer join general c on a.ContainerType=c.G_key CROSS APPLY (VALUES ('HaltingCharges1to2days', HaltingCharges1to2days), ('HaltingCharges2to5days', HaltingCharges2to5days), ('HaltingChargesabove5days', HaltingChargesabove5days) ) AS Unpivoted(HaltingChargeType, HaltingChargeAmount) WHERE b.BookingNumber = '" + booking + "' and HaltingChargeType='" + Halting + "' and c.generalType='" + containertype + "' group by HaltingChargeType,HaltingChargeAmount", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getcharge/", verifytoken, function (req, res, next) {

    db.sequelize.query("select * from ChargeCode", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getchargeid/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    db.sequelize.query("select * from ChargeCode where Cd_id=" + id + "	", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getstate/:id", verifytoken, function (req, res, next) {
    let id = req.params.id;
    db.sequelize.query("select State from SKY_CreateClients where Client_Id=" + id + " group by State", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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




module.exports = router;