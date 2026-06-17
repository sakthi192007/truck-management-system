const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const jwt = require('jsonwebtoken');

// Assuming verifytoken is defined and working properly
const verifytoken = require('../../middlewares/verifytoken');

router.get("/invoicegrid", function (req, res) {
  const query = "SELECT e.locationName as PortOfDischarge_name ,d.LocationName as pointofClearance_LocationName,b.CompanyName as Customer_Name,c.LocationName as CFS_LocationName,a.* FROM Export_Bookings a left join SKY_CreateClients b on a.CustomerName=b.Client_Id left join ICD_Details c on a.CFS=c.ICD_key left join ICD_Details d on a.PointOfClearance=d.ICD_key left join location e on a.PortOfDischarge=e.L_key";

  db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT })
    .then(data => {
      res.status(200).send({
        response_code: "200",
        response_message: "Success",
        data
      });
      winston.info("Invoice details fetched successfully");
    })
    .catch(error => {
      console.error("Error fetching Invoice details:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error"
      });
    });
});

// New route for import_booking
router.get("/import_booking", function (req, res) {
    const query = "SELECT * FROM Import_Bookings";  // Modify query to match your DB structure
  
    db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT })
      .then(data => {
        res.status(200).send({
          response_code: "200",
          response_message: "Success",
          data
        });
        winston.info("Import booking details fetched successfully");
      })
      .catch(error => {
        console.error("Error fetching Import booking details:", error);
        res.status(500).send({
          response_code: "500",
          response_message: "Internal Server Error"
        });
      });
  });

router.get("/Import/getall/:id/:role", function(req, res, next) {
    const id = req.params.id;
    const role = req.params.role;

    var subquery = "";

    if (role == 0) {
        subquery =   "a.DONo,max(a.BookingNumber) as BookingNumber,max(g.IM_id)as IM_id, b.Email,a.IB_id, upper(b.CompanyName) as name,FORMAT(a.ContainerPickUpDate, 'dd-MM-yyyy') AS ContainerPickUpDate, a.CustomerAddress,c.locationName,e.LocationName as CFS,a.status from Import_Bookings a left outer join SKY_CreateClients b on a.CustomerName=b.Client_Id left outer join location c on a.PortOfDischarge=c.L_key left outer join IB_ItemDetails d on a.IB_id=d.IB_id left join ICD_Details e on a.PointOfClearance=e.ICD_key left outer join ImportMilestonesStatusList f on d.containernumber= f.containernumber left outer join ImportMilestones g on f.milestones=g.IM_id where (a.status='1' or a.status='4') group by a.BookingNumber,b.Email,a.IB_id,b.CompanyName, a.ContainerPickUpDate,a.CustomerAddress,c.locationName,e.LocationName,a.status,a.DONo order by a.BookingNumber desc";
    } else {
              subquery ="a.DONo,max(a.BookingNumber) as BookingNumber,max(g.IM_id)as IM_id, b.Email,a.IB_id, upper(b.CompanyName) as name,FORMAT(a.ContainerPickUpDate, 'dd-MM-yyyy') AS ContainerPickUpDate, a.CustomerAddress,c.locationName,e.LocationName as CFS,a.status from Import_Bookings a left outer join SKY_CreateClients b on a.CustomerName=b.Client_Id left outer join location c on a.PortOfDischarge=c.L_key left outer join IB_ItemDetails d on a.IB_id=d.IB_id left join ICD_Details e on a.PointOfClearance=e.ICD_key left outer join ImportMilestonesStatusList f on d.containernumber= f.containernumber left outer join ImportMilestones g on f.milestones=g.IM_id left join driverBookings h on a.BookingNumber=h.BookingNumber where (a.status='1' or a.status='4') and h.Vendor_ID='"+id+"' group by a.BookingNumber,b.Email,a.IB_id,b.CompanyName, a.ContainerPickUpDate,a.CustomerAddress,c.locationName,e.LocationName,a.status,a.DONo order by a.BookingNumber desc";
         
    }

     db.sequelize.query(
            "select "+subquery+"", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
          console.log(data[0].BookingNumber);
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
        }
      ) .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/bookingimportLineItems/:id", function(req, res, next) {
    const id = req.params.id;

    db.sequelize.query(
            "select LineItem_id,IB_id,ContainerTypes,Vehicleno,VendorName,SealNumber,containernumber,CargoWeight,WeightTypes,EmptyReturnAt,DE_StuffingLocation,ContainerPickupLocation from IB_ItemDetails where LineItem_id=" + id + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((Booking) => {
            res.status(200).send({
                        response_code: "200",
                        response_message: "success.",
                        data: Booking
                    });
})
        .catch(error => {
            console.error("Error fetching User details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/getvendordata", function(req, res, next) {
  
    db.sequelize.query(
            "select CD_ID,CompanyName as VendorName from VendorsCompanyDetails", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

router.get("/getgenerel/", function(req, res, next) {

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

router.get("/Geticd", function(req, res, next) {
    db.sequelize.query(
            "select ICD_key,LocationName from ICD_Details", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

router.get("/Import/getlineitems/:id", function(req, res, next) {
    const id = req.params.id;
     db.sequelize.query(
            "select a.LineItem_id,b.CompanyName as vendorName,d.generalType as containerType,containernumber,Vehicleno, c.LocationName as origin,e.LocationName as destination from IB_ItemDetails a left join VendorsCompanyDetails b on a.VendorName=b.CD_ID left join ICD_Details c on a.ContainerPickupLocation=c.ICD_key left join general d on a.ContainerTypes=d.G_key left join ICD_Details e on a.EmptyReturnAt=e.ICD_key where IB_id='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
          console.log(data[0].BookingNumber);
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
        }
      ) .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});


//export
router.get("/Export/getall/:id/:role", function(req, res, next) {
    const id = req.params.id;
    const role = req.params.role;

    var subquery = "";

    if (role == 0) {
        subquery =   "a.LinearBkgno as LinerBookingNumber,max(a.BookingNumber) as BookingNumber,max(g.EM_id)as EM_id, b.Email,a.EB_id,upper(b.CompanyName) as name,FORMAT(a.ContainerPlacementDate, 'dd-MM-yyyy') AS ContainerPickUpDate, a.CustomerAddress,c.locationName,a.CFS as CFS,a.status from Export_Bookings a left outer join SKY_CreateClients b on a.CustomerName=b.Client_Id left outer join location c on a.PortOfDischarge=c.L_key left outer join EB_ItemDetails d on a.EB_id=d.EB_id left outer join ExportMilestonesStatusList f on d.containernumber= f.containernumber left outer join ExportMilestones g on f.milestones=g.EM_id left join driverBookings h on a.BookingNumber=h.BookingNumber where(a.status='1' or a.status='4')  group by a.BookingNumber,b.Email,a.EB_id,b.CompanyName,a.ContainerPlacementDate, a.CustomerAddress,c.locationName,a.CFS,a.status,a.LinearBkgno  order by a.BookingNumber desc";
    } else {
        subquery =   "a.LinearBkgno as LinerBookingNumber,max(a.BookingNumber) as BookingNumber,max(g.EM_id)as EM_id, b.Email,a.EB_id,upper(b.CompanyName) as name,FORMAT(a.ContainerPlacementDate, 'dd-MM-yyyy') AS ContainerPickUpDate, a.CustomerAddress,c.locationName,a.CFS as CFS,a.status from Export_Bookings a left outer join SKY_CreateClients b on a.CustomerName=b.Client_Id left outer join location c on a.PortOfDischarge=c.L_key left outer join EB_ItemDetails d on a.EB_id=d.EB_id left outer join ExportMilestonesStatusList f on d.containernumber= f.containernumber left outer join ExportMilestones g on f.milestones=g.EM_id left join driverBookings h on a.BookingNumber=h.BookingNumber where(a.status='1' or a.status='4') and h.Vendor_ID='"+id+"' group by a.BookingNumber,b.Email,a.EB_id,b.CompanyName,a.ContainerPlacementDate, a.CustomerAddress,c.locationName,a.CFS,a.status,a.LinearBkgno  order by a.BookingNumber desc";

         
    }

     db.sequelize.query(
            "select "+subquery+"", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
          console.log(data[0].BookingNumber);
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
        }
      ) .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/Export/getlineitems/:id", function(req, res, next) {
    const id = req.params.id;
     db.sequelize.query(
            "select a.LItem_id,b.CompanyName as vendorName,d.generalType as containerType,containernumber,Vehicleno, c.LocationName as origin,f.LocationName as destination from EB_ItemDetails a left join VendorsCompanyDetails b on a.VendorName=b.CD_ID left join ICD_Details c on a.EmptyContainerPickup=c.ICD_key left join general d on a.ContainerTypes=d.G_key left join Export_Bookings e on a.EB_id=e.EB_id left join location f on e.PortOfDischarge=f.L_key where a.EB_id='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
          console.log(data[0].BookingNumber);
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
        }
      ) .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/bookingExportLineItems/:id", function(req, res, next) {
    const id = req.params.id;

    db.sequelize.query(
            "select LItem_id,EB_id,ContainerTypes,Vehicleno,VendorName,SealNumber,containernumber, CargoWeight,WeightTypes,EmptyContainerPickup,StuffingLocation from EB_ItemDetails where LItem_id=" + id + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((Booking) => {
            res.status(200).send({
                        response_code: "200",
                        response_message: "success.",
                        data: Booking
                    });
})
        .catch(error => {
            console.error("Error fetching User details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

// router.post('/importEvents', async function(req, res, next) {
//     try {
//         const Evdata = req.body;
//         const jsondata = Evdata.eventdata;
//       const bookingnumber=  jsondata.BookingNo;
//       const IM_id=  jsondata.IM_id;
      
//       const ContainerNo=  jsondata.ContainerNo;
//       const Milestones=  jsondata.Milestones;
//       const Milestones_location=  jsondata.Milestones_location;
//       const ReachedDateTime=  jsondata.ReachedDateTime;
    


// var sql = `
//     UPDATE ImportMilestonesStatusList
//     SET ADT = ?
//     WHERE containerNumber = ? AND milestones = ?
// `;

// db.sequelize.query(sql, {
//     replacements: [ReachedDateTime, ContainerNo, IM_id],
//     type: db.sequelize.QueryTypes.UPDATE
// }).then((data) => {
//     winston.info("updateEventsList/data: " + JSON.stringify(data));
//     const response = CF.getStandardResponse(200, "Milestone updated successfully");
//     res.status(200).send(response);
// }).catch((err) => {
//     winston.error("updateEvents: " + err);
//     const response = CF.getStandardResponse(500, "Something went wrong.");
//     return res.status(500).send(response);
// });


//       const query = "select a.CompanyName,a.CompanyAddress,b.DONo,c.locationName from SKY_CreateClients a left join Import_Bookings b on a.Client_Id=b.CustomerName left join location c on b.PortOfDischarge=c.L_key where b.BookingNumber='"+bookingnumber+"'";

//   db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT })
//     .then(booking => {

//         const query = "select b.generalType,a.SealNumber,a.CargoWeight,a.WeightTypes  from IB_ItemDetails a left join general b on a.ContainerTypes=b.G_key where a.containernumber='"+ContainerNo+"'";

//   db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT })
//     .then(bookingline => {
// const ActualShipper =booking[0].CompanyAddress;
// const Name =booking[0].CompanyName;
// const locationName=booking[0].locationName;
// const DONo=booking[0].DONo;
// const DONoName="DO Number";

// const SealNo =bookingline[0].SealNumber;
// const Containertype =bookingline[0].generalType;
// const CargoWeight=bookingline[0].CargoWeight;
// const WeightTypes=bookingline[0].WeightTypes;

// console.log(bookingnumber,ContainerNo,ActualShipper,Name,locationName,DONo,DONoName,SealNo,Containertype,CargoWeight,WeightTypes,Milestones,Milestones_location,ReachedDateTime);
//          sendEmailNotification(bookingnumber,ContainerNo,ActualShipper,Name,locationName,DONo,DONoName,SealNo,Containertype,CargoWeight,WeightTypes,Milestones,Milestones_location,ReachedDateTime);
//         console.log("Received Event Data:", jsondata);
//          res.status(200).json({ message: "Event data received successfully", data: jsondata });

//     })
//     .catch(error => {
//       console.error("Error fetching Invoice details:", error);
//       res.status(500).send({
//         response_code: "500",
//         response_message: "Internal Server Error"
//       });
//     });
     
//     })
//     .catch(error => {
//       console.error("Error fetching Invoice details:", error);
//       res.status(500).send({
//         response_code: "500",
//         response_message: "Internal Server Error"
//       });
//     });
        
//     } catch (err) {
//         console.error("Error in /importEvents:", err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });
//  async function sendEmailNotification(bookingnumber,ContainerNo,ActualShipper,Name,locationName,DONo,DONoName,SealNo,Containertype,CargoWeight,WeightTypes,Milestones,Milestones_location,ReachedDateTime, res) {
//     try {
       
//          var transporter = nodemailer.createTransport({
//                     host: 'smtp.hostinger.com', 
//                     port: 587, 
//                     auth: {
//                         user: "info@skybtrans.com", 
//                         pass: "Welcome@123" 
//                     }
//                 });
//                 var mailOptions = {
//                     from: "info@skybtrans.com",
//                     to: "manimaranilt@gmail.com",
//                     //cc:"rajasekar@skybtrans.com ,shankar@skybtrans.com, Yogapraveen@skybtrans.com",
//                     subject: "Milestone Status Alert",
//                     html: "<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <style> body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 10px 0; } .header h1 { margin: 0; color: #333333; } .content { padding: 20px 0; line-height: 1.6; } .content p { margin: 0 0 10px; } .footer { text-align: center; padding: 10px 0; color: #888888; } </style> </head> <body> <div class='container'> <div class='header'> <h1 style='text-transform: uppercase;'>milestone status</h1> </div> <div class='content'> <p> Dear Sir / Madam,</p> <p>Thank you for your booking! Exciting Milestone Update Inside.</p> <p><strong>Booking Details:</strong></p> <p>SKYB Booking No:<span style='text-transform: uppercase;'>&nbsp;&nbsp;" + bookingnumber + "</span></p> <p>Booking From: "+ Name +"</p> <p>Actual Shipper: "+ActualShipper+"</p> <p>Port of Loading: "+locationName+"</p> <p>"+DONoName+": "+DONo+"</p> <p>SealNo: "+SealNo+"</p> <p><strong>Cargo Weigth:</strong> "+CargoWeight+"("+WeightTypes+")</p> <p><strong>Container Type:</strong> "+Containertype+"</p> <p>ContainerNo:<span style='text-transform: uppercase;'>&nbsp;&nbsp;" + ContainerNo + "</span></p> <p>"+Milestones+":&nbsp;&nbsp;" + Milestones_location + "</p> <p>Date:&nbsp;&nbsp;" + ReachedDateTime + "</p> <p>We look forward to seeing you!</p> <p>If you have any questions or need further assistance, feel free to reach out Customer Service representative of SKYB TRANS.</p> <p>Warm Regards, <br> SKYB TRANS PVT. LTD.</p> </div> <div class='footer'> <p>&copy; 2024 Sky B Trans. All rights reserved.</p> </div> </div> </body> </html>",
//                 };
//                 transporter.sendMail(mailOptions, function(error, info) {
//                     if (error) {
//                         console.log(error);
//                         res.status(500).send({ message: "Failed to send email", error: error.message });
//                     } else {
//                         console.log("Email sent: " + info.response);
//                         res.status(200).send({ message: "Mail sent", message_id: info.response });
//                     }
//                 });
      
//     } catch (error) {
//         console.error("Error in sendEmailNotification:", error);
//         res.status(500).send({ message: "An error occurred", error: error.message });
//     }
// }



router.post('/importEvents', async function (req, res, next) {
    try {
        const Evdata = req.body;
        const jsondata = Evdata.eventdata;

        const bookingnumber = jsondata.BookingNo;
        const IM_id = jsondata.IM_id;
        const ContainerNo = jsondata.ContainerNo;
        const Milestones_location = jsondata.Milestones_location;
        const ReachedDateTime = jsondata.ReachedDateTime;

        // 1. Update milestone status
        const updateSql = `
            UPDATE ImportMilestonesStatusList
            SET ADT = ?
            WHERE containerNumber = ? AND milestones = ?
        `;
        await db.sequelize.query(updateSql, {
            replacements: [ReachedDateTime, ContainerNo, IM_id],
            type: db.sequelize.QueryTypes.UPDATE
        });
        winston.info("Milestone updated for container: " + ContainerNo);

        // 2. Get booking details
        const bookingQuery = `
            SELECT a.CompanyName, a.CompanyAddress, b.DONo, c.locationName
            FROM SKY_CreateClients a
            LEFT JOIN Import_Bookings b ON a.Client_Id = b.CustomerName
            LEFT JOIN location c ON b.PortOfDischarge = c.L_key
            WHERE b.BookingNumber = ?
        `;
        const bookingResults = await db.sequelize.query(bookingQuery, {
            replacements: [bookingnumber],
            type: db.Sequelize.QueryTypes.SELECT
        });
 if (!bookingResults.length) {
            return res.status(404).send({ message: "Booking not found" });
        }
        const milestoneQuery = `
           select IM_id,milestones  from ImportMilestones where IM_id = ?
        `;
        const milestoneResults = await db.sequelize.query(milestoneQuery, {
            replacements: [IM_id],
            type: db.Sequelize.QueryTypes.SELECT
        });

          if (!milestoneResults.length) {
            return res.status(404).send({ message: "Booking not found" });
        }
       const {milestones}=milestoneResults[0];

        const { CompanyName: Name, CompanyAddress: ActualShipper, DONo, locationName } = bookingResults[0];
        const DONoName = "DO Number";

        // 3. Get container details
        const lineQuery = `
            SELECT b.generalType, a.SealNumber, a.CargoWeight, a.WeightTypes
            FROM IB_ItemDetails a
            LEFT JOIN general b ON a.ContainerTypes = b.G_key
            WHERE a.containernumber = ?
        `;
        const lineResults = await db.sequelize.query(lineQuery, {
            replacements: [ContainerNo],
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (!lineResults.length) {
            return res.status(404).send({ message: "Container not found" });
        }

        const { SealNumber: SealNo, generalType: Containertype, CargoWeight, WeightTypes } = lineResults[0];

        // 4. Send email notification
        await sendEmailNotification({
            bookingnumber,
            ContainerNo,
            ActualShipper,
            Name,
            locationName,
            DONo,
            DONoName,
            SealNo,
            Containertype,
            CargoWeight,
            WeightTypes,
            milestones,
            Milestones_location,
            ReachedDateTime
        });

        // 5. Final response
        return res.status(200).json({
            message: "Milestone updated and email notification sent successfully",
            data: jsondata
        });

    } catch (err) {
        console.error("Error in /importEvents:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

async function sendEmailNotification({
    bookingnumber,
    ContainerNo,
    ActualShipper,
    Name,
    locationName,
    DONo,
    DONoName,
    SealNo,
    Containertype,
    CargoWeight,
    WeightTypes,
    milestones,
    Milestones_location,
    ReachedDateTime
}) {


    console.log(milestones);
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 587,
        auth: {
            user: "contact@infologia.in",
            pass: "Welcome@123"
        }
    });

    

    const mailOptions = {
        from: "contact@infologia.in",
        to: "info@infologia.in",
        subject: "Milestone Status Alert",
        html: "<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <style> body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 10px 0; } .header h1 { margin: 0; color: #333333; } .content { padding: 20px 0; line-height: 1.6; } .content p { margin: 0 0 10px; } .footer { text-align: center; padding: 10px 0; color: #888888; } </style> </head> <body> <div class='container'> <div class='header'> <h1 style='text-transform: uppercase;'>milestone status</h1> </div> <div class='content'> <p> Dear Sir / Madam,</p> <p>Thank you for your booking! Exciting Milestone Update Inside.</p> <p><strong>Booking Details:</strong></p> <p>Infologia Booking No:<span style='text-transform: uppercase;'>&nbsp;&nbsp;" + bookingnumber + "</span></p> <p>Booking From: "+ Name +"</p> <p>Actual Shipper: "+ActualShipper+"</p> <p>Port of Loading: "+locationName+"</p> <p>"+DONoName+": "+DONo+"</p> <p>SealNo: "+SealNo+"</p> <p><strong>Cargo Weigth:</strong> "+CargoWeight+"("+WeightTypes+")</p> <p><strong>Container Type:</strong> "+Containertype+"</p> <p>ContainerNo:<span style='text-transform: uppercase;'>&nbsp;&nbsp;" + ContainerNo + "</span></p> <p>"+milestones+":&nbsp;&nbsp;" + Milestones_location + "</p> <p>Date:&nbsp;&nbsp;" + ReachedDateTime + "</p> <p>We look forward to seeing you!</p> <p>If you have any questions or need further assistance, feel free to reach out Customer Service representative of Infologia Technologies.</p> <p>Warm Regards, <br> Infologia Technologies PVT. LTD.</p> </div> <div class='footer'> <p>&copy; 2024 Sky B Trans. All rights reserved.</p> </div> </div> </body> </html>",
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log("Email sent:", info.response);
        })
        .catch(error => {
            console.error("Email send failed:", error);
            throw new Error("Failed to send email");
        });
}


router.post('/ExportEvents', async function (req, res, next) {
    try {
        const Evdata = req.body;
        const jsondata = Evdata.eventdata;

        const bookingnumber = jsondata.BookingNo;
        const EM_id = jsondata.EM_id;
        const ContainerNo = jsondata.ContainerNo;
        const Milestones_location = jsondata.Milestones_location;
        const ReachedDateTime = jsondata.ReachedDateTime;

        // 1. Update milestone status
        const updateSql = `
            UPDATE ExportMilestonesStatusList
            SET ADT = ?
            WHERE containerNumber = ? AND milestones = ?
        `;
        await db.sequelize.query(updateSql, {
            replacements: [ReachedDateTime, ContainerNo, EM_id],
            type: db.sequelize.QueryTypes.UPDATE
        });
        winston.info("Milestone updated for container: " + ContainerNo);

        // 2. Get booking details
        const bookingQuery = `
            SELECT a.CompanyName, a.CompanyAddress, b.LinearBkgno as DONo, c.locationName
            FROM SKY_CreateClients a
            LEFT JOIN Export_Bookings b ON a.Client_Id = b.CustomerName
            LEFT JOIN location c ON b.PortOfDischarge = c.L_key
            WHERE b.BookingNumber = ?
        `;
        const bookingResults = await db.sequelize.query(bookingQuery, {
            replacements: [bookingnumber],
            type: db.Sequelize.QueryTypes.SELECT
        });
 if (!bookingResults.length) {
            return res.status(404).send({ message: "Booking not found" });
        }
        const milestoneQuery = `
           select EM_id,milestones  from ExportMilestones where EM_id = ?
        `;
        const milestoneResults = await db.sequelize.query(milestoneQuery, {
            replacements: [EM_id],
            type: db.Sequelize.QueryTypes.SELECT
        });

          if (!milestoneResults.length) {
            return res.status(404).send({ message: "Booking not found" });
        }
       const {milestones}=milestoneResults[0];

        const { CompanyName: Name, CompanyAddress: ActualShipper, DONo, locationName } = bookingResults[0];
        const DONoName = "Linear Booking Number";

        // 3. Get container details
        const lineQuery = `
            SELECT b.generalType, a.SealNumber, a.CargoWeight, a.WeightTypes
            FROM EB_ItemDetails a
            LEFT JOIN general b ON a.ContainerTypes = b.G_key
            WHERE a.containernumber = ?
        `;
        const lineResults = await db.sequelize.query(lineQuery, {
            replacements: [ContainerNo],
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (!lineResults.length) {
            return res.status(404).send({ message: "Container not found" });
        }

        const { SealNumber: SealNo, generalType: Containertype, CargoWeight, WeightTypes } = lineResults[0];

        // 4. Send email notification
        await sendEmailNotification({
            bookingnumber,
            ContainerNo,
            ActualShipper,
            Name,
            locationName,
            DONo,
            DONoName,
            SealNo,
            Containertype,
            CargoWeight,
            WeightTypes,
            milestones,
            Milestones_location,
            ReachedDateTime
        });

        // 5. Final response
        return res.status(200).json({
            message: "Milestone updated and email notification sent successfully",
            data: jsondata
        });

    } catch (err) {
        console.error("Error in /importEvents:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

 
router.post('/locationcreation', async (req, res) => {
    try {
        const { Latitude, Longitude, ContainerNo } = req.body;
 
        if (!Latitude || !Longitude || !ContainerNo) {
            const response = CF.getStandardResponse(400, "Missing required fields");
            return res.status(400).send(response);
        }
 
        const query = 'INSERT INTO LiveLocation (Latitude, Longitude, ContainerNo) VALUES (?, ?, ?)';
 
        await db.sequelize.query(query, {
            replacements: [Latitude, Longitude, ContainerNo],
            type: db.sequelize.QueryTypes.INSERT
        });
 
        const response = CF.getStandardResponse(201, "Location created successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('locationcreation: ' + err.message);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
 
 


module.exports = router;
