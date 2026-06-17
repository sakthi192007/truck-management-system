const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const BK_Documentation = db.BK_Documentation;

// PUT /uploadDocument/:bk_id
router.put('/uploadDocument/:bk_id', async (req, res) => {
    const bk_id = req.params.bk_id;
    const document = req.body.document;

    // Basic validation
    if (!document || !document.DocumentName || !document.FileName || !document.BK_no) {
        return res.status(400).json({
            status: 400,
            message: "DocumentName, FileName, and BK_no are required",
            data: null
        });
    }

    try {
        // Try to find the document by BK_id
        const existingDoc = await BK_Documentation.findByPk(bk_id);

        let doc, message;

        if (existingDoc) {
            // Update existing
            await existingDoc.update({
                DocumentName: document.DocumentName,
                FileName: document.FileName,
                BK_no: document.BK_no
            });

            doc = existingDoc;
            message = "Document updated successfully";
        } else {
            // Create with the provided BK_id
            doc = await BK_Documentation.create({
                BK_id: bk_id,
                DocumentName: document.DocumentName,
                FileName: document.FileName,
                BK_no: document.BK_no
            });

            message = "Document created successfully";
        }

        return res.status(200).json({
            status: 200,
            message,
            data: {
                BK_id: doc.BK_id,
                DocumentName: doc.DocumentName,
                FileName: doc.FileName,
                BK_no: doc.BK_no
            }
        });

    } catch (err) {
        console.error('Error in document upload/update:', err);
        return res.status(500).json({
            status: 500,
            message: "Server error",
            data: null
        });
    }
});

module.exports = router;
