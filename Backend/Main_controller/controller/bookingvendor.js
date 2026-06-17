const express = require('express');
const { parseISO } = require('date-fns');
const router = express.Router();
const db = require('../../config/dbconnection');

const sequelize = db.sequelize;
const EBvendor = db.EBvendor;
const EBitems = db.EBitems;

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

router.get("/gridvalues/:id", function(req, res, next) {
    const id = req.params.id;

    db.sequelize.query(
            "select * from Export_Bookings where EB_id='"+id+"' ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((Booking) => {
            if (!Booking) {
                winston.error("/getbooking" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            } else {
                db.sequelize.query(
                    "select * from EB_ItemDetails where EB_id=" + id + " ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
                )
                .then((items) => {
                    console.log(items);
                    res.status(200).send({
                        response_code: "200",
                        response_message: "success.",
                        data: Booking,
                        lineitems: items,
                    });
                    winston.info("Booking Vendor details");
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

router.put("/expitems/:id", async function (req, res) {
    const id = req.params.id;
    const bookingData = req.body.booking;      // Object for Export_Bookings
    const itemDetails = req.body.itemDetails;  // Array of EB_ItemDetails

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
        await EBvendor.update(bookingData, {
            where: { EB_id: id },
            transaction: t
        });

        // 2. Delete existing EB_ItemDetails for this booking
        await EBitems.destroy({
            where: { EB_id: id },
            transaction: t
        });

        // 3. Prepare and insert new EB_ItemDetails
        const newItems = itemDetails.map(item => ({
            ...item,
            EB_id: id
        }));

        await EBitems.bulkCreate(newItems, { transaction: t });

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