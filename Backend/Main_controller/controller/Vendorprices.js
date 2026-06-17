const express = require('express');
const { parseISO } = require('date-fns');
const router = express.Router();
const db = require('../../config/dbconnection');
const sequelize = db.sequelize;
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const { storage } = require('../../middlewares/storage');
const { Console, error } = require("console");
const { DateTime } = require('mssql');
const { json } = require('body-parser');
var upload = multer({ storage: storage }).single('file');
const Vendorpricedetails = db.Vendorpricedetails
const impvendorprice = db.impvendorprice
router.post('/', verifytoken, async function (req, res, next) {

    const uploadedFile = req.files;

    const jsondata = req.body;

    try {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const vpfile = uploadedFile && uploadedFile.file ? `vp_${formattedDate}_${uploadedFile.file.name}` : null;
        const Stuffing2 = jsondata?.Stuffing2 ?? null;

        const newCompany = await Vendorpricedetails.create({
            VendorName: jsondata.Vendor,
            Stuffing2: Stuffing2,
            ContainerType: jsondata.Container_type,
            EmptyContainerPickup: jsondata.emptycontainepick,
            StuffingLocation: jsondata.Stuffing,
            Unloading: jsondata.Unloading,
            ValidFrom: jsondata.validfrom,
            ValidTo: jsondata.validto,
            TransportationCharges: jsondata.transcharges,
            HaltingCharges1to2days: jsondata.haltingdays,
            HaltingCharges2to5days: jsondata.haltingcharges,
            HaltingChargesabove5days: jsondata.halting ,
            Status: jsondata.Status,
            FileName: vpfile,
            CreatedBy: jsondata.CreatedBy
        });
        const saveFile = (file, fileName) => {
            console.log(fileName);
            const destination = `./public/vendordetails/vendorpricedetails/${fileName}`;

            fs.writeFile(destination, file.data, function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };

        for (const fieldName in uploadedFile) {
            if (fieldName === "file") {

                const newFileName = `vp_${formattedDate}_${uploadedFile.file.name}`;

                saveFile(uploadedFile.file, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "Vendor Price Details created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postvendorpricedetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }

});
router.post('/import/', verifytoken, async function (req, res, next) {
    const uploadedFile = req.files;
    const jsondata = req.body;
    try {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const vpfile = uploadedFile && uploadedFile.impfile ? `vp_${formattedDate}_${uploadedFile.impfile.name}` : null;
        const imUnloading2 = jsondata?.imUnloading2 ?? null;
        const newCompany = await impvendorprice.create({
            VendorName: jsondata.impVendor,
            Unloading2: imUnloading2,
            ContainerType: jsondata.impcontainer_type,
            EmptyContainerPickup: jsondata.imemptycontainepick,
            FullContainerPickupFromCFSPort: jsondata.imfullcontainerpickup,
            Unloading: jsondata.imUnloading,
            ValidFrom: jsondata.imvalidfrom,
            ValidTo: jsondata.imvalidto,
            TransportationCharges: jsondata.imtranscharges,
            HaltingCharges1to2days: jsondata.imhaltingdays,
            HaltingCharges2to5days: jsondata.imhaltingcharges,
            HaltingChargesabove5days: jsondata.imhalting,
            Agreement: vpfile,
            Status: 0,
            CreatedBy: jsondata.CreatedBy
        });
        const saveFile = (file, fileName) => {
            console.log(fileName);
            const destination = `./public/vendordetails/vendorpricedetails/${fileName}`;

            fs.writeFile(destination, file.data, function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };

        for (const fieldName in uploadedFile) {
            if (fieldName === "impfile") {

                const newFileName = `vp_${formattedDate}_${uploadedFile.impfile.name}`;

                saveFile(uploadedFile.impfile, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "Vendor Price Details created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postvendorpricedetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }

});


router.put('/update/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    const uploadedFile = req.files;



    try {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const vpfile = uploadedFile && uploadedFile.file ? `vp_${formattedDate}_${uploadedFile.file.name}` : null;

        const updatedCompanyData = {
            VendorName: jsondata.Vendor,
            ContainerType: jsondata.Container_type,
            EmptyContainerPickup: jsondata.emptycontainepick,
            StuffingLocation: jsondata.Stuffing,
            Stuffing2: jsondata.Stuffing2,
            Unloading: jsondata.Unloading,
            ValidFrom: jsondata.validfrom,
            ValidTo: jsondata.validto,
            TransportationCharges: jsondata.transcharges,
           HaltingCharges1to2days: jsondata.haltingdays,
            HaltingCharges2to5days: jsondata.haltingcharges,
            HaltingChargesabove5days: jsondata.halting,
            modifiedBy:jsondata.modifiedBy,
            ...(vpfile && { FileName: vpfile }),
        };
        try {
            const newCompany = await Vendorpricedetails.update(updatedCompanyData, {
                where: { V_id: id }
            });
            console.log('client prices updated successfully:', newCompany);
        } catch (error) {
            console.error('Error updating client prices:', error);
        }

        const saveFile = (file, fileName) => {
            console.log(fileName);
            const destination = `./public/vendordetails/vendorpricedetails/${fileName}`;

            fs.writeFile(destination, file.data, function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if (fieldName === "file") {
                const newFileName = `vp_${formattedDate}_${uploadedFile.file.name}`;
                saveFile(uploadedFile.file, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "Vendorprice Details created successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('postvendorpricedetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.put('/import/update/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    const uploadedFile = req.files;
    try {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const vpfile = uploadedFile && uploadedFile.impfile ? `vp_${formattedDate}_${uploadedFile.impfile.name}` : null;
        const imUnloading2 = jsondata?.imUnloading2 ?? null;
        const updatedCompanyData = {
            VendorName: jsondata.impVendor,
            Unloading2: imUnloading2,
            ContainerType: jsondata.impcontainer_type,
            EmptyContainerPickup: jsondata.imemptycontainepick,
            FullContainerPickupFromCFSPort: jsondata.imfullcontainerpickup,
            Unloading: jsondata.imUnloading,
            ValidFrom: jsondata.imvalidfrom,
            ValidTo: jsondata.imvalidto,
            TransportationCharges: jsondata.imtranscharges,
            HaltingCharges1to2days: jsondata.imhaltingdays,
            HaltingCharges2to5days: jsondata.imhaltingcharges,
            HaltingChargesabove5days: jsondata.imhalting,
            modifiedBy: jsondata.modifiedBy,
            ...(vpfile && { Agreement: vpfile }),
        };
        try {
            const newCompany = await impvendorprice.update(updatedCompanyData, {
                where: { V_id: id }
            });
            console.log('client prices updated successfully:', newCompany);
        } catch (error) {
            console.error('Error updating client prices:', error);
        }

        const saveFile = (file, fileName) => {
            console.log(fileName);
            const destination = `./public/vendordetails/vendorpricedetails/${fileName}`;

            fs.writeFile(destination, file.data, function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };

        for (const fieldName in uploadedFile) {
            if (fieldName === "impfile") {

                const newFileName = `vp_${formattedDate}_${uploadedFile.impfile.name}`;
                saveFile(uploadedFile.impfile, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "Vendor Price Details created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postvendorpricedetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }

});
router.get("/vendorpricegrid/:id/:role", verifytoken, function (req, res, next) {

    const id = req.params.id;

    db.sequelize.query(
        "EXEC VendorPriceone_Grid @LoginUserID = :loginId", 
        { 
            replacements: { loginId: id },
            type: db.Sequelize.QueryTypes.SELECT
        }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("Vendorpricedetails");
    })
    .catch(error => {
        console.error("Error fetching Vendorprice details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });

});


router.get("/Getupdate/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
        "select * from Vendor_Price_Details where V_id=" + id + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Vendorpricedetails");
        })
        .catch(error => {
            console.error("Error fetching Vendorprice details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
})

router.get("/imGetupdate/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
        "select * from impvendor_price where V_id=" + id + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Vendorpricedetails");
        })
        .catch(error => {
            console.error("Error fetching vendor details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/approvaldata/:id/:role", verifytoken, function (req, res, next) {

    var id = req.params.id;

    db.sequelize.query(
        "EXEC VendorPricetow_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Vendorpricedetails");
        })
        .catch(error => {
            console.error("Error fetching Vendorprice details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get('/approvel/:value', verifytoken, async function (req, res, next) {
    try {
        const id = req.params.value;
        console.log(id)
        await db.sequelize.query(`
            UPDATE Vendor_Price_Details 
            SET status = :status
            WHERE V_id = :id
        `, {
            replacements: {
                status: 1,
                id: id
            },
            type: db.sequelize.QueryTypes.UPDATE
        });

        const response = CF.getStandardResponse(201, "Vendor Price Details update successfully");
        res.status(201).send(response);

    } catch (err) {
        console.error('approvel: ' + err);
        res.status(500).send({ message: "Something went wrong", error: err.message });
    }
}
)

router.get("/getcustomer/:userId/:RoleId", verifytoken, function (req, res, next) {
    var id = req.params.userId;
    const role = req.params.RoleId;
    db.sequelize.query(
        "select CD_ID,CompanyName,Email from VendorsCompanyDetails where CreatedBy='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Clients");
        })
        .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/imvendorpricegrid/:id/:role", verifytoken, function (req, res, next) {

    var id = req.params.id;
    db.sequelize.query(
        "EXEC VendorPriceImportOne_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Vendorpricedetails");
        })
        .catch(error => {
            console.error("Error fetching vendor details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/imapprovaldata/:id/:role", verifytoken, function (req, res, next) {

    var id = req.params.id;
   
    db.sequelize.query(
        "EXEC VendorPriceImporttow_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Vendorpricedetails");
        })
        .catch(error => {
            console.error("Error fetching vendor details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get('/imapprovel/:value', verifytoken, async function (req, res, next) {
    try {
        const id = req.params.value;
        await db.sequelize.query(`
            UPDATE impvendor_price 
            SET status = :status
            WHERE V_id = :id
        `, {
            replacements: {
                status: 1,
                id: id
            },
            type: db.sequelize.QueryTypes.UPDATE
        });

        const response = CF.getStandardResponse(201, "Vendor Price Details update successfully");
        res.status(201).send(response);

    } catch (err) {
        console.error('approvel: ' + err);
        res.status(500).send({ message: "Something went wrong", error: err.message });
    }
}
)
module.exports = router;