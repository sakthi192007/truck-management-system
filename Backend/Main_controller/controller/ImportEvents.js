
const express = require('express');
const { parseISO } = require('date-fns');
const router = express.Router();
const db = require('../../config/dbconnection');
const sequelize = db.sequelize;
const LoginDetails = db.LoginDetails;
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
var upload = multer({ storage: storage }).single('file');

router.post('/Events', verifytoken, async function(req, res, next) {
    const Evdata = req.body;
    
    const jsondata = Evdata.eventdata;
    const clientEmailId = Evdata.emaildetails;
    const bookingnumber = Evdata.bookingnum;
    const names = Evdata.name;

    try {

        for (var e = 0; e < jsondata.length; e++) {
            let Actual = jsondata[e].Actual;
            let Milestones = jsondata[e].Milestones;
            let containerId = jsondata[e].containerId;
            let Department = 2;
        
            const isValidDate = (date) => {
                return !isNaN(Date.parse(date));
            };
        
            if (isValidDate(Actual)|| Actual === null) {
                db.sequelize.query(
                    "select count(Status) as Status from Eventslog where Department = ? and BookingNo = CAST(? AS nvarchar) and ContainerNo = CAST(? AS nvarchar) and Milestone = CAST(? AS nvarchar)",
                    { 
                        replacements: [Department, bookingnumber, containerId, Milestones], 
                        type: db.Sequelize.QueryTypes.SELECT 
                 
                    }
                )
                .then((data) => {
                    if (data[0].Status === 0) {
                        db.sequelize.query(
                            "INSERT INTO Eventslog (Department, BookingNo, ContainerNo, Milestone, Status) VALUES ( ?, ?, ?, ?, ?)",
                            { 
                                replacements: [Department, bookingnumber, containerId, Milestones, '1'], 
                                type: db.Sequelize.QueryTypes.INSERT 
                            }
                        )
                        .then(() => {
                            sendEmailNotification(bookingnumber, containerId, Milestones,Actual,names,clientEmailId);
        
                            res.status(200).send({
                                response_code: "200",
                                response_message: "Record inserted and email sent successfully."
                            });
                            winston.info("New record inserted into Eventslog and email sent.");
                            return; 
                        })
                        .catch(error => {
                            console.error("Error inserting into Eventslog:", error);
                            res.status(500).send({
                                response_code: "500",
                                response_message: "Error inserting into Eventslog."
                            });
                            return; 
                        });
                    } else {
                        res.status(200).send({
                            response_code: "200",
                            response_message: "No insertion needed, Status already exists."
                        });
                        return; 
                    }
                })
                .catch(error => {
                    console.error("Error fetching Status count:", error);
                    res.status(500).send({
                        response_code: "500",
                        response_message: "Internal Server Error"
                    });
                });
            }
        }

        for (var i = 0; i < jsondata.length; i++) {
            let ADTs ="";
            const EDTs = new Date(jsondata[i].Estimate).toISOString().slice(0, 19).replace('T', ' ');
            const isValidDate = (date) => {
                return !isNaN(Date.parse(date));
            };
            if (isValidDate(jsondata[i].Actual)) {
                ADTs = new Date(jsondata[i].Actual).toISOString().slice(0, 19).replace('T', ' ');
            } else {
                ADTs = null;
            }

            var sql = "INSERT INTO ImportMilestonesStatusList (containerNumber,milestones,EDT,ADT) VALUES (?,?,?,?)";
            db.sequelize.query(sql, {
                replacements: [jsondata[i].containerId,jsondata[i].Milestones,EDTs,ADTs],
                type: db.sequelize.QueryTypes.INSERT
            }).then((data) => {
        
                winston.info("postEventsList/data" + data);
               const response = CF.getStandardResponse(201, "Booking postEventslist successfully");
              res.status(201).send(response);
        
            }).catch((err) => {
                winston.error("postEvents" + err);
                var response = CF.getStandardResponse(500, "Something went wrong.");
                return res.status(500).send(response);
            });
        
        }

    } catch (err) {
        winston.error('postEvents: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.put('/items/:id', verifytoken, async function(req, res, next) {
    const id = req.params.id;
    const Evdata = req.body;

    const jsondata = Evdata.eventdata;
    const clientEmailId = Evdata.emaildetails;
    const bookingnumber = Evdata.bookingnum;
    const names = Evdata.name;
    const Department = 1;

    try {
        // Validate date
        const isValidDate = (date) => !isNaN(Date.parse(date));

        // Format date without UTC shift
        function formatDateLocal(dateString) {
            if (!isValidDate(dateString)) return null;
            let d = new Date(dateString);
            return (
                d.getFullYear() + "-" +
                String(d.getMonth() + 1).padStart(2, "0") + "-" +
                String(d.getDate()).padStart(2, "0") + " " +
                String(d.getHours()).padStart(2, "0") + ":" +
                String(d.getMinutes()).padStart(2, "0") + ":" +
                String(d.getSeconds()).padStart(2, "0")
            );
        }

        // Insert events into Eventslog
        let eventPromises = jsondata.map(event => {
            let { Actual, Milestones, containerId } = event;

            if (isValidDate(Actual) || Actual === null) {
                return db.sequelize.query(
                    `SELECT COUNT(Status) AS Status 
                     FROM Eventslog 
                     WHERE Department = ? AND BookingNo = CAST(? AS nvarchar) 
                       AND ContainerNo = CAST(? AS nvarchar) 
                       AND Milestone = CAST(? AS nvarchar)`,
                    { 
                        replacements: [Department, bookingnumber, containerId, Milestones], 
                        type: db.Sequelize.QueryTypes.SELECT 
                    }
                )
                .then(data => {
                    if (data[0].Status === 0) {
                        return db.sequelize.query(
                            "INSERT INTO Eventslog (Department, BookingNo, ContainerNo, Milestone, Status) VALUES (?, ?, ?, ?, ?)",
                            { 
                                replacements: [Department, bookingnumber, containerId, Milestones, '1'], 
                                type: db.Sequelize.QueryTypes.INSERT 
                            }
                        ).then(() => {
                            sendEmailNotification(bookingnumber, containerId, Milestones, Actual, names, clientEmailId);
                            winston.info("New record inserted into Eventslog and email sent.");
                        });
                    }
                });
            }
        });
  
        await Promise.all(eventPromises);

        // Delete old import milestones
        await db.sequelize.query(
            "DELETE FROM ImportMilestonesStatusList WHERE containerNumber = :id",
            { 
                replacements: { id: id }, 
                type: db.Sequelize.QueryTypes.DELETE 
            }
        );

        // Insert new milestones (fixed datetime)
        let milestonePromises = jsondata.map(event => {
            let ADTs = formatDateLocal(event.Actual);
            let EDTs = formatDateLocal(event.Estimate);

            if (event.containerId && event.Milestones && EDTs) {
                return db.sequelize.query(
                    "INSERT INTO ImportMilestonesStatusList (containerNumber, milestones, EDT, ADT) VALUES (?, ?, ?, ?)",
                    { 
                        replacements: [event.containerId, event.Milestones, EDTs, ADTs], 
                        type: db.Sequelize.QueryTypes.INSERT 
                    }
                );
            } else {
                winston.error("Missing data for insertion: ", event);
            }
        });

        await Promise.all(milestonePromises);

        // Final response
        res.status(200).send({
            response_code: "200",
            response_message: "Records processed and updated successfully."
        });

    } catch (err) {
        winston.error('putBooking: ' + err);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    }
});
// router.put('/items/:id', verifytoken, async function(req, res, next) {
//     const id = req.params.id;
//     const Evdata = req.body;

//     const jsondata = Evdata.eventdata;
//     const clientEmailId = Evdata.emaildetails;
//     const bookingnumber = Evdata.bookingnum;
//     const names = Evdata.name;
//     var customer="";

    
//     try {
     

//     const isValidDate = (date) => !isNaN(Date.parse(date));
    

//         let eventPromises = jsondata.map(event => {
//             let { Actual, Milestones, containerId } = event;
//             const Department = 1;

//             if (isValidDate(Actual) || Actual === null) {
//                 return db.sequelize.query(
//                     "SELECT COUNT(Status) AS Status FROM Eventslog WHERE Department = ? AND BookingNo = CAST(? AS nvarchar) AND ContainerNo = CAST(? AS nvarchar) AND Milestone = CAST(? AS nvarchar)",
//                     { 
//                         replacements: [Department, bookingnumber, containerId, Milestones], 
//                         type: db.Sequelize.QueryTypes.SELECT 
//                     }
//                 )
//                 .then(data => {
//                     if (data[0].Status === 0) {
//                         return db.sequelize.query(
//                             "INSERT INTO Eventslog (Department, BookingNo, ContainerNo, Milestone, Status) VALUES (?, ?, ?, ?, ?)",
//                             { 
//                                 replacements: [Department, bookingnumber, containerId, Milestones, '1'], 
//                                 type: db.Sequelize.QueryTypes.INSERT 
//                             }
//                         ).then(() => {
                            
//                             sendEmailNotification(bookingnumber, containerId, Milestones, Actual, names, clientEmailId);
//                             winston.info("New record inserted into Eventslog and email sent.");
//                         });
//                     }
//                 });
//             }
//         });
  
//         await Promise.all(eventPromises);

//         await db.sequelize.query(
//             "DELETE FROM ImportMilestonesStatusList WHERE containerNumber = :id",
//             { 
//                 replacements: { id: id }, 
//                 type: db.Sequelize.QueryTypes.DELETE 
//             }
//         );

//         // Insert new milestones
//         let milestonePromises = jsondata.map(event => {
//             let ADTs = isValidDate(event.Actual) ? new Date(event.Actual).toISOString().slice(0, 19).replace('T', ' ') : null;
//             let EDTs = new Date(event.Estimate).toISOString().slice(0, 19).replace('T', ' ');

//             if (event.containerId && event.Milestones && EDTs) {
//                 return db.sequelize.query(
//                     "INSERT INTO ImportMilestonesStatusList (containerNumber, milestones, EDT, ADT) VALUES (?, ?, ?, ?)",
//                     { 
//                         replacements: [event.containerId, event.Milestones, EDTs, ADTs], 
//                         type: db.Sequelize.QueryTypes.INSERT 
//                     }
//                 );
//             } else {
//                 winston.error("Missing data for insertion: ", event);
//             }
//         });

//         await Promise.all(milestonePromises);

//         // Send a single success response after all operations
//         res.status(200).send({
//             response_code: "200",
//             response_message: "Records processed and updated successfully."
//         });

//     } catch (err) {
//         winston.error('putBooking: ' + err);
//         res.status(500).send({
//             response_code: "500",
//             response_message: "Internal Server Error"
//         });
//     }
// });
async function sendEmailNotification(bookingNo, containerId, milestone, Actual, names, email, res) {
    try {
       
        const milestoneData = await db.sequelize.query(
            "select milestones from ImportMilestones where IM_id=?",
            {
                replacements: [milestone],
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (!milestoneData || milestoneData.length === 0) {
            return res.status(404).send({ message: "Milestone not found" });
        }

        const milestoneName = milestoneData[0].milestones;

     
        const adminData = await db.sequelize.query(
            "SELECT Email FROM UserLoginDetails WHERE User_Roleid=?",
            {
                replacements: [0], 
                type: db.Sequelize.QueryTypes.SELECT,
            }
        );

        if (!adminData || adminData.length === 0) {
            return res.status(404).send({ message: "No admin emails found" });
        }

      
        const adminEmails = adminData.map((admin) => admin.Email);
        const Detailsdata = await getdatas(bookingnumber);
        let arrayadd = Detailsdata.inforadd.map(i => ({
            numberoftype: i.numberoftype,
            CargoWeight: i.CargoWeight,
            numbercontainer: i.numberoftype + ' * ' + i.generalType + ' ',
        }));
         db.sequelize.query(
                "select CustomerAddress,b.Ml_LocationName as locationName,De_Stuffing_Location,LinearBkgno, c.SealNumber from Import_Bookings a left join MasterLocation b on a.PortOfDischarge = b.Ml_key left outer join IB_ItemDetails c on a.IB_id=c.IB_id where BookingNumber='"+bookingnumber+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
            )
            .then((booking) =>{
                console.log(adminEmails);
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
                    to: email,
                    //cc:"rajasekar@skybtrans.com ,shankar@skybtrans.com, Yogapraveen@skybtrans.com",
                    subject: "Milestone Status Alert",
                    html: "<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <style> body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 10px 0; } .header h1 { margin: 0; color: #333333; } .content { padding: 20px 0; line-height: 1.6; } .content p { margin: 0 0 10px; } .footer { text-align: center; padding: 10px 0; color: #888888; } </style> </head> <body> <div class='container'> <div class='header'> <h1 style='text-transform: uppercase;'>milestone status</h1> </div> <div class='content'> <p> Dear Sir / Madam,</p> <p>Thank you for your booking! Exciting Milestone Update Inside.</p> <p><strong>Booking Details:</strong></p> <p >Infologia Booking No:<span style='text-transform: uppercase;'>&nbsp;&nbsp;" + bookingNo + "</span></p><p>Booking From: "+ names +"</p><p>Actual Shipper: "+booking[0].CustomerAddress+"</p><p>Port of Loading: "+booking[0].locationName+"</p><p>S/L Booking No: "+booking[0].LinearBkgno+"</p><p>SealNo: "+booking[0].SealNumber+"</p><p><strong>Cargo Weigth:</strong> "+arrayadd[0].CargoWeight+"</p><p><strong>Container Type:</strong> "+arrayadd.map(item => item.numbercontainer).join(", ")+"</p> <p >ContainerNo:<span style='text-transform: uppercase;'>&nbsp;&nbsp;" + containerId + "</span></p> <p>Milestone:&nbsp;&nbsp;" + milestoneName + "</p> <p>Date:&nbsp;&nbsp;" + Actual + "</p> <p>We look forward to seeing you!</p> <p>If you have any questions or need further assistance, feel free to reach out Customer Service representative of Infologia Technologies.</p> <p>Warm Regards,<br> Infologia Technologies PVT. LTD.</p> </div> <div class='footer'> <p>&copy; 2024 Sky B Trans. All rights reserved.</p> </div> </div> </body> </html>",
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                        res.status(500).send({ message: "Failed to send email", error: error.message });
                    } else {
                        console.log("Email sent: " + info.response);
                        res.status(200).send({ message: "Mail sent", message_id: info.response });
                    }
                });
            })
    } catch (error) {
        console.error("Error in sendEmailNotification:", error);
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
}
router.get("/mile/:id", verifytoken, function(req, res, next) {
     const id = req.params.id;
    db.sequelize.query(
            "select * from ImportMilestonesStatusList where containerNumber='"+id+"' order by milestones asc", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Booking");
        })
        .catch(error => {
            console.error("Error fetching User details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/container/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
            "select LineItem_id,containernumber from IB_ItemDetails where IB_id="+id+"", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Booking");
        })
        .catch(error => {
            console.error("Error fetching User details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/allbooked/:id/:role", verifytoken, function(req, res, next) {

    const id = req.params.id;
    const role = req.params.role;

    var custoquery = "";

    if (role == 0) {
        custoquery = " where a.status !='0' ";
    } else {
        custoquery = " where a.status !='0' ";
    }

    db.sequelize.query(
            "select g.IM_id,g.milestones, b.Email,a.IB_id,BookingNumber,upper(b.UserName) as name,a.ContainerPickUpDate, a.CustomerAddress,c.Ml_LocationName as locationName,e.Ml_LocationName as CFS,a.status from Import_Bookings a left outer join UserLoginDetails b on a.CustomerName=b.User_ID left outer join MasterLocation c on a.PortOfDischarge=c.Ml_key left outer join MasterLocation e on a.PointOfClearance=e.Ml_key left outer join IB_ItemDetails d on a.IB_id=d.IB_id left outer join ImportMilestonesStatusList f on d.LineItem_id= f.containerID left outer join ImportMilestones g on f.milestones=g.IM_id"+ custoquery +"", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
async function getdatas(BookingNumber) {

    try {
        let queryString = "";
        
            queryString = "WITH CTE_Subquery AS (SELECT count(b.containernumber) as numberoftype, c.generalType, SUM(b.CargoWeight) AS CargoWeight, b.WeightTypes FROM Import_Bookings a INNER JOIN IB_ItemDetails b ON a.IB_id = b.IB_id INNER JOIN general c ON b.ContainerTypes = c.G_key LEFT JOIN MasterLocation d ON b.DE_StuffingLocation = d.Ml_key LEFT JOIN MasterLocation e ON b.ContainerPickupLocation = e.Ml_key WHERE c.generalType LIKE '%40%' AND a.BookingNumber ='"+BookingNumber+"' GROUP BY c.generalType, b.WeightTypes UNION ALL SELECT count(b.containernumber) as numberoftype, c.generalType, SUM(b.CargoWeight) AS CargoWeight, b.WeightTypes FROM Import_Bookings a INNER JOIN IB_ItemDetails b ON a.IB_id = b.IB_id INNER JOIN general c ON b.ContainerTypes = c.G_key LEFT JOIN MasterLocation d ON b.DE_StuffingLocation = d.Ml_key LEFT JOIN MasterLocation e ON b.ContainerPickupLocation = e.Ml_key WHERE c.generalType LIKE '%20%' AND a.BookingNumber ='"+BookingNumber+"' GROUP BY c.generalType, b.WeightTypes ), final as ( SELECT DISTINCT numberoftype, generalType, SUM(CargoWeight) AS CargoWeight, WeightTypes FROM CTE_Subquery GROUP BY generalType,numberoftype, WeightTypes ) select numberoftype,generalType,CargoWeight,WeightTypes from final GROUP BY CargoWeight, WeightTypes,generalType,numberoftype";
    
        
        const query1 = queryString;

       
        const inforadd = await db.sequelize.query(query1);

       
        return { inforadd: inforadd[0] }; 
    } catch (err) {
        console.error('Error executing queries:', err);
        throw err;
    }
   
}
async function processBookingData(id) {
    try {
        const Detailsdata = await getdatas(id);

        if (!Array.isArray(Detailsdata)) {
            throw new Error("Expected Detailsdata to be an array, but got:", Detailsdata);
        }

        let arrayadd = Detailsdata.map(i => ({
            numberoftype: i.numberoftype,
            numbercontainer: `${i.numberoftype} * ${i.generalType}`,
        }));

        console.log("Processed Data:", arrayadd);

        return `<p><strong>Container Type:</strong> ${arrayadd.map(item => item.numberoftype).join(", ")}</p>`;
    } catch (err) {
        console.error("Error processing booking data:", err);
    }
}

module.exports = router;