const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const IB_ItemDetails = db.IB_ItemDetails;

router.put('/updateitems/:id', async (req, res) => {
  try {
    const LineItem_id = req.params.id;
    const updateData = req.body;

    if (!LineItem_id) {
      return res.status(400).json({
        status: 400,
        message: "LineItem_id is required in URL",
        data: null
      });
    }

    // Allowed keys and which should be treated as strings (no numeric conversion)
    const allowedNonIntegers = ['SealNumber', 'containernumber', 'WeightTypes', 'Vehicleno'];
    const allowedKeys = [...allowedNonIntegers, 'CargoWeight', 'ContainerTypes'];

    // Validate keys and values
    for (const key of Object.keys(updateData)) {
      if (!allowedKeys.includes(key)) {
        return res.status(400).json({
          status: 400,
          message: `Invalid field '${key}' in update data.`,
          data: null
        });
      }

      const value = updateData[key];

      if (allowedNonIntegers.includes(key)) {
        // These can be any string (optional: add more validation if needed)
        if (typeof value !== 'string') {
          return res.status(400).json({
            status: 400,
            message: `Field '${key}' must be a string.`,
            data: null
          });
        }
      } else {
        // For numeric fields, value must be convertible to number
        if (value === '' || value === null || isNaN(value)) {
          return res.status(400).json({
            status: 400,
            message: `Field '${key}' must be a valid number.`,
            data: null
          });
        }
      }
    }

    // Find existing record
    const existingRecord = await db.IB_ItemDetails.findOne({ where: { LineItem_id } });
    if (!existingRecord) {
      return res.status(404).json({
        status: 404,
        message: `Item with LineItem_id=${LineItem_id} not found`,
        data: null
      });
    }

    // Prepare fields to update (convert numbers properly)
    const updatedFields = {};
    for (const key in updateData) {
      if (allowedNonIntegers.includes(key)) {
        updatedFields[key] = updateData[key];
      } else {
        updatedFields[key] = Number(updateData[key]);
      }
    }

    // Update record
    await existingRecord.update(updatedFields);

    // Return all records with this LineItem_id after update
    const itemsWithLineId = await db.IB_ItemDetails.findAll({ where: { LineItem_id } });

    return res.status(200).json({
      status: 200,
      message: "Item updated successfully",
      data: itemsWithLineId
    });

  } catch (err) {
    console.error('Error updating item:', err);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      data: null
    });
  }
});





module.exports = router;
