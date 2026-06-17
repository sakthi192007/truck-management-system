const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const CF = require('../../middlewares/commonfunction');
const fs = require('fs');
const path = require('path');


//post API



router.post('/Exportfile', async function (req, res, next) {
    const uploadedFile = req.files;
    const jsondata = req.body;

    const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
    const EB_id = jsondata.BookingId;

    if (!EB_id) {
        return res.status(400).send(CF.getStandardResponse(400, "Missing Booking ID."));
    }

    try {
        
        const fileMappings = [
            { key: 'crofle', name: `cro_${formattedDate}_${uploadedFile?.crofle?.name}`, table: 'EB_Files', column: 'CRO' },
            { key: 'from13', name: `from13_${formattedDate}_${uploadedFile?.from13?.name}`, table: 'EB_Form13Files', column: 'Form13' },
            { key: 'containerfile', name: `containerfile_${formattedDate}_${uploadedFile?.containerfile?.name}`, table: 'EB_ContainerFiles', column: 'ContainerCopy' },
            { key: 'shipfile', name: `shipfile_${formattedDate}_${uploadedFile?.shipfile?.name}`, table: 'EB_ShippingFiles', column: 'ShippingBillcopy' },
            { key: 'eirfiles', name: `eirfiles_${formattedDate}_${uploadedFile?.eirfiles?.name}`, table: 'EB_EIRFiles', column: 'EIRCopy' },
            { key: 'sealfiles', name: `sealfiles_${formattedDate}_${uploadedFile?.sealfiles?.name}`, table: 'EB_SealFiles', column: 'SealCopy' },
            { key: 'weighmentfiles', name: `weighmentfiles_${formattedDate}_${uploadedFile?.weighmentfiles?.name}`, table: 'EB_WeighmentFiles', column: 'Weighmentphoto'}
        ];

        const saveFile = (file, fileName) => {
            const destination = `./public/booking/Export/${fileName}`;
            fs.writeFile(destination, file.data, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        };

        for (let mapping of fileMappings) {
            const file = uploadedFile?.[mapping.key];
            if (file) {
                const sqlInsert = `INSERT INTO ${mapping.table} (EB_id, ${mapping.column}) VALUES (?, ?);`;
                await db.sequelize.query(sqlInsert, {
                    replacements: [EB_id, mapping.name],
                    type: db.sequelize.QueryTypes.INSERT,
                });
                saveFile(file, mapping.name);
            }
        }

        const response = CF.getStandardResponse(201, "Files uploaded successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postbooking Exportfiles: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
  router.post("/Importfile", async function (req, res, next) {
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
      const destination = path.join(__dirname, './public/booking/Import/', fileName);
      fs.writeFile(destination, file.data, (err) => {
        if (err) console.error('Error saving file:', err);
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