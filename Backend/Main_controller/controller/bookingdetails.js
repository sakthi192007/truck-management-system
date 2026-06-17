const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const bookingdetails = db.bookingdetails;
const clientdetails = db.clientdetails;
const vehicleDetails = db.vehicleDetails;
const nodemailer = require('nodemailer');
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const { storage } = require('../../middlewares/storage');
var upload = multer({ storage: storage }).single('file');
const moment = require('moment');

router.post('/', verifytoken, async function (req, res, next) {
    const uploadedFile = req.files;
    const jsondata = req.body;
    try {
        const containerDate = new Date(jsondata.container_date).toISOString().slice(0, 19).replace('T', ' ');
        const staffingactualtime = new Date(jsondata.staffingactualtime).toISOString().slice(0, 19).replace('T', ' ');
        const staffingestimatetime = new Date(jsondata.staffingestimatetime).toISOString().slice(0, 19).replace('T', ' ');
        const emptyestimatetime = new Date(jsondata.emptyestimatetime).toISOString().slice(0, 19).replace('T', ' ');
        const emptyactualtime = new Date(jsondata.emptyactualtime).toISOString().slice(0, 19).replace('T', ' ');
        const customs_date = new Date(jsondata.customs_date).toISOString().slice(0, 19).replace('T', ' ');


        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const cro_fle = uploadedFile && uploadedFile.crofle ? `CRO_${formattedDate}_${uploadedFile.crofle.name}` : null;
        const from_13 = uploadedFile && uploadedFile.from13 ? `FRO_${formattedDate}_${uploadedFile.from13.name}` : null;



        var sql = "INSERT INTO bookingRegisters (Customer,customer_add,container_date,staffing,staffingactualtime,staffingestimatetime,emptyContain,emptyestimatetime,emptyactualtime,pointclearance,customs_date,portLoading,Container_type,noofcontainer_type,cargoweight,cargokgslbs,special_integration,commodity,status,crofle,Form13) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        db.sequelize.query(sql, {
            replacements: [jsondata.Customer, jsondata.customer_add, containerDate, jsondata.staffing, staffingactualtime, staffingestimatetime, jsondata.emptycontainepick, emptyestimatetime, emptyactualtime, jsondata.pointclearance, customs_date, jsondata.portLoading, jsondata.Container_type, jsondata.noofcontainer_type, jsondata.cargoweight, jsondata.cargokgslbs, jsondata.special_integration, jsondata.commodity, jsondata.status, cro_fle, from_13],
            type: db.sequelize.QueryTypes.INSERT
        }).then((data) => {
            const saveFile = (file, fileName) => {
                const destination = `./public/booking/${fileName}`;
                console.log(destination);
                fs.writeFile(destination, file.data, function (err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                    }
                    console.log(`File ${fileName} saved successfully.`);
                });
            };
            for (const fieldName in uploadedFile) {
                if (fieldName === "crofle") {
                    const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
                    const newFileName = `CRO_${formattedDate}_${uploadedFile.crofle.name}`;
                    saveFile(uploadedFile.crofle, newFileName);
                } else if (fieldName === "from13") {
                    const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
                    const newFileName = `FRO_${formattedDate}_${uploadedFile.from13.name}`;
                    saveFile(uploadedFile.from13, newFileName);
                }
            }
            winston.info("postbooking/data" + data);
            const response = CF.getStandardResponse(201, "Booking created successfully");
            res.status(201).send(response);
        }).catch((err) => {
            winston.error("postbooking" + err);
            var response = CF.getStandardResponse(500, "Something went wrong.");
            return res.status(500).send(response);
        });


    } catch (err) {
        winston.error('postBookingDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});


router.put('/update/:id', verifytoken, async function (req, res, next) {
    const uploadedFile = req.files;
    const id = req.params.id;
    const jsondata = req.body;

    try {
        const containerDate = new Date(jsondata.container_date).toISOString().slice(0, 19).replace('T', ' ');
        const staffingactualtime = new Date(jsondata.staffingactualtime).toISOString().slice(0, 19).replace('T', ' ');
        const staffingestimatetime = new Date(jsondata.staffingestimatetime).toISOString().slice(0, 19).replace('T', ' ');
        const emptyestimatetime = new Date(jsondata.emptyestimatetime).toISOString().slice(0, 19).replace('T', ' ');
        const emptyactualtime = new Date(jsondata.emptyactualtime).toISOString().slice(0, 19).replace('T', ' ');
        const customs_date = new Date(jsondata.customs_date).toISOString().slice(0, 19).replace('T', ' ');

        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const cro_fle = uploadedFile && uploadedFile.crofle ? `CRO_${formattedDate}_${uploadedFile.crofle.name}` : null;
        const from_13 = uploadedFile && uploadedFile.from13 ? `FRO_${formattedDate}_${uploadedFile.from13.name}` : null;

        let setClause = `
        Customer = :Customer,
        customer_add = :customer_add,
        container_date = :container_date,
        staffing = :staffing,
        staffingactualtime = :staffingactualtime,
        staffingestimatetime = :staffingestimatetime,
        emptyContain = :emptyContain,
        emptyestimatetime = :emptyestimatetime,
        emptyactualtime = :emptyactualtime,
        pointclearance = :pointclearance,
        customs_date = :customs_date,
        portLoading = :portLoading,
        Container_type = :Container_type,
        noofcontainer_type = :noofcontainer_type,
        cargoweight = :cargoweight,
        cargokgslbs = :cargokgslbs,
        special_integration = :special_integration,
        commodity = :commodity
    `;

        if (cro_fle) {
            setClause += `, crofle = :crofle`;
        }
        if (from_13) {
            setClause += `, from13 = :from13`;
        }
        await db.sequelize.query(`
        UPDATE bookingRegisters 
        SET ${setClause}
        WHERE BR_key = :id
    `, {
            replacements: {
                Customer: jsondata.Customer,
                customer_add: jsondata.customer_add,
                container_date: containerDate,
                staffing: jsondata.staffing,
                staffingactualtime: staffingactualtime,
                staffingestimatetime: staffingestimatetime,
                emptyContain: jsondata.emptycontainepick,
                emptyestimatetime: emptyestimatetime,
                emptyactualtime: emptyactualtime,
                pointclearance: jsondata.pointclearance,
                customs_date: customs_date,
                portLoading: jsondata.portLoading,
                Container_type: jsondata.Container_type,
                noofcontainer_type: jsondata.noofcontainer_type,
                cargoweight: jsondata.cargoweight,
                cargokgslbs: jsondata.cargokgslbs,
                special_integration: jsondata.special_integration,
                commodity: jsondata.commodity,
                ...(cro_fle && { crofle: cro_fle }),
                ...(from_13 && { from13: from_13 }),
                id: id
            },
            type: db.sequelize.QueryTypes.UPDATE
        });



        const saveFile = (file, fileName) => {
            const destination = `./public/booking/${fileName}`;
            console.log(destination);
            fs.writeFile(destination, file.data, function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };
        for (const fieldName in uploadedFile) {
            if (fieldName === "crofle") {

                const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
                const newFileName = `CRO_${formattedDate}_${uploadedFile.crofle.name}`;
                saveFile(uploadedFile.crofle, newFileName);
            } else if (fieldName === "from13") {
                const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
                const newFileName = `FRO_${formattedDate}_${uploadedFile.from13.name}`;
                saveFile(uploadedFile.from13, newFileName);
            }
        }
        const response = CF.getStandardResponse(201, "booking Update successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('putBookingDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

router.get("/update/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    bookingdetails.findByPk(id).then((data) => {
        if (!data) {
            var response = CF.getStandardResponse(401, "Booking Details not found");
            return res.status(401).send(response);
        } else {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            }).catch((err) => {
                winston.error("/getBooking Details" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            });
            winston.info("getBooking Details");
        }
    });
});
router.get("/getall/:id/:role", verifytoken, function (req, res, next) {
    const id = req.params.id;
    const role = req.params.role;

    var custoquery = "";

    if (role == 0) {
        custoquery = " where a.status='0'";
    } else {
        custoquery = " where a.status='0' and a.Customer='" + id + "'";
    }

    db.sequelize.query(
        "select m.VehicleNumber,f.name as portname,e.generalType,c.UserName as name,a.*  from bookingRegisters a left join UserLoginDetails c on a.Customer=c.User_ID left join general e on a.Container_type=e.G_key left outer join all_portLoading f on a.portLoading=f.P_key left outer join vehicleDetails m on a.Container_type=m.TypeofContainers " + custoquery + " ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/allbooked/:id/:role", verifytoken, function (req, res, next) {

    const id = req.params.id;
    const role = req.params.role;

    var custoquery = "";

    if (role == 0) {
        custoquery = " where a.status='1'";
    } else {
        custoquery = " where a.status='1' and a.Customer='" + id + "'";
    }

    db.sequelize.query(
        "select m.VehicleNumber,f.name as portname,e.generalType,c.UserName as name,a.*  from bookingRegisters a left join UserLoginDetails c on a.Customer=c.User_ID left join general e on a.Container_type=e.G_key left outer join all_portLoading f on a.portLoading=f.P_key left outer join vehicleDetails m on a.Container_type=m.TypeofContainers  " + custoquery + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Booked");
        })
        .catch(error => {
            console.error("Error fetching Booked:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/getvendor", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select  a.CD_ID,a.CompanyName from VendorsCompanyDetails a left join vehicleDetails c on a.CD_ID=c.CD_ID where c.booking_status='0' union all select  a.CD_ID,a.CompanyName from VendorsCompanyDetails a left join AdditionalvehicleDetails c on a.CD_ID=c.CD_ID where c.booking_status='0'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

router.get("/getavailables/:id", verifytoken, function (req, res, next) {
    var id = req.params.id;
    db.sequelize.query(
        "select count(TypeofContainers)as countContainers  from vehicleDetails where TypeofContainers='" + id + "' ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("generalType");
        })
        .catch(error => {
            console.error("Error fetching generalType:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getgenerel/:id", verifytoken, function (req, res, next) {
 var id = req.params.id;
    db.sequelize.query(
        "select G_key,generalType from general", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("generalType");
        })
        .catch(error => {
            console.error("Error fetching generalType:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/Staffing/:id", verifytoken, function (req, res, next) {
        var id = req.params.id;
    db.sequelize.query(
      "EXEC Staffing_list @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("generalType");
        })
        .catch(error => {
            console.error("Error fetching generalType:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/pointofclear/:id", verifytoken, function (req, res, next) {
     var id = req.params.id;
    db.sequelize.query(
       "EXEC pointofclear_list @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("generalType");
        })
        .catch(error => {
            console.error("Error fetching generalType:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/email/:status/:id/:values/:containerdate/:name/:Bookingno", verifytoken, async function (req, res, next) {
    var id = req.params.id;
    const status = req.params.status;
    const vehicleno = req.params.values;
    const containerdate = req.params.containerdate;
    const Bookingno = req.params.Bookingno;
    const name = req.params.name;
    console.log(vehicleno);
    let message = 'mail send';
    try {
        var updatedCompany = await bookingdetails.update({
            status: 1,
            Bookingno: Bookingno,
        }, {
            where: { BR_key: status }
        });

        const vehicledetailsdata = await vehicleDetails.update({ booking_status: 1 }, { where: { VehicleNumber: vehicleno } });

        if (vehicledetailsdata[0] === 0) {
            console.log(`No record found with VehicleNumber: ${vehicleno}`);
        } else {
            console.log(`Successfully updated booking_status for VehicleNumber: ${vehicleno}`);
        }

        var transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 587,
            auth: {
                user: "contact@infologia.in",
                pass: "Welcome@123"
            }
        });



        var mailOptions = {
            from: "contact@infologia.in",
            to: 'info@infologia.in',
            subject: "booking confirmation",
            html: "<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <style> body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 10px 0; } .header h1 { margin: 0; color: #333333; } .content { padding: 20px 0; line-height: 1.6; } .content p { margin: 0 0 10px; } .footer { text-align: center; padding: 10px 0; color: #888888; } </style> </head> <body> <div class='container'> <div class='header'> <h1>Booking Confirmation</h1> </div> <div class='content'> <p>Dear " + name + ",</p> <p>Thank you for your booking! We are pleased to confirm your reservation.</p> <p><strong>Booking Details:</strong></p>  <p >Booking ID:<span style='text-transform: uppercase;'>" + Bookingno + "</span></p> <p>Date:" + containerdate + "</p> <p>We look forward to seeing you!</p> <p>If you have any questions or need further assistance, please contact us.</p> <p>Best regards,<br>Your Company Name</p> </div> <div class='footer'> <p>&copy; 2024 Sky B Trans. All rights reserved.</p> </div> </div> </body> </html>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send({ message: "Failed to send email", error: error.message });
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).send({ message: "Mail sent", message_id: info.response });
            }
        });

    } catch (err) {
        console.error('Email: ' + err);
        res.status(500).send({ message: "Something went wrong", error: err.message });
    }
});
router.get("/gettoecontaine/:id/:role", verifytoken, function (req, res, next) {
    const id = req.params.id;


    db.sequelize.query(
        "EXEC dashboad20ft @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getforcontaine/:id/:role", verifytoken, function (req, res, next) {
    const id = req.params.id;

    db.sequelize.query(
        "EXEC dashboad40ft @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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


router.get("/getMile", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select EM_id,milestones from ExportMilestones", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/imgetMile", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select IM_id,milestones from ImportMilestones", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

router.get("/getcustomer/:userId/:RoleId", verifytoken, function (req, res, next) {
    var id = req.params.userId;
    const role = req.params.RoleId;

    db.sequelize.query(
        "EXEC Clientlist @LoginUserID='" + id + "'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/imgetcustomer/:userId/:RoleId", verifytoken, function (req, res, next) {
    var id = req.params.userId;
    const role = req.params.RoleId;

    var custoquery = "";

    if (role == 0) {
        custoquery = " SKY_CreateClients  a left outer join UserLoginDetails b on a.Client_Id=b.User_ID where a.Department !='1' and a.CompanyName is not null";
    } else {
        custoquery = " SKY_CreateClients  a left outer join UserLoginDetails b on a.Client_Id=b.User_ID where a.Department !='1' and a.CompanyName is not null and a.CreatedBy ='" + id + "'";
    }

    db.sequelize.query(
        "select a.CompanyName as UserName,a.Client_Id,a.Email from " + custoquery + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/getvendordata/:id", verifytoken, function (req, res, next) {
    var id = req.params.id;
    db.sequelize.query(
        "EXEC Vendorlist @LoginUserID='" + id + "' ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("generalType");
        })
        .catch(error => {
            console.error("Error fetching generalType:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getshiperdata/:id", verifytoken, function (req, res, next) {
      var id = req.params.id;
    db.sequelize.query(
        "EXEC Shipper_Consignee @LoginUserID='" + id + "' ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("generalType");
        })
        .catch(error => {
            console.error("Error fetching generalType:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getshiperdata/:id", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select Ml_key,Ml_LocationName from MasterLocation where Ml_LocationType='Shipper / Consignee'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("generalType");
        })
        .catch(error => {
            console.error("Error fetching generalType:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});



module.exports = router;
