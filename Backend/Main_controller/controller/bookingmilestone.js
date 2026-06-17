const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const Milestonedetails = db.Milestonedetails;
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');

router.post('/milestonedetails', async function (req, res) {
    const jsondata = req.body;
    const milestone = await Milestonedetails.bulkCreate(jsondata)
        .then((data) => {
            const response = CF.getStandardResponse(201, "Milestone export details created successfully", data);
            res.status(201).send(response);
          })
          .catch(error => {
            winston.error('Milestoneexportdetails Error: ' + error);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
          })
});

router.get("/mileexppget/:id", function(req, res) {
  var id = req.params.id;
  db.sequelize.query(
          "select * from ExportMilestonesStatusList where containerNumber='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
      )
      .then((data) => {
          res.status(200).send({
              response_code: "200",
              response_message: "success.",
              data,
          });
          winston.info("Export Milestone");
      })
      .catch(error => {
          console.error("Error fetching Export Milestone:", error);
          res.status(500).send({
              response_code: "500",
              response_message: "Internal Server Error"
          });
      });
});

router.put('/expitems/:id', async function(req, res, next) {
  const id = req.params.id;
  const jsondata = req.body;

  try {
    // Delete existing records for the container number
    await db.sequelize.query(
        "DELETE FROM ExportMilestonesStatusList WHERE containerNumber = :id",
        { 
            replacements: { id: id }, 
            type: db.Sequelize.QueryTypes.DELETE 
        }
    );

    // Check if eventdata is valid
    if (!jsondata || !Array.isArray(jsondata)) {
        const response = CF.getStandardResponse(400, "Invalid eventdata");
        return res.status(400).send(response);
    }

    // Bulk insert data into the ImportMilestonesStatusList table
    await Milestonedetails.bulkCreate(jsondata);

    // Respond with success message
    const response = CF.getStandardResponse(200, "Export Milestones updated successfully");
    return res.status(200).send(response);

  } catch (err) {
    // Log error and send response
    winston.error('Export milestone: ' + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

module.exports = router;