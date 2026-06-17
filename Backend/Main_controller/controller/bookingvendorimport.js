const express = require('express');
const { parseISO } = require('date-fns');
const router = express.Router();
const db = require('../../config/dbconnection');

const sequelize = db.sequelize;
const IBvendor = db.IBvendor;
const IBitems = db.IBitems;
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
var upload = multer({ storage: storage }).single('file');

router.get("/bookingimport/:id", function(req, res, next) {
    const id = req.params.id;

    db.sequelize.query(
            "select * from Import_Bookings where IB_id='"+id+"' ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((Booking) => {
            if (!Booking) {
                winston.error("/getbooking" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            } else {
                db.sequelize.query(
                    "select * from IB_ItemDetails where IB_id=" + id + " ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
                )
                .then((items) => {
                    console.log(items);
                    res.status(200).send({
                        response_code: "200",
                        response_message: "success.",
                        data: Booking,
                        lineitems: items,
                    });
                    winston.info("Booking Vendor import details");
        })
    }
})
        .catch(error => {
            console.error("Error fetching User details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.put("/impitems/:id", async function (req, res) {
    const id = req.params.id;
    const bookingData = req.body.booking;      // Object for Export_Bookings
    const itemDetails = req.body.itemDetails;  // Array of IB_ItemDetails

    // Validate input
    if (!bookingData || !Array.isArray(itemDetails)) {
        return res.status(400).send({
            response_code: "400",
            response_message: "Invalid request body. 'booking' must be an object and 'itemDetails' must be an array."
        });
    }

    const t = await db.sequelize.transaction();

    try {
        // 1. Update Export_Bookings
        await IBvendor.update(bookingData, {
            where: { IB_id: id },
            transaction: t
        });

        // 2. Delete existing IB_ItemDetails for this booking
        await IBitems.destroy({
            where: { IB_id: id },
            transaction: t
        });

        // 3. Prepare and insert new IB_ItemDetails
        const newItems = itemDetails.map(item => ({
            ...item,
            IB_id: id
        }));

        await IBitems.bulkCreate(newItems, { transaction: t });

        // 4. Commit transaction
        await t.commit();

        return res.status(200).send({
            response_code: "200",
            response_message: "Booking and item details updated successfully"
        });

    } catch (error) {
        // Rollback if needed
        if (t.finished !== 'commit') {
            try {
                await t.rollback();
            } catch (rollbackErr) {
                console.error("Transaction rollback failed:", rollbackErr);
            }
        }

        console.error("Error in PUT /expitems/:id:", error);
        return res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error",
            error: error.message
        });
    }
});
module.exports = router;