const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const Apinvoices = db.Apinvoices;
const Aplineitems = db.Aplineitems;
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const pdf = require("pdf-creator-node");


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
const { console } = require("inspector");
var upload = multer({ storage: storage }).single('file');
router.get("/invoicegrid/:id/:role", verifytoken, function (req, res, next) {
     const id = req.params.id;
    const role = req.params.role;
 
  
      db.sequelize.query(
          "EXEC Apinvoice_Grid @LoginUserID = '"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
        "select a.*,b.State from Apinvoices a left join VendorsCompanyDetails  b on a.VendorName=b.CD_ID where a.AP_id=" + id + " ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((booking) => {
            if (!booking) {
                winston.error("/getInvoicedetails" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            } else {
                db.sequelize.query(
                    "select b.IGST as sgstper,b.IGST as igstper,a.* from ApLine_itemDetails a inner join ChargeCode b on a.Description=b.ChargeDescription where a.AP_id='" + id + "' ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
                )
                    .then((items) => {
                        console.log(items);
                        res.status(200).send({
                            response_code: "200",
                            response_message: "success.",
                            data: booking,
                            lineitems: items,
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

router.get("/getcompany/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    let department = '';

    if (id == 1) {
        department =  "EXEC Exportcompany_list @LoginUserID = '"+id+"'";
    } else {
        department =  "EXEC Importcompany_list @LoginUserID = '"+id+"'";
    }
    db.sequelize.query(
        "" + department + " ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
        department = "DISTINCT b.containernumber, g.generalType as ContainerType,'996791' as HsnCode, '1' as id, 'TRANSPORTATION CHARGES - ORIGIN' as description, CASE WHEN CAST(GETDATE() AS DATE) <= j.ValidTo THEN j.TransportationCharges ELSE '0' END AS Amount, k.CGST,k.IGST,k.IGST as sgstper,k.IGST as igstper from Export_Bookings a left join EB_ItemDetails b on a.EB_id=b.EB_id left join Client_selling_price c on a.CustomerName=c.ClientName left join Client_selling_price d on b.EmptyContainerPickup=d.EmptyContainerPickup left join Client_selling_price e on b.StuffingLocation =e.StuffingLocation left join Client_selling_price f on a.PortOfDischarge=f.Unloading left join general g on b.ContainerTypes=g.G_key left join Client_selling_price h on b.ContainerTypes=h.ContainerType inner join Client_selling_price j on a.PortOfDischarge=j.Unloading inner join ChargeCode k on 'TRANSPORTATION CHARGES - ORIGIN' =k.ChargeDescription where a.BookingNumber ='" + booking + "'  and j.Status='1' union all select DISTINCT c.containernumber,g.generalType as ContainerType, CASE WHEN e.DaysDifference <= 2 THEN '996791' WHEN e.DaysDifference BETWEEN 3 AND 5 THEN '996791' ELSE '996791' END AS HsnCode, CASE WHEN e.DaysDifference <= 2 THEN '30' WHEN e.DaysDifference BETWEEN 3 AND 5 THEN '31' ELSE '32' END AS id, CASE WHEN e.DaysDifference <= 2 THEN 'HALTING CHARGES CFS / FACTORY - 1 TO 2 DAYS' WHEN e.DaysDifference BETWEEN 3 AND 5 THEN 'HALTING CHARGES CFS / FACTORY - 3 TO 5 DAYS' ELSE 'HALTING CHARGES CFS / FACTORY - ABOVE 5 DAYS' END AS description, CASE WHEN CAST(GETDATE() AS DATE) <= a.ValidTo THEN CASE WHEN e.DaysDifference <= 2 THEN a.HaltingCharges1to2days WHEN e.DaysDifference BETWEEN 3 AND 5 THEN a.HaltingCharges2to5days ELSE a.HaltingChargesabove5days END ELSE '0' END AS Amount, k.CGST,k.IGST,k.IGST as sgstper,k.IGST as igstper from Client_selling_price a inner join Export_Bookings b on a.Unloading=b.PortOfDischarge inner join EB_ItemDetails c on b.EB_id=c.EB_id inner join Client_selling_price d on b.CustomerName=d.ClientName inner join ExportEvents_inOut e on c.containernumber=e.containernumber inner join general g on c.ContainerTypes=g.G_key inner join ChargeCode k on (CASE WHEN e.DaysDifference <= 2 THEN '30' WHEN e.DaysDifference BETWEEN 3 AND 5 THEN '31' ELSE '32' END) = k.Cd_id where b.BookingNumber ='" + booking + "'  and a.Status='1'";
    } else {
        department = "DISTINCT b.containernumber, g.generalType as ContainerType,'996791' as HsnCode, '1' as id, 'TRANSPORTATION CHARGES - ORIGIN' as description, CASE WHEN CAST(GETDATE() AS DATE) <= j.ValidTo THEN j.TransportationCharges ELSE '0' END AS Amount, k.CGST,k.IGST,k.IGST as sgstper,k.IGST as igstper from Import_Bookings a left join IB_ItemDetails b on a.IB_id=b.IB_id left join ImportClient_selling_price c on a.CustomerName=c.ClientName left join ImportClient_selling_price d on b.EmptyReturnAt=d.EmptyContainerPickup left join ImportClient_selling_price e on b.DE_StuffingLocation =e.Unloading left join ImportClient_selling_price f on a.PortOfDischarge=f.Unloading left join general g on b.ContainerTypes=g.G_key left join ImportClient_selling_price h on b.ContainerTypes=h.ContainerType inner join ImportClient_selling_price j on a.PortOfDischarge=j.Unloading inner join ChargeCode k on 'TRANSPORTATION CHARGES - ORIGIN' =k.ChargeDescription where a.BookingNumber ='" + booking + "' and j.Status='1' union all select DISTINCT c.containernumber,g.generalType as ContainerType, CASE WHEN e.DaysDifference <= 2 THEN '996791' WHEN e.DaysDifference BETWEEN 3 AND 5 THEN '996791' ELSE '996791' END AS HsnCode, CASE WHEN e.DaysDifference <= 2 THEN '30' WHEN e.DaysDifference BETWEEN 3 AND 5 THEN '31' ELSE '32' END AS id, CASE WHEN e.DaysDifference <= 2 THEN 'HALTING CHARGES CFS / FACTORY - 1 TO 2 DAYS' WHEN e.DaysDifference BETWEEN 3 AND 5 THEN 'HALTING CHARGES CFS / FACTORY - 3 TO 5 DAYS' ELSE 'HALTING CHARGES CFS / FACTORY - ABOVE 5 DAYS' END AS description, CASE WHEN CAST(GETDATE() AS DATE) <= a.ValidTo THEN CASE WHEN e.DaysDifference <= 2 THEN a.HaltingCharges1to2days WHEN e.DaysDifference BETWEEN 3 AND 5 THEN a.HaltingCharges2to5days ELSE a.HaltingChargesabove5days END ELSE '0' END AS Amount, k.CGST,k.IGST,k.IGST as sgstper,k.IGST as igstper from ImportClient_selling_price a inner join Import_Bookings b on a.Unloading=b.PortOfDischarge inner join IB_ItemDetails c on b.IB_id=c.IB_id inner join ImportClient_selling_price d on b.CustomerName=d.ClientName inner join ImportEvents_inOut e on c.containernumber=e.containernumber inner join general g on c.ContainerTypes=g.G_key inner join ChargeCode k on (CASE WHEN e.DaysDifference <= 2 THEN '30' WHEN e.DaysDifference BETWEEN 3 AND 5 THEN '31' ELSE '32' END) = k.Cd_id where b.BookingNumber ='" + booking + "' and a.Status='1'";
    }
    db.sequelize.query(
        "select " + department + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

router.get("/getstate/:id", verifytoken, function (req, res, next) {
    let id = req.params.id;
    db.sequelize.query("select State from VendorsCompanyDetails where CD_ID=" + id + " group by State", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

router.get("/getbookingnumber/:id/:Dep", verifytoken, function (req, res, next) {
    const id = req.params.id;
    const Dep = req.params.Dep;

    let query = "";

    if (Dep == 1) {
        query = " SELECT DISTINCT BookingNumber, b.VendorName FROM Export_Bookings a LEFT JOIN EB_ItemDetails b ON a.EB_id = b.EB_id WHERE b.VendorName IS NOT NULL AND b.VendorName <>''and  b.VendorName  = '" + id + "'";

    } else {
        query = "SELECT DISTINCT BookingNumber, b.VendorName FROM Import_Bookings a LEFT JOIN IB_ItemDetails b ON a.IB_id = b.IB_id WHERE b.VendorName IS NOT NULL AND b.VendorName <> ''and  b.VendorName  = '" + id + "'";
    }

    db.sequelize.query(query, {
        type: db.Sequelize.QueryTypes.SELECT
    })
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success",
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
//insert
router.post('/apinvoice/insert/:id', verifytoken, async function (req, res, next) {

    let id = req.params.id;
    const jsondata = req.body;
    let statusdata = ""
    
    console.log(jsondata);
    try {
        if (id == 1) {

            statusdata = 1;
        } else {
            statusdata = 0;
        }
      

        const newCompany = await Apinvoices.create({
            Department: jsondata.department,
            VendorName: jsondata.companyId,
            BookingNo: Array.isArray(jsondata.BookingNumber)
                ? jsondata.BookingNumber.join(',')
                : jsondata.BookingNumber,
            InvoiceDate: jsondata.invoice_date,
            InvoiceDueDate: jsondata.dueinvoicedate,
            InvoiceReference: jsondata.invoice_ref,
            SubTotal: jsondata.btmtotal,
            GSTAmount: jsondata.btmgst,
            CGSTAmount: jsondata.btmcgst,
            IGSTAmount: jsondata.btmigst,
            GrandTotal: jsondata.grandtotal,
            Advpayment: jsondata.advpymt,
            Balancedue: jsondata.balancedue,
            Status: statusdata,
            CreatedBy: jsondata.CreatedBy,
        });

        const response = CF.getStandardResponse(201, "ApInvoice created successfully", { id: newCompany.AP_id, invoiceno: newCompany.InvoiceNumber });
        res.status(201).send(response);

    } catch (err) {
        winston.error('postInvoice: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }

});
router.post('/apinvoice/list', verifytoken, async function (req, res, next) {
    const jsondata = req.body;

    console.log(jsondata);
    try {
        for (var i = 0; i < jsondata.length; i++) {

            const newCompany = await Aplineitems.create({
                AP_id: jsondata[i].invoiceID,
                Amount: jsondata[i].Amount,
                SGST: jsondata[i].sgst,
                ContainerNo: jsondata[i].containerno,
                ContainerType: jsondata[i].container,
                ChargeCode: jsondata[i].chargedes,
                CGST: jsondata[i].cgst,
                IGST: jsondata[i].igst,
                HSNCode: jsondata[i].hsncode,
                Description: jsondata[i].description,
                Igstper: jsondata[i].igstper,
                Gstper: jsondata[i].sgstper,
                Currency: jsondata[i].curre,
            });
        }
        const response = CF.getStandardResponse(201, "ApInvoice created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postInvoice: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
//update
router.put('/update/:id/:post', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const postdata = req.params.post;
    const jsondata = req.body;


    const formatDateForDB = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
        }
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };
    const invoiceDate = formatDateForDB(jsondata.invoice_date);
    const dueInvoiceDate = formatDateForDB(jsondata.dueinvoicedate);
    try {
        let statusdata = ""
        if (postdata == 1) {
            statusdata = 1;
        } else {
            statusdata = 0;
        }

        const [affectedRows, updatedinvoice] = await Apinvoices.update(
            {
                Department: jsondata.department,
                VendorName: jsondata.companyId,
               // BookingNo: jsondata.BookingNumber,
                BookingNo: Array.isArray(jsondata.BookingNumber)
                ? jsondata.BookingNumber.join(',')
                : jsondata.BookingNumber,
                InvoiceDate: invoiceDate,
                InvoiceDueDate: dueInvoiceDate,
                InvoiceReference: jsondata.invoice_ref,
                SubTotal: jsondata.btmtotal,
                GSTAmount: jsondata.btmgst,
                CGSTAmount: jsondata.btmcgst,
                IGSTAmount: jsondata.btmigst,
                GrandTotal: jsondata.grandtotal,
                Advpayment: jsondata.advpymt,
                Balancedue: jsondata.balancedue,
                Status: statusdata
            },
            {
                where: { AP_id: id },
                returning: true,
                plain: true
            }
        );
        if (updatedinvoice.dataValues.InvoiceNumber) {
            console.log(updatedinvoice.dataValues.InvoiceNumber);
        } else {
            console.log("Invoice update failed or no records were updated.");
        }
        const response = CF.getStandardResponse(201, "ApInvoice Update successfully", { id: updatedinvoice.dataValues.I_id, invoiceno: updatedinvoice.dataValues.InvoiceNumber });
        res.status(201).send(response);

    } catch (err) {
        winston.error('putinvoice: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.put('/listupdate/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    console.log(jsondata);
    try {
        await db.sequelize.query(
            "DELETE FROM ApLine_itemDetails WHERE AP_id = :id",
            {
                replacements: { id: id },
                type: db.Sequelize.QueryTypes.DELETE
            }
        );

        for (let i = 0; i < jsondata.length; i++) {


            const newCompany = await Aplineitems.create({
                AP_id: id,
                Amount: jsondata[i].Amount,
                SGST: jsondata[i].sgst,
                ContainerNo: jsondata[i].containerno,
                ContainerType: jsondata[i].container,
                ChargeCode: jsondata[i].chargedes,
                CGST: jsondata[i].cgst,
                IGST: jsondata[i].igst,
                HSNCode: jsondata[i].hsncode,
                Description: jsondata[i].description,
                Igstper: jsondata[i].igstper,
                Gstper: jsondata[i].sgstper,
                 Currency: jsondata[i].curre
            });
        }

        const response = CF.getStandardResponse(201, "ApInvoice updated successfully");
        res.status(201).send(response);

        winston.info("Invoice and associated items updated successfully.");
    } catch (err) {
        winston.error('putitems: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
module.exports = router;