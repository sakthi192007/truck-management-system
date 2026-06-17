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
const { Console } = require("console");
const { DateTime } = require('mssql');
const { json } = require('body-parser');
var upload = multer({ storage: storage }).single('file');
const ClientPrices = db.ClientPrices
const ImportClient = db.ImportClient_selling_price
router.post('/', verifytoken, async function(req, res, next) {

    const uploadedFile = req.files;
    const jsondata = req.body;

    console.log(jsondata);
    try{

        let validfrom='';
        let validto='';

        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const cpfile = uploadedFile && uploadedFile.file ? `cp_${formattedDate}_${uploadedFile.file.name}` : null;
        const haltingdays = jsondata.haltingdays || 0;
        const haltingcharges = jsondata.haltingcharges || 0;
        const halting = jsondata.halting || 0;
        const isValidDate = (date) => {
            return !isNaN(Date.parse(date));
        };
        
        if (isValidDate(jsondata.validfrom)) {
            validfrom = new Date(jsondata.validfrom).toISOString().slice(0, 19).replace('T', ' ');
        } else {
            validfrom = null;
        }
        if (isValidDate(jsondata.validto)) {
            validto = new Date(jsondata.validto).toISOString().slice(0, 19).replace('T', ' ');
        } else {
            validto = null;
        }
        
        const newCompany = await ClientPrices.create({
            ClientName:jsondata.clients,
            Stuffing2:jsondata.Stuffing2,
            ContainerType:jsondata.Container_type,
            EmptyContainerPickup:jsondata.emptycontainepick,
            StuffingLocation:jsondata.stuffinglocation,
            Unloading:jsondata.Unloading,
            ValidFrom:validfrom,
            ValidTo:validto,
            TransportationCharges:jsondata.transcharges,
            HaltingCharges1to2days:haltingdays,
            HaltingCharges2to5days:haltingcharges,
            HaltingChargesabove5days:halting,
            FileName:cpfile,
            Status:0,
            CreatedBy: jsondata.CreatedBy
        });
        const saveFile = (file, fileName) => {
            console.log(fileName);
            const destination = `./public/clientprices/${fileName}`;
            
            fs.writeFile(destination, file.data, function(err){  
                if(err){
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500,"Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if(fieldName ==="file"){
                   const newFileName = cpfile;
                    saveFile(uploadedFile.file, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "Client Price Details created successfully");
        res.status(201).send(response);

    }catch (err) {
        winston.error('postClientPrices: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
  
});
router.post('/import/', verifytoken, async function(req, res, next) {

    const uploadedFile = req.files;
    const jsondata = req.body;
   
    try{
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const cpfile = uploadedFile && uploadedFile.file ? `imcp_${formattedDate}_${uploadedFile.file.name}` : null;

        const haltingdays = jsondata.haltingdays || 0;
        const haltingcharges = jsondata.haltingcharges || 0;
        const halting = jsondata.halting || 0;

        const newCompany = await ImportClient.create({
            ClientName:jsondata.clients,
            Unloading2:jsondata.Unloading2,
            ContainerType:jsondata.Container_type,
            EmptyContainerPickup:jsondata.EmptyContainerPickup,
            fullcontainerpickup:jsondata.fullcontainerpickup,
            Unloading:jsondata.Unloading,
            ValidFrom:jsondata.validfrom,
            ValidTo:jsondata.validto,
            TransportationCharges:jsondata.transcharges,
            HaltingCharges1to2days:haltingdays,
            HaltingCharges2to5days:haltingcharges,
            HaltingChargesabove5days:halting,
            FileName:cpfile,
            Status:0,
            CreatedBy: jsondata.CreatedBy
        });
        const saveFile = (file, fileName) => {
            console.log(fileName);
            const destination = `./public/clientprices/${fileName}`;
            
            fs.writeFile(destination, file.data, function(err){  
                if(err){
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500,"Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if(fieldName ==="file"){
                    const newFileName =cpfile;
                    
                    saveFile(uploadedFile.file, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "Client Price Details created successfully");
        res.status(201).send(response);

    }catch (err) {
        winston.error('postClientPrices: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
  
});
router.put('/update/:id', verifytoken, async function(req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    const uploadedFile = req.files;

    try{
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const cpfile = uploadedFile && uploadedFile.file ? `cp_${formattedDate}_${uploadedFile.file.name}` : null;

  const haltingdays = jsondata.haltingdays || 0;
        const haltingcharges = jsondata.haltingcharges || 0;
        const halting = jsondata.halting || 0;

        const updatedCompanyData = {
            ClientName:jsondata.clients,
            ContainerType:jsondata.Container_type,
            Stuffing2:jsondata.Stuffing2,
            EmptyContainerPickup:jsondata.emptycontainepick,
            StuffingLocation:jsondata.stuffinglocation,
            Unloading:jsondata.Unloading,
            ValidFrom:jsondata.validfrom,
            ValidTo:jsondata.validto,
            TransportationCharges:jsondata.transcharges,
            HaltingCharges1to2days:haltingdays,
            HaltingCharges2to5days:haltingcharges,
            HaltingChargesabove5days:halting,
             modifiedBy:jsondata.modifiedBy,
            ...(cpfile && { FileName: cpfile }),
        };
        try {
            const updatedCompany = await ClientPrices.update(updatedCompanyData, {
                where: { C_id: id }
            });
            console.log('client prices updated successfully:', updatedCompany);
        } catch (error) {
            console.error('Error updating client prices:', error);
        }
      
        const saveFile = (file, fileName) => {
            console.log(fileName);
            const destination = `./public/clientprices/${fileName}`;
            
            fs.writeFile(destination, file.data, function(err){  
                if(err){
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500,"Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        
        for (const fieldName in uploadedFile) {
            if(fieldName ==="file"){
                    const newFileName = cpfile;
                   
                    saveFile(uploadedFile.file, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "Client Price Details created successfully");
        res.status(201).send(response);

    }catch (err) {
        winston.error('postClientPrices: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
   
});
router.put('/import/update/:id', verifytoken, async function(req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    const uploadedFile = req.files;

    try{
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const cpfile = uploadedFile && uploadedFile.file ? `imcp_${formattedDate}_${uploadedFile.file.name}` : null;

        const haltingdays = jsondata.haltingdays || 0;
        const haltingcharges = jsondata.haltingcharges || 0;
        const halting = jsondata.halting || 0;

        const updatedCompanyData = {
            ClientName:jsondata.clients,
            Unloading2:jsondata.Unloading2,
            ContainerType:jsondata.Container_type,
            EmptyContainerPickup:jsondata.EmptyContainerPickup,
            fullcontainerpickup:jsondata.fullcontainerpickup,
            Unloading:jsondata.Unloading,
            ValidFrom:jsondata.validfrom,
            ValidTo:jsondata.validto,
            TransportationCharges:jsondata.transcharges,
            HaltingCharges1to2days:haltingdays,
            HaltingCharges2to5days:haltingcharges,
            HaltingChargesabove5days:halting,
            modifiedBy:jsondata.modifiedBy,
            ...(cpfile && { FileName: cpfile }),
        };
        try {
            const updatedCompany = await ImportClient.update(updatedCompanyData, {
                where: { C_id: id }
            });
            console.log('client prices updated successfully:', updatedCompany);
        } catch (error) {
            console.error('Error updating client prices:', error);
        }
       
        const saveFile = (file, fileName) => {
            console.log(fileName);
            const destination = `./public/clientprices/${fileName}`;
            
            fs.writeFile(destination, file.data, function(err){  
                if(err){
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500,"Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if(fieldName ==="file"){
                const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
                    const newFileName = cpfile;
                   
                    saveFile(uploadedFile.file, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "Client Price Details created successfully");
        res.status(201).send(response);

    }catch (err) {
        winston.error('postClientPrices: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
   
});
router.get("/clientpricegrid/:id/:role", verifytoken, function(req, res, next) {
      const id = req.params.id;
      const role = req.params.role;


    db.sequelize.query(
        "EXEC Clientinpricedetails_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("Clientspricedetails");
    })
    .catch(error => {
        console.error("Error fetching client details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get("/imclientpricegrid/:id/:role", verifytoken, function(req, res, next) {
    

     const id = req.params.id;
      const role = req.params.role;


    db.sequelize.query(
        "EXEC ImportClientinpricedetails_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("Clientspricedetails");
    })
    .catch(error => {
        console.error("Error fetching client details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get("/Getupdate/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
        " select * from Client_selling_price where C_id="+id+"", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("Clientspricedetails");
    })
    .catch(error => {
        console.error("Error fetching client details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get("/imGetupdate/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
        " select * from ImportClient_selling_price where C_id="+id+"", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("Clientspricedetails");
    })
    .catch(error => {
        console.error("Error fetching client details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get("/imapprovaldata/:id/:role", verifytoken, function(req, res, next) {
    
   const id = req.params.id;
      const role = req.params.role;


    db.sequelize.query(
        "EXEC ImportClientinpricedetailsAporvel_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("Clientspricedetails");
    })
    .catch(error => {
        console.error("Error fetching client details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get("/approvaldata/:id/:role", verifytoken, function(req, res, next) {
    
     const id = req.params.id;
      const role = req.params.role;


    db.sequelize.query(
        "EXEC ClientinpricedetailsAprovel_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("Clientspricedetails");
    })
    .catch(error => {
        console.error("Error fetching client details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get('/approvel/:value', verifytoken, async function(req, res, next){
    try {
        const id = req.params.value;
        console.log(id)
        await db.sequelize.query(`
            UPDATE Client_selling_price 
            SET status = :status
            WHERE C_id = :id
        `, {
            replacements: {
                status:1,
                id: id
            },
            type: db.sequelize.QueryTypes.UPDATE
        });

        const response = CF.getStandardResponse(201, "Client Price Details update successfully");
        res.status(201).send(response);

      } catch (err) {
        console.error('approvel: ' + err);
        res.status(500).send({ message: "Something went wrong", error: err.message });
    }
}
)
router.get('/imapprovel/:value', verifytoken, async function(req, res, next){
    try {
        const id = req.params.value;
        console.log(id)
        await db.sequelize.query(`
            UPDATE ImportClient_selling_price 
            SET status = :status
            WHERE C_id = :id
        `, {
            replacements: {
                status:1,
                id: id
            },
            type: db.sequelize.QueryTypes.UPDATE
        });

        const response = CF.getStandardResponse(201, "Client Price Details update successfully");
        res.status(201).send(response);

      } catch (err) {
        console.error('approvel: ' + err);
        res.status(500).send({ message: "Something went wrong", error: err.message });
    }
}
)
module.exports = router;