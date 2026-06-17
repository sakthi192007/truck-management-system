const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const winston = require('../../middlewares/logger');
const CF = require('../../middlewares/commonfunction');
const fs = require('fs/promises');
const fsSync = require('fs'); 
const path = require('path');

const verifytoken = require('../../middlewares/verifytoken');
router.post('/Exportfiles',verifytoken, async function (req, res, next) {
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
router.delete('/deleteContainerFile/:id', verifytoken, async (req, res) => {
  const { id } = req.params;
  console.log("🟢 DELETE API CALLED - ID:", id);

  try {
    // Find the file record by CF_id
    const fileRecord = await db.EB_ContainerFiles.findOne({ where: { CF_id: id } });
    console.log("📄 File Record:", fileRecord ? fileRecord.dataValues : "Not found");

    if (!fileRecord) {
      console.warn("⚠️ File not found for ID:", id);
      return res.status(404).send({ response_code: "404", response_message: "File not found" });
    }

    // Delete the physical file
    if (fileRecord.ContainerCopy) {
      const filePath = path.join(__dirname, '../../public/booking/Export', fileRecord.ContainerCopy);
      console.log("🗂 File path to delete:", filePath);

      if (fsSync.existsSync(filePath)) {
        fsSync.unlinkSync(filePath);
        console.log("✅ File deleted from server:", filePath);
      } else {
        console.warn("⚠️ File path not found on server:", filePath);
      }
    } else {
      console.warn("⚠️ No ContainerCopy path in record for ID:", id);
    }

    // Delete DB record
    const deleteCount = await db.EB_ContainerFiles.destroy({ where: { CF_id: id } });
    console.log("🗑 DB Delete Count:", deleteCount);

    return res.status(200).send({
      response_code: "200",
      response_message: "File deleted successfully"
    });

  } catch (error) {
    console.error("❌ Error deleting container file:", error);
    return res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

module.exports = router;
