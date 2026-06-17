const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const EB_ItemDetails = db.EB_ItemDetails;

router.put('/updateitem/:id', async (req, res) => {
  const LItem_id = req.params.id;
  const updateData = req.body;  

  if (!LItem_id) {
    return res.status(400).json({
      status: 400,
      message: "LItem_id is required in URL",
      data: null
    });
  }

  if (!updateData || typeof updateData !== 'object' || Array.isArray(updateData)) {
    return res.status(400).json({
      status: 400,
      message: "Request body must be a JSON object with fields to update",
      data: null
    });
  }

  const allowedNonIntegers = ['SealNumber', 'containernumber', 'WeightTypes', 'Vehicleno'];
  const allowedKeys = [...allowedNonIntegers, 'CargoWeight', 'ContainerTypes'];

  // Validate fields
  for (const key of Object.keys(updateData)) {
    if (!allowedKeys.includes(key)) {
      return res.status(400).json({
        status: 400,
        message: `Invalid field '${key}' in update data`,
        data: null
      });
    }

    if (allowedNonIntegers.includes(key)) {
      if (typeof updateData[key] !== 'string') {
        return res.status(400).json({
          status: 400,
          message: `Field '${key}' must be a string`,
          data: null
        });
      }
    } else {
      const numValue = Number(updateData[key]);
      if (isNaN(numValue)) {
        return res.status(400).json({
          status: 400,
          message: `Field '${key}' must be a valid number`,
          data: null
        });
      }
      updateData[key] = numValue; // ensure number type
    }
  }

  try {
    // Update all records with matching LItem_id
    const [affectedCount] = await db.EB_ItemDetails.update(updateData, {
      where: { LItem_id }
    });

    if (affectedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: `No records found with LItem_id=${LItem_id}`,
        data: null
      });
    }

    // Fetch updated records to return
    const updatedRecords = await db.EB_ItemDetails.findAll({
      where: { LItem_id }
    });

    return res.status(200).json({
      status: 200,
      message: `item(s) updated successfully`,
      data: updatedRecords
    });

  } catch (error) {
    console.error("Error updating EB items:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      data: null
    });
  }
});


module.exports = router;
