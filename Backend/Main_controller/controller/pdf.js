const express = require("express");
const router = express.Router();
const winston = require("winston");
const { generatePdf } = require("./pdf.controller"); // same folder
const db = require('../../config/dbconnection');

router.post("/generate-pdf", generatePdf);

router.get("/getall/:id", function (req, res) {
    const Booking=req.params.id;
  const query = "select pdf_url as pdf from LR_Copy where LR_id='"+Booking+"'";

  db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT })
    .then(data => {
      res.status(200).send({
        response_code: "200",
        response_message: "Success",
        data
      });
      winston.info("Invoice details fetched successfully");
    })
    .catch(error => {
      console.error("Error fetching Invoice details:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error"
      });
    });
});

module.exports = router;
