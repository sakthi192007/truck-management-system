const express = require('express');
const { parseISO } = require('date-fns');
const router = express.Router();
const db = require('../../config/dbconnection');
const sequelize = db.sequelize;
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const { storage } = require('../../middlewares/storage');
const { Console } = require("console");
const { DateTime } = require('mssql');
const { json } = require('body-parser');

router.get("/gstgrid/:id", verifytoken, async function (req, res, next) {
 const id = req.params.id;
    try {
        const query1 = "EXEC GstInvoice_Grid @LoginUserID='"+id+"'";

        const query2 = "EXEC GstInvoiceTotal_Grid @LoginUserID='"+id+"'";


        const [result1, result2] = await Promise.all([
            db.sequelize.query(query1, { type: db.Sequelize.QueryTypes.SELECT }),
            db.sequelize.query(query2, { type: db.Sequelize.QueryTypes.SELECT })
        ]);

        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data: result1,
            invoiceSummary: result2
        });

        winston.info("gstinvoicegrid with two queries");
    } catch (error) {
        console.error("Error fetching gstinvoicegrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    }

});
router.get("/tdsgrid/:id", verifytoken, function(req, res, next) {
     const id = req.params.id;
    db.sequelize.query(
        "EXEC TDS_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("tdsreportgrid");
    })
    .catch(error => {
        console.error("Error fetching tdsreportgrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });

});
router.get("/exportreportgrid/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    db.sequelize.query(

           "EXEC PE_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("exportreportgrid");
    })
    .catch(error => {
        console.error("Error fetching exportreportgrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get("/importreportgrid/:id", verifytoken, function(req, res, next) {
     const id = req.params.id;
    db.sequelize.query(
         "EXEC IPR_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("importreportgrid");
    })
    .catch(error => {
        console.error("Error fetching importreportgrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });

});
router.get("/monthlygrid/:id", verifytoken, function(req, res, next) {
     const id = req.params.id;
    db.sequelize.query(
         "EXEC monthlyExport_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("monthlygrid");
    })
    .catch(error => {
        console.error("Error fetching monthlygrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get("/monthlygridimport/:id", verifytoken, function(req, res, next) {
     const id = req.params.id;
    db.sequelize.query(
       "EXEC monthlyImport_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("monthlygridimport");
    })
    .catch(error => {
        console.error("Error fetching monthlygridimport details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get("/invoicegrid/:id", verifytoken, async function (req, res, next) {
     const id = req.params.id;
    try {
        const query1 = "EXEC invoiceExport_Grid @LoginUserID='"+id+"'";

        const query2 = "EXEC invoiceTotalExport_Grid @LoginUserID='"+id+"'";

        
        const [result1, result2] = await Promise.all([
            db.sequelize.query(query1, { type: db.Sequelize.QueryTypes.SELECT }),
            db.sequelize.query(query2, { type: db.Sequelize.QueryTypes.SELECT })
        ]);

        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            invoiceGrid: result1,
            invoiceSummary: result2
        });

        winston.info("invoicegrid with two queries");
    } catch (error) {
        console.error("Error fetching invoicegrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    }
});
router.get("/invoicegridimp/:id", verifytoken, async function (req, res, next) {
     const id = req.params.id;
    try {
        
        const query1 = "EXEC invoiceImport_Grid @LoginUserID='"+id+"'";

        const query2 = "EXEC invoiceTotalImport_Grid @LoginUserID='"+id+"'";


        const [result1, result2] = await Promise.all([
            db.sequelize.query(query1, { type: db.Sequelize.QueryTypes.SELECT }),
            db.sequelize.query(query2, { type: db.Sequelize.QueryTypes.SELECT })
        ]);

        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data: result1,
            invoiceSummary: result2
        });

        winston.info("invoicegrid with two queries");
    } catch (error) {
        console.error("Error fetching invoicegrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    }
});
router.get("/vendorreportgrid/:id", verifytoken, function(req, res, next) {
     const id = req.params.id;
    db.sequelize.query(
        "EXEC VendorExport_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("vendorreportgrid");
    })
    .catch(error => {
        console.error("Error fetching vendorreportgrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });

});

router.get("/vendorreportimportgrid/:id", verifytoken, function(req, res, next) {
     const id = req.params.id;
    db.sequelize.query(
        "EXEC VendorImport_Grid @LoginUserID='"+id+"'",{ replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("vendorreportimportgrid");
    })
    .catch(error => {
        console.error("Error fetching vendorreportimportgrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });

});


module.exports = router;