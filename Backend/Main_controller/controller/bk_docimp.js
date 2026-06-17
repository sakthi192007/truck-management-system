const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const winston = require('../../middlewares/logger');
const CF = require('../../middlewares/commonfunction');
const fs = require('fs/promises');
const fsSync = require('fs'); 
const path = require('path');
const verifytoken = require('../../middlewares/verifytoken');


router.put('/update/:id',verifytoken,async function (req, res, next) {
  const uploadedFile = req.files;
   const IB_id = req.params.id;
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
  if (!IB_id) {
    return res
      .status(400)
      .send(CF.getStandardResponse(400, "Missing  Import Booking ID."));
  }

  try {
    const fileMappings = [
      {
        key: "bilfle",
        name: `bil_${formattedDate}_${uploadedFile?.bilfle?.name}`,
        table: "IB_BillofEntryFiles",
        column: "BillOfEntry",
      },
      {
        key: "confle",
        name: `con_${formattedDate}_${uploadedFile?.confle?.name}`,
        table: "IB_ContainerFiles",
        column: "Containerphoto",
      },
      {
        key: "empfle",
        name: `emp_${formattedDate}_${uploadedFile?.empfle?.name}`,
        table: "IB_EmptyreturnFiles",
        column: "Emptyreturncopy",
      },
      {
        key: "Pod",
        name: `pod_${formattedDate}_${uploadedFile?.Pod?.name}`,
        table: "IB_PODFiles",
        column: "Pod",
      },
      {
        key: "crofle",
        name: `cro_${formattedDate}_${uploadedFile?.crofle?.name}`,
        table: "IB_Files",
        column: "DeliveryOrder",
      },
    ];

    const saveFile = (file, fileName) => {
      const destination = `./public/booking/Import/${fileName}`;
      fs.writeFile(destination, file.data, function (err) {
        if (err) {
          console.error(err);
        }
      });
    };

    for (let mapping of fileMappings) {
      const file = uploadedFile?.[mapping.key];
      if (file) {
        const sqlInsert = `INSERT INTO ${mapping.table} (IB_id, ${mapping.column}) VALUES (?, ?);`;
        await db.sequelize.query(sqlInsert, {
          replacements: [IB_id, mapping.name],
          type: db.sequelize.QueryTypes.INSERT,
        });
        saveFile(file, mapping.name);
      }
    }

    const response = CF.getStandardResponse(201, "Files uploaded successfully");
    res.status(201).send(response);
  } catch (err) {
    winston.error("postbooking Exportfiles: " + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});


  router.get("/Import", function(req, res, next) {
  
      db.sequelize.query(
              "select * from Import_DOC_FileName", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
          )
          .then((data) => {
              res.status(200).send({
                  response_code: "200",
                  response_message: "success.",
                  data,
              });
              winston.info("Import FileName");
          })
          .catch(error => {
              console.error("Error fetching Import FileName:", error);
              res.status(500).send({
                  response_code: "500",
                  response_message: "Internal Server Error"
              });
          });
  });

  router.post("/Importfiles",verifytoken, async function (req, res, next) {
  const uploadedFile = req.files;
  const jsondata = req.body;

  console.log(uploadedFile);

  const formattedDate = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[-T:]/g, "");
  const IB_id = jsondata.Importbookingkey;

  if (!IB_id) {
    return res
      .status(400)
      .send(CF.getStandardResponse(400, "Missing  Import Booking ID."));
  }

  try {
    const fileMappings = [
      {
        key: "bilfle",
        name: `bil_${formattedDate}_${uploadedFile?.bilfle?.name}`,
        table: "IB_BillofEntryFiles",
        column: "BillOfEntry",
      },
      {
        key: "confle",
        name: `con_${formattedDate}_${uploadedFile?.confle?.name}`,
        table: "IB_ContainerFiles",
        column: "Containerphoto",
      },
      {
        key: "empfle",
        name: `emp_${formattedDate}_${uploadedFile?.empfle?.name}`,
        table: "IB_EmptyreturnFiles",
        column: "Emptyreturncopy",
      },
      {
        key: "Pod",
        name: `pod_${formattedDate}_${uploadedFile?.Pod?.name}`,
        table: "IB_PODFiles",
        column: "Pod",
      },
      {
        key: "crofle",
        name: `cro_${formattedDate}_${uploadedFile?.crofle?.name}`,
        table: "IB_Files",
        column: "DeliveryOrder",
      },
    ];

    const saveFile = (file, fileName) => {
      const destination = `./public/booking/Import/${fileName}`;
      fs.writeFile(destination, file.data, function (err) {
        if (err) {
          console.error(err);
        }
      });
    };

    for (let mapping of fileMappings) {
      const file = uploadedFile?.[mapping.key];
      if (file) {
        const sqlInsert = `INSERT INTO ${mapping.table} (IB_id, ${mapping.column}) VALUES (?, ?);`;
        await db.sequelize.query(sqlInsert, {
          replacements: [IB_id, mapping.name],
          type: db.sequelize.QueryTypes.INSERT,
        });
        saveFile(file, mapping.name);
      }
    }

    const response = CF.getStandardResponse(201, "Files uploaded successfully");
    res.status(201).send(response);
  } catch (err) {
    winston.error("postbooking Exportfiles: " + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

module.exports = router;
