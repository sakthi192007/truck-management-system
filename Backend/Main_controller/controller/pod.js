const express = require("express");
const router = express.Router();
const winston = require("winston");
const db = require("../../config/dbconnection");
const CF = require("../../middlewares/commonfunction");
const PodDocument = db.poddocumentation;
const verifytoken = require('../../middlewares/verifytoken');
const logger = require("../../middlewares/logger");    

function normalizeParams(params) {
  const cleaned = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === "" || value === undefined) {
      cleaned[key] = null;
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

router.post("/:id", async function (req, res) {
  try {
    const id = req.params.id;
    let params = req.body;
    params = normalizeParams(params);
 console.log(params);
    const newPod = await PodDocument.create({
      BookingNo: params.BookingNo,
      Consignmentnoteno: params.Consignmentnoteno,
      Sealno: params.Sealno,
      ShipmentType: params.ShipmentType,
      ConsignmentDate: params.ConsignmentDate,
      PoliceNo: params.PoliceNo,
      Amount: params.Amount,
      Date: params.Date,
      Risk: params.Risk,
      ConsignornameAdd: params.ConsignornameAdd,
      ConsigneenameAdd: params.ConsigneenameAdd,
      FromAdd: params.FromAdd,
      ToAdd: params.ToAdd,
      Containerno: params.Containerno,
      Driverno: params.Driverno,
      Noofpkgspallets: params.Noofpkgspallets,
      CustomerinvoiceNo: params.CustomerinvoiceNo,
      Customerinvoice: params.Customerinvoice,
      Natureofgoods: params.Natureofgoods,
      WeightGross: params.WeightGross,
      WeightChargeable: params.WeightChargeable,
      FreightPaid: params.FreightPaid,
      FreightToPay: params.FreightToPay,
      SurchargePaid: params.SurchargePaid,
      SurchargeToPay: params.SurchargeToPay,
      CpchPaid: params.CpchPaid,
      CpchToPay: params.CpchToPay,
      StchPaid: params.StchPaid,
      StchToPay: params.StchToPay,
      HAMALIchPaid: params.HAMALIchPaid,
      HAMALIchToPay: params.HAMALIchToPay,
      RiskrsPaid: params.RiskrsPaid,
      RiskrsToPay: params.RiskrsToPay,
      ServicechPaid: params.ServicechPaid,
      ServicechToPay: params.ServicechToPay,
      GrandTotalPaid: params.GrandTotalPaid,
      GrandTotalToPay: params.GrandTotalToPay,
      FreightTopayorPaid: params.FreightTopayorPaid,
      Valuers: params.Valuers,
      Privatemark: params.Privatemark,
      Remarks: params.Remarks,
      pdf_url: params.pdf_url,
      Ml_CreatedBy: id,
    });

    logger.info("Pod inserted successfully. ID: " + newPod.LR_id);

    return res.status(201).json({
      status: 201,
      message: "PodDocument created successfully.",
      id: newPod.LR_id
    });
  } catch (err) {
    logger.error("Error in /pod POST: " + err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong.",
      error: err.message
    });
  }
});



router.get("/getall/:id", verifytoken, async function (req, res, next) {
  try {
    const id = req.params.id;
    // 1️⃣ Fetch from Export_Bookings + LR_Copy
    const exportData = await db.sequelize.query(
     "EXEC LR_Copy_Grid @LoginUserID = '"+id+"'",
      { type: db.Sequelize.QueryTypes.SELECT }
    );
    // 4️⃣ Send response
    res.status(200).send({
      response_code: "200",
      response_message: "success.",
      data: exportData,
    });

    winston.info("POD Grid fetched successfully");
  } catch (error) {
    console.error("Error fetching POD grid:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

router.get("/getalls/Bookings/:id", verifytoken, function (req, res, next) {
   const id = req.params.id;
    db.sequelize.query(" EXEC LR_Copy_Bookinglist @LoginUserID = '"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("POD");
        })
        .catch(error => {
            console.error("Error fetching POD:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/booking/:bookingNumber", verifytoken, async function (req, res) {
  const bookingNumber = req.params.bookingNumber;

  try {
    // 1️⃣ Try Export_Bookings
    const exportData = await db.sequelize.query(
      `SELECT TOP 1 
          ebi.containernumber AS Containerno, 
          ebi.SealNumber AS Sealno, 
          ebi.Vehicleno AS PoliceNo
       FROM Export_Bookings eb
       JOIN EB_ItemDetails ebi ON eb.EB_id = ebi.EB_id
       WHERE eb.BookingNumber = :bookingNumber`,
      {
        replacements: { bookingNumber },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (exportData.length > 0) {
      return res.status(200).send({
        response_code: "200",
        response_message: "success",
        data: exportData[0],
      });
    }

    // 2️⃣ Try Import_Bookings
    const importData = await db.sequelize.query(
      `SELECT TOP 1 
          ibi.containernumber AS Containerno, 
          ibi.SealNumber AS Sealno, 
          ibi.Vehicleno AS PoliceNo
       FROM Import_Bookings ib
       JOIN IB_ItemDetails ibi ON ib.IB_id = ibi.IB_id
       WHERE ib.BookingNumber = :bookingNumber`,
      {
        replacements: { bookingNumber },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (importData.length > 0) {
      return res.status(200).send({
        response_code: "200",
        response_message: "success",
        data: importData[0],
      });
    }

    // 3️⃣ Not found
    return res.status(404).send({
      response_code: "404",
      response_message: "Booking not found",
    });

  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error",
    });
  }
});





module.exports = router;
