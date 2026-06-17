const express = require('express');
const { parseISO } = require('date-fns');
const router = express.Router();
const db = require('../../config/dbconnection');
const sequelize = db.sequelize;
const Companydetails = db.CompanyDetails;
const BankDetails = db.BankDetails;
const vehicleDetails = db.vehicleDetails;
const DriverDetails = db.DriverDetails;
const AdditionalvehicleDetails = db.AdditionalvehicleDetails;
const LoginDetails = db.LoginDetails;
const userdetails = db.userdetails;
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
const nodemailer = require("nodemailer");
const moment = require("moment");

var upload = multer({ storage: storage }).single('file');


router.post('/vendor/comapany', verifytoken, async function(req, res, next) {
    const uploadedFile = req.files;
    const jsondata = req.body;
    try {
        const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const gstfle = uploadedFile && uploadedFile.gstfle ? `gst_${formattedDate}_${uploadedFile.gstfle.name}` : null;
        const panfle = uploadedFile && uploadedFile.panfle ? `pan_${formattedDate}_${uploadedFile.panfle.name}` : null;
        const smefle = uploadedFile && uploadedFile.smefle ? `sme_${formattedDate}_${uploadedFile.smefle.name}` : null;
        const tinfle = uploadedFile && uploadedFile.tinfle ? `tin_${formattedDate}_${uploadedFile.tinfle.name}` : null;
        const rocfles = uploadedFile && uploadedFile.rocfle ? `Roc_${formattedDate}_${uploadedFile.rocfle.name}` : null;
        const otherfiles = uploadedFile && uploadedFile.otherfile ? `OTH_${formattedDate}_${uploadedFile.otherfile.name}` : null;
       
        const newCompany = await Companydetails.create({
            CompanyName: jsondata.Company,
            GSTNumber: jsondata.gst_number,
            PANNumber: jsondata.pan_number,
            PhoneNumber: jsondata.PhoneNumber,
            description: jsondata.description,
            Zipcode: jsondata.Zipcode,
            VendorCode: jsondata.VendorCode,
            Email: jsondata.email,
            SEMORMSEM: jsondata.sem_msem,
            TINNumber: jsondata.tin_number,
            City: jsondata.city,
            userId: jsondata.userId,
            State: jsondata.state,
            Country: jsondata.country,
            OfficeAddress: jsondata.CompanyAddress,
            OfficeAddressLine1: jsondata.CompanyAddressLine1,
            GSTFile: gstfle,
            PANUpload: panfle,
            smefle: smefle,
            tinfle: tinfle,
            rocfle: rocfles,
            otherfile: otherfiles,
            status: jsondata.status,
            CreatedBy: jsondata.CreatedBy
        });

        const saveFile = (file, fileName) => {
            console.log(fileName);
            const destination = `./public/vendordetails/company/${fileName}`;
            
            fs.writeFile(destination, file.data, function(err){  
                if(err){
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500,"Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
       
        for (const fieldName in uploadedFile) {

            if (fieldName === "gstfle") {
                const newFileName = `gst_${formattedDate}_${uploadedFile.gstfle.name}`;
                saveFile(uploadedFile.gstfle, newFileName);
            } else if (fieldName === "panfle") {
                const newFileName = `pan_${formattedDate}_${uploadedFile.panfle.name}`;
                saveFile(uploadedFile.panfle, newFileName);
            } else if (fieldName === "smefle") {
                const newFileName = `sme_${formattedDate}_${uploadedFile.smefle.name}`;
                saveFile(uploadedFile.smefle, newFileName);
            } else if (fieldName === "tinfile") {
                const newFileName = `Tin_${formattedDate}_${uploadedFile.tinfle.name}`;
                saveFile(uploadedFile.tinfle, newFileName);
            } else if (fieldName === "rocfle") {
                const newFileName = `Roc_${formattedDate}_${uploadedFile.rocfle.name}`;
                saveFile(uploadedFile.rocfle, newFileName);
            } else if (fieldName === "otherfile") {
                const newFileName = `OTH_${formattedDate}_${uploadedFile.otherfile.name}`;
                saveFile(uploadedFile.otherfile, newFileName);
            }
        }

        
        const response = CF.getStandardResponse(201, "Company created successfully", { id: newCompany.CD_ID });
        res.status(201).send(response);

    } catch (err) {
        winston.error('postCompanyDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.post('/vendor/bank', verifytoken, async function(req, res, next) {
    const uploadedFile = req.files;
    const jsondata = req.body;
    try {
        const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const bankfile = uploadedFile && uploadedFile.bankfile ? `bank_${formattedDate}_${uploadedFile.bankfile.name}` : null;

        const newCompany = await BankDetails.create({
            CD_ID: jsondata.CD_ID,
            AccountHolderName: jsondata.holdername,
            BankAccountNumber: jsondata.bankaccount,
            description: jsondata.description,
            bankcode: jsondata.bankcode,
            BankName: jsondata.bankname,
            IFSCCode: jsondata.ifsccode,
            Branch: jsondata.branch,
            BankAddress: jsondata.bankadd,
            BankStatement: bankfile,
            status: jsondata.status,
            CreatedBy: jsondata.CreatedBy
        });
        const saveFile = (file, fileName) => {
            const destination = `./public/vendordetails/bank/${fileName}`;
            console.log(destination);
            fs.writeFile(destination, file.data, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if (fieldName === "bankfile") {
                const newFileName = `bank_${formattedDate}_${uploadedFile.bankfile.name}`;
                saveFile(uploadedFile.bankfile, newFileName);
            }
        }
        var response = CF.getStandardResponse(201, "Bank created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postCompanyDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.post('/vendor/vehicle', async function(req, res, next) {
    const uploadedFile = req.files;
    const jsondata = req.body;

    console.log(jsondata);
    try {

        const isValidDate = (date) => {
            return !isNaN(Date.parse(date));
        };
        
        let polluctionexpiry ="";
        let year_vehicle ="";
        let permit_date ="";
        let fcexpirydate ="";
        let road_tax ="";
        let insurance_ex ="";

        if (isValidDate(jsondata.polluctionexpiry)) {
            polluctionexpiry = new Date(jsondata.polluctionexpiry).toISOString().slice(0, 19).replace('T', ' ');
        } else {
            polluctionexpiry = null;
        }
        if (isValidDate(jsondata.year_vehicle)) {
            year_vehicle = new Date(jsondata.year_vehicle).toISOString().slice(0, 19).replace('T', ' ');
        } else {
            year_vehicle = null;
        }
        if (isValidDate(jsondata.permit_date)) {
            permit_date = new Date(jsondata.permit_date).toISOString().slice(0, 19).replace('T', ' ');
        } else {
            permit_date = null;
        }
        if (isValidDate(jsondata.fcexpirydate)) {
            fcexpirydate = new Date(jsondata.fcexpirydate).toISOString().slice(0, 19).replace('T', ' ');
        } else {
            fcexpirydate = null;
        }
        if (isValidDate(jsondata.road_tax)) {
            road_tax = new Date(jsondata.road_tax).toISOString().slice(0, 19).replace('T', ' ');
        } else {
            road_tax = null;
        }
        if (isValidDate(jsondata.insurance_ex)) {
            insurance_ex = new Date(jsondata.insurance_ex).toISOString().slice(0, 19).replace('T', ' ');
        } else {
            insurance_ex = null;
        }
        const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const rcfile = uploadedFile && uploadedFile.rcfile ? `rc_${formattedDate}_${uploadedFile.rcfile.name}` : null;
        const insufile = uploadedFile && uploadedFile.insufile ? `insurance_${formattedDate}_${uploadedFile.insufile.name}` : null;
        const pollfile = uploadedFile && uploadedFile.pollfile ? `poll_${formattedDate}_${uploadedFile.pollfile.name}` : null;
        const truckfile = uploadedFile && uploadedFile.truckfile ? `truck_${formattedDate}_${uploadedFile.truckfile.name}` : null;

        const newCompany = await vehicleDetails.create({
            CD_ID: jsondata.CD_ID,
            TypeofContainers: jsondata.type_of,
            VehicleNumber: jsondata.vehicle_num,
            own_addition: jsondata.own_addition,
            vehiclecode: jsondata.vehiclecode,
            polluctionexpiry:polluctionexpiry,
            insurancenumber: jsondata.insurancenumber,
            vehides: jsondata.vehides,
            RcNumber: jsondata.rc_num,
            YearofManufacture:year_vehicle,
            PermitofVehicle: jsondata.permit_Vehicle,
            PermitofVehicleExpiryDate:permit_date,
            FCExpiryDate:fcexpirydate,
            RoadTaxExpiryDate:road_tax,
            VehiclePollutionCertificateNumber: jsondata.Poll_certificate,
            InsuranceCompanyName: jsondata.insurancecompanyname,
            InsuranceExpiryDate:insurance_ex,
            RCUpload: rcfile,
            InsuranceUpload: insufile,
            PollutionCertificateUpload: pollfile,
            AttachedTruckDetails: truckfile,
            status: jsondata.status,
            booking_status: 0,
            CreatedBy: jsondata.CreatedBy
        });

        const saveFile = (file, fileName) => {
            const destination = `./public/vendordetails/vehicle/${fileName}`;
            console.log(destination);
            fs.writeFile(destination, file.data, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if (fieldName === "rcfile") {
                const newFileName = `rc_${formattedDate}_${uploadedFile.rcfile.name}`;
                saveFile(uploadedFile.rcfile, newFileName);
            } else if (fieldName === "insufile") {
                const newFileName = `insurance_${formattedDate}_${uploadedFile.insufile.name}`;
                saveFile(uploadedFile.insufile, newFileName);
            } else if (fieldName === "pollfile") {
                const newFileName = `poll_${formattedDate}_${uploadedFile.pollfile.name}`;
                saveFile(uploadedFile.pollfile, newFileName);
            } else if (fieldName === "truckfile") {
                const newFileName = `truck_${formattedDate}_${uploadedFile.truckfile.name}`;
                saveFile(uploadedFile.truckfile, newFileName);
            }
        }
        var response = CF.getStandardResponse(201, "Vehicle Created Successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postVehiCleDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.post('/vendor/driver', verifytoken, async function(req, res, next) {
    const uploadedFile = req.files;
    const jsondata = req.body;

    console.log(jsondata);
    try {
        const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const drivfiles = uploadedFile && uploadedFile.drfile ? `driver_${formattedDate}_${uploadedFile.drfile.name}` : null;

       
        const newCompany = await DriverDetails.create({
            CD_ID: jsondata.CD_ID,
            DriverName: jsondata.name,
            DriverPhoneNumber: jsondata.phonenumber,
            description: jsondata.description,
            Drivercode: jsondata.Drivercode,
            DrivingLicenceNumber: jsondata.licencenum,
            AadharNumber: jsondata.aadhar_num,
            DrivingLicenseExpiredDate: jsondata.expired_date,
            DrivingLicenceupload: drivfiles,
            status: jsondata.status,
            CreatedBy: jsondata.CreatedBy
        });

        const saveFile = (file, fileName) => {
            const destination = `./public/vendordetails/driver/${fileName}`;
            console.log(destination);
            fs.writeFile(destination, file.data, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if (fieldName === "drfile") {
                const newFileName =drivfiles;
                saveFile(uploadedFile.drfile, newFileName);
            }
        }
        var response = CF.getStandardResponse(201, "driver created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postdriver: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});


//update
router.put('/company/update/:id', verifytoken, async function(req, res, next) {
    console.log(req.body);
    const id = req.params.id;
    const jsondata = req.body;
    const uploadedFile = req.files;
    console.log(id);
    try {
        const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const gstfle = uploadedFile && uploadedFile.gstfle ? `gst_${formattedDate}_${uploadedFile.gstfle.name}` : null;
        const panfle = uploadedFile && uploadedFile.panfle ? `pan_${formattedDate}_${uploadedFile.panfle.name}` : null;
        const smefle = uploadedFile && uploadedFile.smefle ? `sme_${formattedDate}_${uploadedFile.smefle.name}` : null;
        const tinfle = uploadedFile && uploadedFile.tinfle ? `tin_${formattedDate}_${uploadedFile.tinfle.name}` : null;
        const rocfles = uploadedFile && uploadedFile.rocfle ? `Roc_${formattedDate}_${uploadedFile.rocfle.name}` : null;
        const otherfiles = uploadedFile && uploadedFile.otherfile ? `OTH_${formattedDate}_${uploadedFile.otherfile.name}` : null;
       

        const updatedCompany = {
            CompanyName: jsondata.Company,
            GSTNumber: jsondata.gst_number,
            PANNumber: jsondata.pan_number,
            PhoneNumber: jsondata.PhoneNumber,
            description: jsondata.description,
            ModifiedBy: jsondata.userId,
            Zipcode: jsondata.Zipcode,
            VendorCode: jsondata.VendorCode,
            Email: jsondata.email,
            SEMORMSEM: jsondata.sem_msem,
            TINNumber: jsondata.tin_number,
            City: jsondata.city,
            State: jsondata.state,
            Country: jsondata.country,
            OfficeAddress: jsondata.CompanyAddress,
            OfficeAddressLine1: jsondata.CompanyAddressLine1,
          
            status: jsondata.status,
            ...(gstfle && { GSTFile: gstfle }),
            ...(panfle && { PANUpload: panfle }),
            ...(smefle && { smefle: smefle }),
            ...(tinfle && { tinfle: tinfle }),
            ...(rocfles && { rocfle: rocfles }),
            ...(otherfiles && { otherfile: otherfiles }),
        };
        try {
            const newCompany = await Companydetails.update(updatedCompany, {
                where: { CD_ID: id }
            });
            console.log('vendor updated successfully:', newCompany);
        } catch (error) {
            console.error('Error updating vendor:', error);
        }

       

        const saveFile = (file, fileName) => {
            const destination = `./public/vendordetails/company/${fileName}`;

            fs.writeFile(destination, file.data, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {

            if (fieldName === "gstfle") {
                const newFileName = `gst_${formattedDate}_${uploadedFile.gstfle.name}`;
                saveFile(uploadedFile.gstfle, newFileName);
            } else if (fieldName === "panfle") {
                const newFileName = `pan_${formattedDate}_${uploadedFile.panfle.name}`;
                saveFile(uploadedFile.panfle, newFileName);
            } else if (fieldName === "smefle") {
                const newFileName = `sme_${formattedDate}_${uploadedFile.smefle.name}`;
                saveFile(uploadedFile.smefle, newFileName);
            } else if (fieldName === "tinfle") {
                const newFileName = `tin_${formattedDate}_${uploadedFile.tinfle.name}`;
                saveFile(uploadedFile.tinfle, newFileName);
            } else if (fieldName === "rocfle") {
                const newFileName = `Roc_${formattedDate}_${uploadedFile.rocfle.name}`;
                saveFile(uploadedFile.rocfle, newFileName);
            } else if (fieldName === "otherfile") {
                const newFileName = `OTH_${formattedDate}_${uploadedFile.otherfile.name}`;
                saveFile(uploadedFile.otherfile, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "Company Update successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('putCompanyDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.put('/bank/update/:id', verifytoken, async function(req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    const uploadedFile = req.files;
    try {
        const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const bankfile = uploadedFile && uploadedFile.bankfile ? `bank_${formattedDate}_${uploadedFile.bankfile.name}` : null;

        
        const updatebank = {
            CD_ID: jsondata.CD_ID,
            AccountHolderName: jsondata.holdername,
            BankAccountNumber: jsondata.bankaccount,
            bankcode: jsondata.bankcode,
            BankName: jsondata.bankname,
            IFSCCode: jsondata.ifsccode,
            Branch: jsondata.branch,
            description: jsondata.description,
            BankAddress: jsondata.bankadd,
            status: jsondata.status,
            ...(bankfile && { BankStatement: bankfile }),
        };
        try {
            const updatedCompany = await BankDetails.update(updatebank, {
                where: { BD_key: id }
            });
            console.log('Bank updated successfully:', updatedCompany);
        } catch (error) {
            console.error('Error updating Bank:', error);
        }
      

        const saveFile = (file, fileName) => {
            const destination = `./public/vendordetails/bank/${fileName}`;
            console.log(destination);
            fs.writeFile(destination, file.data, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if (fieldName === "bankfile") {
                const newFileName = `bank_${formattedDate}_${uploadedFile.bankfile.name}`;
                saveFile(uploadedFile.bankfile, newFileName);
            }
        }
        var response = CF.getStandardResponse(201, "Bank created successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('putBankDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

router.put('/vehicle/update/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    const uploadedFile = req.files;
    const fs = require('fs');

    try {
        const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');

       
        const rcfile = uploadedFile?.rcfile ? `rc_${formattedDate}_${uploadedFile.rcfile.name}` : null;
        const insufile = uploadedFile?.insufile ? `insurance_${formattedDate}_${uploadedFile.insufile.name}` : null;
        const pollfile = uploadedFile?.pollfile ? `poll_${formattedDate}_${uploadedFile.pollfile.name}` : null;
        const truckfile = uploadedFile?.truckfile ? `truck_${formattedDate}_${uploadedFile.truckfile.name}` : null;

     
        const parseDate = (dateStr) => {
            if (!dateStr || dateStr === 'null' || dateStr === 'Invalid date') return null;
            const parsed = new Date(dateStr);
            return isNaN(parsed.getTime()) ? null : parsed;
        };

        const updatevehicle = {
            CD_ID: jsondata.CD_ID,
            TypeofContainers: jsondata.type_of,
            VehicleNumber: jsondata.vehicle_num,
            RcNumber: jsondata.rc_num,
            vehiclecode: jsondata.vehiclecode,
            own_addition: jsondata.own_addition,
            polluctionexpiry: parseDate(jsondata.polluctionexpiry),
            insurancenumber: jsondata.insurancenumber,
            vehides: jsondata.vehides,
            YearofManufacture: parseDate(jsondata.year_vehicle),
            PermitofVehicle: jsondata.permit_Vehicle,
            PermitofVehicleExpiryDate: parseDate(jsondata.permit_date),
            FCExpiryDate: parseDate(jsondata.fcexpirydate),
            RoadTaxExpiryDate: parseDate(jsondata.road_tax),
            VehiclePollutionCertificateNumber: jsondata.Poll_certificate,
            InsuranceCompanyName: jsondata.insurancecompanyname,
            InsuranceExpiryDate: parseDate(jsondata.insurance_ex),
            status: jsondata.status,
            ...(rcfile && { RCUpload: rcfile }),
            ...(insufile && { InsuranceUpload: insufile }),
            ...(pollfile && { PollutionCertificateUpload: pollfile }),
            ...(truckfile && { AttachedTruckDetails: truckfile }),
        };

       
        const updatedVehicle = await vehicleDetails.update(updatevehicle, {
            where: { VD_key: id }
        });

        console.log('Vehicle updated successfully:', updatedVehicle);

       
        const saveFile = (file, fileName) => {
            const destination = `./public/vendordetails/vehicle/${fileName}`;
            fs.writeFile(destination, file.data, (err) => {
                if (err) {
                    console.error('File save error:', err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };

        
        if (uploadedFile) {
            if (uploadedFile.rcfile) saveFile(uploadedFile.rcfile, rcfile);
            if (uploadedFile.insufile) saveFile(uploadedFile.insufile, insufile);
            if (uploadedFile.pollfile) saveFile(uploadedFile.pollfile, pollfile);
            if (uploadedFile.truckfile) saveFile(uploadedFile.truckfile, truckfile);
        }

        const response = CF.getStandardResponse(201, "Vehicle Updated Successfully");
        res.status(201).send(response);

    } catch (err) {
        console.error('Vehicle Update Error:', err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

router.put('/driver/update/:id', verifytoken, async function(req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    const uploadedFile = req.files;


    console.log(jsondata);

    try {
        const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const drivfiles = uploadedFile && uploadedFile.drfile ? `driver_${formattedDate}_${uploadedFile.drfile.name}` : null;
        const updatedriver = {
            CD_ID: jsondata.CD_ID,
            DriverName: jsondata.name,
            DriverPhoneNumber: jsondata.phonenumber,
            DrivingLicenceNumber: jsondata.licencenum,
            Drivercode: jsondata.Drivercode,
            AadharNumber: jsondata.aadhar_num,
            description: jsondata.description,
            DrivingLicenseExpiredDate: jsondata.expired_date,
            status: jsondata.status,
            ...(drivfiles && { DrivingLicenceupload: drivfiles }),
        };
        try {
            const updatedCompany = await DriverDetails.update(updatedriver, {
                where: { DD_key: id }
            });
            console.log('driver updated successfully:', updatedCompany);
        } catch (error) {
            console.error('Error updating Driver:', error);
        }
        const saveFile = (file, fileName) => {
            const destination = `./public/vendordetails/driver/${fileName}`;
            console.log(destination);
            fs.writeFile(destination, file.data, function(err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if (fieldName === "drfile") {
                const newFileName = `driver_${formattedDate}_${uploadedFile.drfile.name}`;
                saveFile(uploadedFile.drfile, newFileName);
            }
        }
        var response = CF.getStandardResponse(201, "Driver Update successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('putDriver: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});



//vendor table grid 
router.get("/bankgrid/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
            "select upper(bankcode)as bankcode,description,BD_key,CD_ID,AccountHolderName,BankAccountNumber,BankName,Branch,status,createdOn from BankDetails where CD_ID='" + id + "' ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Bankdetails");
        })
        .catch(error => {
            console.error("Error fetching bank details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getvehiclegrid/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
            "select upper(a.vehiclecode)as vehiclecode,a.vehides,a.VD_key,a.TypeofContainers,c.generalType,a.VehicleNumber,a.RcNumber,a.status,a.createdOn from vehicleDetails a left join general c on a.TypeofContainers=c.G_key where a.own_addition='0' and a.CD_ID='" + id + "'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Vehicledetails");
        })
        .catch(error => {
            console.error("Error fetching client details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getaddvehiclegrid/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
            "select upper(a.vehiclecode)as vehiclecode,a.vehides,a.VD_key,a.TypeofContainers,c.generalType,a.VehicleNumber,a.RcNumber,a.status,a.createdOn from vehicleDetails a left join general c on a.TypeofContainers=c.G_key where a.own_addition='1' and a.CD_ID='" + id + "'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Vehicledetails");
        })
        .catch(error => {
            console.error("Error fetching client details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/drivergetupdate/:id", verifytoken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await DriverDetails.findByPk(id);

        if (!data) {
            const response = CF.getStandardResponse(401, "DriverDetails not found");
            return res.status(401).send(response);
        }

        winston.info("getDriverDetails");
        return res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
    } catch (err) {
        winston.error("/drivergetupdate: " + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        return res.status(500).send(response);
    }
});

router.get("/getdrivergrid/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
            "select upper(Drivercode)as Drivercode,description,DD_key,DriverName,DriverPhoneNumber,DrivingLicenceNumber,AadharNumber,DrivingLicenseExpiredDate,status,createdOn from DriverDetails where CD_ID='" + id + "'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Companydetails");
        })
        .catch(error => {
            console.error("Error fetching client details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});






router.get("/update/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    Companydetails.findByPk(id)
        .then((data) => {
            if (!data) {
                var response = CF.getStandardResponse(401, "Companydetails not found");
                return res.status(401).send(response);
            } else {
                res.status(200).send({
                    response_code: "200",
                    response_message: "success.",
                    data
                });
                winston.info("getCompanydetails");
            }
        })
        .catch((err) => {
            winston.error("/getCompanydetails " + err);
            var response = CF.getStandardResponse(500, "Something went wrong");
            return res.status(500).send(response);
        });
});

router.get("/bankgetupdate/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    BankDetails.findByPk(id).then((data) => {
        if (!data) {
            var response = CF.getStandardResponse(401, "BankDetails not found");
            return res.status(401).send(response);
        } else {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            }).catch((err) => {
                winston.error("/getBankDetails" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            });
            winston.info("getBankDetails");
        }
    });
});
router.get("/vehiclegetupdate/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    try {
        vehicleDetails.findByPk(id)
            .then((data) => {
                if (!data) {
                    var response = CF.getStandardResponse(401, "vehicleDetails not found");
                    return res.status(401).send(response);
                } else {
                    res.status(200).send({
                        response_code: "200",
                        response_message: "success.",
                        data,
                    });
                    winston.info("getvehicleDetails");
                }
            })
            .catch((err) => {
                winston.error("/getvehicleDetails" + err);
                var response = CF.getStandardResponse(500, "Something went wrong");
                return res.status(500).send(response);
            });
    } catch (error) {
        console.error('Error sending response:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
router.get("/drivergetupdate/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    DriverDetails.findByPk(id).then((data) => {
        if (!data) {
            var response = CF.getStandardResponse(401, "DriverDetails not found");
            return res.status(401).send(response);
        } else {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            }).catch((err) => {
                winston.error("/getDriverDetails" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            });
            winston.info("getDriverDetails");
        }
    });
});


///vendor main grid get table values
router.get("/getvendor/:id/:role", verifytoken, function(req, res, next) {

    const id = req.params.id;
    const role = req.params.role;

   
    db.sequelize.query(
            "EXEC Vendor_Information_Grid @LoginUserID='"+id+"' ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Companydetails");
        })
        .catch(error => {
            console.error("Error fetching client details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});


///get dropdown
router.get("/getcontainer/", verifytoken, function(req, res, next) {
    db.sequelize.query(
            "select G_key,generalType from general", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("TypeofContainer");
        })
        .catch(error => {
            console.error("Error fetching Country:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getcontainerft/", verifytoken, function(req, res, next) {
    db.sequelize.query(
            "select CF_key,containerFt from ContainerFts", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("ContainerFts");
        })
        .catch(error => {
            console.error("Error fetching Country:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});


///delete

router.delete('/bank/:id', verifytoken, function(req, res, next) {

    const id = req.params.id;
    BankDetails.destroy({
            where: {
                BD_key: id
            }
        })
        .then(Register => {
            if (!Register) {
                return res.status(404).send({
                    message: "bankdetails not found with id " + req.params.id
                });
            }
            winston.info('deletebankdetails/id' + id)
            res.send({
                message: "bankdetails deleted successfully!"
            });

        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "bankdetails not found with id " + req.params.id
                });
            }
            var response = CF.getStandardResponse(500, "Something wrong while deleted.");
            return res.status(500).send(response)
            winston.error('deletebankdetails' + err)
        });
});
router.delete('/vehicle/:id', verifytoken, function(req, res, next) {

    const id = req.params.id;
    vehicleDetails.destroy({
            where: {
                VD_key: id
            }
        })
        .then(Register => {
            if (!Register) {
                return res.status(404).send({
                    message: "vehicleDetails not found with id " + req.params.id
                });
            }
            winston.info('deletevehicleDetails/id' + id)
            res.send({
                message: "vehicleDetails deleted successfully!"
            });

        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "vehicleDetails not found with id " + req.params.id
                });
            }
            var response = CF.getStandardResponse(500, "Something wrong while deleted.");
            return res.status(500).send(response)
            winston.error('deletevehicleDetails' + err)
        });
});
router.delete('/addvehicle/:id', verifytoken, function(req, res, next) {

    const id = req.params.id;
    AdditionalvehicleDetails.destroy({
            where: {
                AVD_key: id
            }
        })
        .then(Register => {
            if (!Register) {
                return res.status(404).send({
                    message: "vehicleDetails not found with id " + req.params.id
                });
            }
            winston.info('deletevehicleDetails/id' + id)
            res.send({
                message: "vehicleDetails deleted successfully!"
            });

        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "vehicleDetails not found with id " + req.params.id
                });
            }
            var response = CF.getStandardResponse(500, "Something wrong while deleted.");
            return res.status(500).send(response)
            winston.error('deletevehicleDetails' + err)
        });
});
router.delete('/driver/:id', verifytoken, function(req, res, next) {

    const id = req.params.id;
    DriverDetails.destroy({
            where: {
                DD_key: id
            }
        })
        .then(Register => {
            if (!Register) {
                return res.status(404).send({
                    message: "DriverDetails not found with id " + req.params.id
                });
            }
            winston.info('deleteDriverDetails/id' + id)
            res.send({
                message: "DriverDetails deleted successfully!"
            });

        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "DriverDetails not found with id " + req.params.id
                });
            }
            var response = CF.getStandardResponse(500, "Something wrong while deleted.");
            return res.status(500).send(response)
            winston.error('deleteDriverDetails' + err)
        });
});


async function checkExpiryDates() {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            auth: {
                user: "contact@infologia.in",
                pass: "Welcome@123",
            },
        });

        const currentDate = moment();

        const query = `
            SELECT a.VehicleNumber, a.PermitofVehicleExpiryDate, b.Email 
            FROM vehicleDetails a 
            LEFT JOIN VendorsCompanyDetails b ON a.CD_ID = b.CD_ID 
            WHERE a.VehicleNumber IS NOT NULL 
              AND a.PermitofVehicleExpiryDate BETWEEN GETDATE() AND DATEADD(DAY, 30, GETDATE());
        `;

        const expiryDetails = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT,
        });

        if (!expiryDetails || expiryDetails.length === 0) {
            console.log("No expiry details found for the current date.");
            return;
        }

        for (const detail of expiryDetails) {
            console.log("Processing detail:", detail);
            const { VehicleNumber, PermitofVehicleExpiryDate,Email } = detail;

            if (PermitofVehicleExpiryDate) {
                const recipientEmail = Email;
                const mailOptions = {
                    from: "contact@infologia.in",
                    to: recipientEmail,
                    //cc:"rajasekar@skybtrans.com ,shankar@skybtrans.com, Yogapraveen@skybtrans.com",
                    subject: "Expiry Date Alert",
                    html: `
                        <div>
                            <h1>Expiry Date Alert</h1>
                            <p>Dear Sir/Madam,</p>
                            <p>Vehicle Number: <b>${VehicleNumber}</b></p>
                            <p>Permit Expiry Date: <b>${moment(PermitofVehicleExpiryDate).format("DD/MM/YYYY")}</b></p>
                            <p>Please take necessary actions to renew the permit.</p>
                            <p>Warm Regards,<br>Infologia Technologies PVT. LTD.</p>
                        </div>
                    `,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email sent for Vehicle: ${VehicleNumber}`);
                } catch (emailError) {
                    console.error(`Error sending email for Vehicle: ${VehicleNumber}`, emailError.message);
                }
            }
        }

        console.log("Expiry date checks completed.");
    } catch (error) {
        console.error("Error in checkExpiryDates:", error.message);
    }
}
setInterval(checkExpiryDates, 86400000);

async function checkExpiryDatesFc() {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            auth: {
                user: "contact@infologia.in",
                pass: "Welcome@123",
            },
        });

        const currentDate = moment();

        const query = `
            SELECT a.VehicleNumber,a.FCExpiryDate, b.Email 
            FROM vehicleDetails a 
            LEFT JOIN VendorsCompanyDetails b ON a.CD_ID = b.CD_ID 
            WHERE a.VehicleNumber IS NOT NULL 
              AND a.FCExpiryDate BETWEEN GETDATE() AND DATEADD(DAY, 30, GETDATE());
        `;

        const expiryDetails = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT,
        });

        if (!expiryDetails || expiryDetails.length === 0) {
            console.log("No expiry details found for the current date.");
            return;
        }

        for (const detail of expiryDetails) {
            console.log("Processing detail:", detail);
            const { VehicleNumber, FCExpiryDate,Email } = detail;

            if (FCExpiryDate) {
                const recipientEmail = Email;
                const mailOptions = {
                    from: "contact@infologia.in",
                    to: recipientEmail,
                  //  cc:"rajasekar@skybtrans.com ,shankar@skybtrans.com, Yogapraveen@skybtrans.com",
                    subject: "Expiry Date Alert",
                    html: `
                        <div>
                            <h1>Expiry Date Alert</h1>
                            <p>Dear Sir/Madam,</p>
                            <p>Vehicle Number: <b>${VehicleNumber}</b></p>
                            <p>FC Expiry Date: <b>${moment(FCExpiryDate).format("DD/MM/YYYY")}</b></p>
                            <p>Please take necessary actions to renew the FC.</p>
                            <p>Warm Regards,<br>Infologia Technologies PVT. LTD.</p>
                        </div>
                    `,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email sent for Vehicle: ${VehicleNumber}`);
                } catch (emailError) {
                    console.error(`Error sending email for Vehicle: ${VehicleNumber}`, emailError.message);
                }
            }
        }

        console.log("Expiry date checks completed.");
    } catch (error) {
        console.error("Error in checkExpiryDates:", error.message);
    }
}
setInterval(checkExpiryDatesFc, 86400000);

async function checkExpiryDatesroad() {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            auth: {
                user: "contact@infologia.in",
                pass: "Welcome@123",
            },
        });

        const currentDate = moment();

        const query = `
            SELECT a.VehicleNumber,  a.RoadTaxExpiryDate, b.Email 
            FROM vehicleDetails a 
            LEFT JOIN VendorsCompanyDetails b ON a.CD_ID = b.CD_ID 
            WHERE a.VehicleNumber IS NOT NULL 
              AND a.FCExpiryDate BETWEEN GETDATE() AND DATEADD(DAY, 30, GETDATE());
        `;

        const expiryDetails = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT,
        });

        if (!expiryDetails || expiryDetails.length === 0) {
            console.log("No expiry details found for the current date.");
            return;
        }

        for (const detail of expiryDetails) {
            console.log("Processing detail:", detail);
            const { VehicleNumber,RoadTaxExpiryDate, Email } = detail;

            if (RoadTaxExpiryDate) {
                const recipientEmail = Email;
                const mailOptions = {
                    from: "contact@infologia.in",
                    to: recipientEmail,
                   // cc:"rajasekar@skybtrans.com ,shankar@skybtrans.com, Yogapraveen@skybtrans.com",
                    subject: "Expiry Date Alert",
                    html: `
                        <div>
                            <h1>Expiry Date Alert</h1>
                            <p>Dear Sir/Madam,</p>
                            <p>Vehicle Number: <b>${VehicleNumber}</b></p>
                            <p>RoadTaxExpiryDate: <b>${moment(RoadTaxExpiryDate).format("DD/MM/YYYY")}</b></p>
                            <p>Please take necessary actions to renew the RoadTaxExpiryCertificate.</p>
                            <p>Warm Regards,<br>Infologia Technologies PVT. LTD.</p>
                        </div>
                    `,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email sent for Vehicle: ${VehicleNumber}`);
                } catch (emailError) {
                    console.error(`Error sending email for Vehicle: ${VehicleNumber}`, emailError.message);
                }
            }
        }

        console.log("Expiry date checks completed.");
    } catch (error) {
        console.error("Error in checkExpiryDates:", error.message);
    }
}
setInterval(checkExpiryDatesroad, 86400000);

async function checkExpiryDatespollution() {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            auth: {
                user: "contact@infologia.in",
                pass: "Welcome@123",
            },
        });

        const currentDate = moment();

        const query = `
            SELECT a.VehicleNumber, a.polluctionexpiry, b.Email 
            FROM vehicleDetails a 
            LEFT JOIN VendorsCompanyDetails b ON a.CD_ID = b.CD_ID 
            WHERE a.VehicleNumber IS NOT NULL 
              AND a.polluctionexpiry BETWEEN GETDATE() AND DATEADD(DAY, 30, GETDATE());
        `;

        const expiryDetails = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT,
        });

        if (!expiryDetails || expiryDetails.length === 0) {
            console.log("No expiry details found for the current date.");
            return;
        }

        for (const detail of expiryDetails) {
            console.log("Processing detail:", detail);
            const { VehicleNumber,polluctionexpiry, Email } = detail;

            if (polluctionexpiry) {
                const recipientEmail = Email ;
                const mailOptions = {
                    from: "contact@infologia.in",
                    to: recipientEmail,
             //       cc:"rajasekar@skybtrans.com ,shankar@skybtrans.com, Yogapraveen@skybtrans.com",
                    subject: "Expiry Date Alert",
                    html: `
                        <div>
                            <h1>Expiry Date Alert</h1>
                            <p>Dear Sir/Madam,</p>
                            <p>Vehicle Number: <b>${VehicleNumber}</b></p>
                            <p>Polluctionexpiry: <b>${moment(polluctionexpiry).format("DD/MM/YYYY")}</b></p>
                            <p>Please take necessary actions to renew the pollutionCertificate.</p>
                            <p>Warm Regards,<br>Infologia Technologies PVT. LTD.</p>
                        </div>
                    `,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`Email sent for Vehicle: ${VehicleNumber}`);
                } catch (emailError) {
                    console.error(`Error sending email for Vehicle: ${VehicleNumber}`, emailError.message);
                }
            }
        }

        console.log("Expiry date checks completed.");
    } catch (error) {
        console.error("Error in checkExpiryDates:", error.message);
    }




}
router.get('/CheckEmailExists', verifytoken, async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({
      response_code: "400",
      response_message: "Email is required.",
    });
  }

  try {
    const query = `
      SELECT COUNT(*) AS Count 
      FROM UserLoginDetails 
      WHERE LOWER(Email) = LOWER(:email)
    `;

    const result = await db.sequelize.query(query, {
      replacements: { email },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    const exists = result[0].Count > 0;

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      exists,
    });

    console.log("✅ Email validation check executed successfully:", email);
  } catch (error) {
    console.error("❌ Error checking email:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error",
    });
  }
});
setInterval(checkExpiryDatespollution, 86400000);

module.exports = router;