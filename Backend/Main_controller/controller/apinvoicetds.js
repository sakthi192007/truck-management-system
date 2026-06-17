const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const APInvoicetds = db.APInvoicetds;
const ApinvoicetdsItems = db.ApinvoicetdsItems
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
router.get("/getvendordata/:id", verifytoken, function (req, res, next) {
const id = req.params.id;
    db.sequelize.query(
         "EXEC APcustomer_list @LoginUserID = '"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getbookingnumber/:id/", verifytoken, function (req, res, next) {
    const id = req.params.id;


    db.sequelize.query(
        "select InvoiceReference from Apinvoices where VendorName=" + id + "  group by InvoiceReference ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
//insert
router.post('/', verifytoken, async function (req, res, next) {

    const jsondata = req.body;

    console.log(jsondata);
    try {
        const newCompany = await APInvoicetds.create({
           ClientName: jsondata.company.CD_ID,
            InvoiceNumber: jsondata.invoiceno.InvoiceReference,
            InvoiceDate: jsondata.invoicedate,
            SubTotal: jsondata.SubTotal,
            GST: jsondata.gst,
            GrandTotal: jsondata.grandtotal,
            Percentage: jsondata.Percentnumber,
            Amount: jsondata.Amounts,
            Type: jsondata.type.TypeId,
            TDS: jsondata.netdue,
            Payment: jsondata.payments,
            Balanceamount: jsondata.balancedueAmount,
             Userid: jsondata.UserID
           
           
        });


        const response = CF.getStandardResponse(201, "Payment entry created successfully", { id: newCompany.AE_id });
        res.status(201).send(response);

    } catch (err) {
        winston.error('postClientPrices: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }

});

router.post('/invoicetds/list', verifytoken, async function (req, res, next) {
    const jsondata = req.body;

    console.log(jsondata);
    try {
        for (var i = 0; i < jsondata.length; i++) {

            const newCompany = await ApinvoicetdsItems.create({
                AE_id: jsondata[i].invoiceID,
                Paymenttransactionno: jsondata[i].refno,
                Paymentamount: jsondata[i].payment,
                 Paymentdate:jsondata[i].paydate,
            });
        }
        const response = CF.getStandardResponse(201, "Invoice created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postInvoice: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
//update
router.put('/update/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
console.log(jsondata);
    if (!id) {
        return res.status(400).json({ message: "Invalid ID for update" });
    }

    try {
        const updatedCompanyData = {
             ClientName: jsondata.company.CD_ID,
            InvoiceNumber: jsondata.invoiceno.InvoiceReference,
            InvoiceDate: jsondata.invoicedate,
            SubTotal: jsondata.SubTotal,
            GST: jsondata.gst,
            GrandTotal: jsondata.grandtotal,
            Percentage: jsondata.Percentnumber,
            Amount: jsondata.Amounts,
            Type: jsondata.type.TypeId,
            TDS: jsondata.netdue,
            Payment: jsondata.payments,
            Balanceamount: jsondata.balancedueAmount,
        };

        const updatedCompany = await APInvoicetds.update(updatedCompanyData, {
            where: { AE_id: id }
        });

        console.log('Payment entry updated successfully:', updatedCompany);
        res.status(200).json({ message: 'Payment entry updated successfully' });
    } catch (err) {
        console.error('Error updating Payment entry:', err);
        winston.error('updateentrypayment: ' + err);
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
            "DELETE FROM APPaymentlineitems WHERE AE_id = :id",
            {
                replacements: { id: id },
                type: db.Sequelize.QueryTypes.DELETE
            }
        );

        for (let i = 0; i < jsondata.length; i++) {


            const newCompany = await ApinvoicetdsItems.create({
                // AEL_id: id,
                AE_id: id,
                Paymenttransactionno: jsondata[i].refno,
                Paymentamount: jsondata[i].payment,
                Paymentdate:jsondata[i].paydate,
            });
        }

        const response = CF.getStandardResponse(201, " Payment entry updated successfully");
        res.status(201).send(response);

        winston.info("Payment entry and associated items updated successfully.");
    } catch (err) {
        winston.error('putitems: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

router.get('/invoices/:id/', verifytoken, (req, res) => {
    const id = req.params.id;

    const query = `
    SELECT InvoiceReference,SUM(SubTotal) as SubTotal, SUM(COALESCE(GSTAmount, 0) + COALESCE(CGSTAmount, 0) + COALESCE(IGSTAmount, 0)) AS GST, SUM(GrandTotal) AS GrandTotal FROM Apinvoices WHERE InvoiceReference = :id GROUP BY InvoiceReference`;

    db.sequelize.query(query, {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
    })
        .then(results => {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ message: 'Invoice not found' });
            }
        })
        .catch(error => {
            console.error('Error fetching invoice details:', error);
            res.status(500).json({ error: 'Database query error' });
        });
});

//grid
router.get("/paymentgrid/:id/:role", verifytoken, function (req, res, next) {
      const id = req.params.id;
    const role = req.params.role;
 
  
      db.sequelize.query(
           "EXEC APPaymentEntry_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getupdate/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
        "select * from APPaymententry where AE_id=" + id + "  ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((booking) => {
            if (!booking) {
                winston.error("/getInvoicedetails" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            } else {
                db.sequelize.query(
                    "select * from APPaymentlineitems where AE_id=" + id + " ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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


module.exports = router;