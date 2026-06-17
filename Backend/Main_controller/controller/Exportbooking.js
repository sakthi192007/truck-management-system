const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const bookingdetails = db.ExportBookings;


const nodemailer = require('nodemailer');
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const fsSync = require('fs'); 
const path = require('path');
const { storage } = require('../../middlewares/storage');
var upload = multer({ storage: storage }).single('file');
const moment = require('moment');
const { Console } = require("console");


//export



router.post('/', verifytoken, async function (req, res, next) {
    const jsondata = req.body;
    console.log(jsondata);
    try {

        // Convert datetime strings WITHOUT timezone conversion
       const toDateTime = (value) => {
    if (!value || value === "undefined" || value === "null") return null;
    return value.replace('T', ' ') + ":00";
};

      const containerDates = toDateTime(jsondata.container_date);
const customs_dates = toDateTime(jsondata.customs_date);
const Portcutoff = toDateTime(jsondata.Portcutoff);
const etd = toDateTime(jsondata.etd);



        const pointclearance = jsondata.pointclearance ? parseInt(jsondata.pointclearance) : null;
        const status = jsondata.status ? parseInt(jsondata.status) : 0;
        const createdBy = jsondata.CreatedBy ? parseInt(jsondata.CreatedBy) : null;

       

        // Generate booking number
        const bookingNumber = await generateBookingExport();

        const sqlInsert = `
            INSERT INTO Export_Bookings 
            (contactperson, phone_number, Portcutoff, etd, BookingNumber, CustomerName, ContainerPlacementDate, 
            CustomerAddress, PointOfClearance, CustomsClearanceDate,
            SpecialInstruction, Commodity,VesselName, VesselVoyage, ShippingLine, status, 
            LinearBkgno, CreatedBy, confirmation_mail) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            SELECT SCOPE_IDENTITY() as id;
        `;

        const result = await db.sequelize.transaction(async (t) => {
            const [results] = await db.sequelize.query(sqlInsert, {
                replacements: [
                    jsondata.contactperson || null,
                    jsondata.phone_number || null,
                    Portcutoff,
                    etd,
                    bookingNumber,
                    jsondata.Customer || null,
                    containerDates,
                    jsondata.customer_add || null,
                    pointclearance,
                    customs_dates,
                    jsondata.special_integration || null,
                    jsondata.commodity || null,
                    jsondata.vessel || null,
                    jsondata.voyage || null,
                    jsondata.Shippingline || null,
                    status,
                    jsondata.LinearBkgno || null,
                    createdBy,
                    jsondata.Confirmationemail
                ],
                type: db.sequelize.QueryTypes.INSERT,
                transaction: t,
            });

            const primaryID = results?.[0]?.id;
            if (!primaryID) {
                throw new Error("Failed to retrieve primary key after insert.");
            }

            return primaryID;
        });

        const response = CF.getStandardResponse(201, "Export booking created successfully", { id: result });
        res.status(201).send(response);

    } catch (err) {
        winston.error('postBookingDetails: ' + err);
        console.error("Error during booking insert:", err);
        const response = CF.getStandardResponse(500, "Something went wrong", err.message);
        res.status(500).send(response);
    }
});


router.post('/Exportitems', verifytoken, async function (req, res, next) {
    const jsondata = req.body;
    console.log(jsondata);
 
    try {
        for (let i = 0; i < jsondata.length; i++) {
            const bookingId = jsondata[i].BookinExpotID;
            const VendorName = jsondata[i].Vendor;
            const containerType = jsondata[i].Container_type || null;
            const exportContainerNumber = jsondata[i].exportcontainernumber || null;
            const cargoWeight = jsondata[i].cargoweight || null;
            const weightType = jsondata[i].cargokgslbs || null;
            const status = jsondata[i].bookingstatus || null;
            const stuffingLocation = jsondata[i].staffing || null;
            const emptyContainerPickup = jsondata[i].emptycontainepick || null;
            const sealNumber = jsondata[i].Seal || null;
            const Vehicleno = jsondata[i].Vehiclenos || null;
            const NoofPackage = jsondata[i].Package || null;
            const StuffingLocation2 = jsondata[i].stuffing2 || null;
            const StuffingLocation3 = jsondata[i].stuffing3 || null;
            const StuffingLocation4 = jsondata[i].stuffing4 || null;
            const StuffingLocation5 = jsondata[i].stuffing5 || null;
            const PortofLoading1 = jsondata[i].loading1 || null;
            const PortofLoading2 = jsondata[i].loading2 || null;
 
            var sql = "INSERT INTO EB_ItemDetails (EB_id,VendorName,ContainerTypes,containernumber,CargoWeight,WeightTypes,StuffingLocation,EmptyContainerPickup,SealNumber,Vehicleno,NoofPackage,StuffingLocation2,StuffingLocation3,StuffingLocation4,StuffingLocation5,PortofLoading1,PortofLoading2,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            await db.sequelize.query(sql, {
                replacements: [
                    bookingId,
                    VendorName,
                    containerType,
                    exportContainerNumber,
                    cargoWeight,
                    weightType,
                    stuffingLocation,
                    emptyContainerPickup,
                    sealNumber,
                    Vehicleno,
                    NoofPackage,
                    StuffingLocation2,
                    StuffingLocation3,
                    StuffingLocation4,
                    StuffingLocation5,
                    PortofLoading1,
                    PortofLoading2,
                    status
 
                ],
                type: db.sequelize.QueryTypes.INSERT
            });
        }
        const response = CF.getStandardResponse(201, "Booking created successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('postbooking: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
 
 router.put('/update/:id', verifytoken, async function (req, res, next) {
    const uploadedFile = req.files;
    const id = req.params.id;
    const jsondata = req.body;
    console.log(jsondata);

    try {


        // Convert datetime strings WITHOUT timezone conversion
       const toDateTime = (value) => {
    if (!value || value === "undefined" || value === "null") return null;
    return value.replace('T', ' ') + ":00";
};

      const containerDates = toDateTime(jsondata.container_date);

const customs_dates = toDateTime(jsondata.customs_date);
const Portcutoff = toDateTime(jsondata.Portcutoff);
const etd = toDateTime(jsondata.etd);

       

        // SQL update query
        let sqlUpdate = `
            UPDATE Export_Bookings 
            SET CustomerName = ?, 
                ContainerPlacementDate = ?, 
                CustomerAddress = ?, 
                PointOfClearance = ?, 
                CustomsClearanceDate = ?, 
                SpecialInstruction = ?, 
                Commodity = ?, 
                VesselName = ?, 
                VesselVoyage = ?, 
                ShippingLine = ?, 
                contactperson = ?, 
                phone_number = ?, 
                Portcutoff = ?, 
                LinearBkgno = ?, 
                etd = ?,
                modifiedBy = ?,
                confirmation_mail = ?
        `;

        let replacements = [
            jsondata.Customer,
            containerDates,
            jsondata.customer_add,
            jsondata.pointclearance,
            customs_dates,
            jsondata.special_integration,
            jsondata.commodity,
            jsondata.vessel,
            jsondata.voyage,
            jsondata.Shippingline,
            jsondata.contactperson,
            jsondata.phone_number,
            Portcutoff,
            jsondata.LinearBkgno,
            etd,
            jsondata.modifiedBy,
            jsondata.Confirmationemail
        ];

        sqlUpdate += ` WHERE EB_id = ?;`;
        replacements.push(id);

        // Execute update in transaction
        await db.sequelize.transaction(async (t) => {
            await db.sequelize.query(sqlUpdate, {
                replacements: replacements,
                type: db.sequelize.QueryTypes.UPDATE,
                transaction: t
            });
        });

        const response = CF.getStandardResponse(201, "Booking updated successfully");
        res.status(201).json(response);

    } catch (err) {
        winston.error("putBookingDetails: " + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).json(response);
    }
});


//export grid
router.put('/items/:id', verifytoken, async function (req, res, next) {
    const uploadedFile = req.files;
    const id = req.params.id;
    const jsondata = req.body;
 
    console.log(jsondata);
    try {
        await db.sequelize.query(
            "DELETE FROM EB_ItemDetails WHERE EB_id = :id",
            {
                replacements: { id: id },
                type: db.Sequelize.QueryTypes.DELETE
            }
        );
 
        let insertPromises = [];
 
        for (let i = 0; i < jsondata.length; i++) {
            const VendorName = jsondata[i].Vendor || null;
            const containerType = jsondata[i].Container_type || null;
            const exportContainerNumber = jsondata[i].exportcontainernumber || null;
            const cargoWeight = jsondata[i].cargoweight || null;
            const weightType = jsondata[i].cargokgslbs || null;
                const status = jsondata[i].bookingstatus || null;
            const stuffingLocation = jsondata[i].staffing || null;
            const emptyContainerPickup = jsondata[i].emptycontainepick || null;
            const sealNumber = jsondata[i].Seal || null;
            const Vehicleno = jsondata[i].Vehiclenos || null;
            const NoofPackage = jsondata[i].Package || null;
            const StuffingLocation2 = jsondata[i].stuffing2 || null;
            const StuffingLocation3 = jsondata[i].stuffing3 || null;
            const StuffingLocation4 = jsondata[i].stuffing4 || null;
            const StuffingLocation5 = jsondata[i].stuffing5 || null;
              const PortofLoading1 = jsondata[i].loading1 || null;
                const PortofLoading2 = jsondata[i].loading2 || null;
 
            var sql = "INSERT INTO EB_ItemDetails (EB_id,VendorName, ContainerTypes, containernumber, CargoWeight, WeightTypes, StuffingLocation, EmptyContainerPickup, SealNumber,Vehicleno,NoofPackage,StuffingLocation2,StuffingLocation3,StuffingLocation4,StuffingLocation5,PortofLoading1,PortofLoading2,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
 
            insertPromises.push(
                db.sequelize.query(sql, {
                    replacements: [
                        id,
                        VendorName,
                        containerType,
                        exportContainerNumber,
                        cargoWeight,
                        weightType,
                        stuffingLocation,
                        emptyContainerPickup,
                        sealNumber,
                        Vehicleno,
                        NoofPackage,
                        StuffingLocation2,
                        StuffingLocation3,
                        StuffingLocation4,
                        StuffingLocation5,
                        PortofLoading1,
                        PortofLoading2,
                        status
                    ],
                    type: db.sequelize.QueryTypes.INSERT
                })
            );
        }
        await Promise.all(insertPromises);
        const response = CF.getStandardResponse(201, "Booking updated successfully");
        res.status(201).send(response);
 
    } catch (err) {
        winston.error('putBooking: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
 
router.get("/getall/:id/:role", verifytoken, function (req, res, next) {
    const id = req.params.id;
    const role = req.params.role;
let query="";
   if(role==1 || role=="1"){
  query= "EXEC BookingPendingClient_Grid @LoginUserID='"+id+"'";
   }else{
 query= "EXEC BookingPending_Grid @LoginUserID='"+id+"'";
   }

    db.sequelize.query(
        ""+query+"", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

   

    db.sequelize.query(
        "EXEC BookingConfirmed_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/:id", verifytoken, async function (req, res, next) {
  const id = req.params.id;
 
  try {
    const booking = await db.sequelize.query(
      `SELECT b.Email as emailid, b.CompanyName as name, a.*
       FROM Export_Bookings a
       LEFT JOIN SKY_CreateClients b ON a.CustomerName = b.Client_Id
       WHERE a.EB_id = ${id}`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );
 
    if (!booking || booking.length === 0) {
      winston.error(`/getBooking: No booking found for id ${id}`);
      const response = CF.getStandardResponse(404, "Booking not found");
      return res.status(404).send(response);
    }
 
    const EBID = Number(id);

const [
  items
 
] = await Promise.all([
  db.sequelize.query(
    "SELECT * FROM EB_ItemDetails WHERE EB_id = :EBID",
    { replacements: { EBID }, type: db.Sequelize.QueryTypes.SELECT }
  )
]);

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      data: booking,
      lineitems: items
     
    });
 
    winston.info("/getBooking: Success");
  } catch (error) {
    console.error("Error in /getBooking:", error);
    winston.error("/getBooking: " + error.message);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});
 router.get("/ExportDocumet/:id", verifytoken, async function (req, res, next) {
  const id = req.params.id;
 
  try {
    
 
    const EBID = Number(id);

const [
  CROfiles,
  Form13files,
  ShippingBillcopyfiles,
  EIRCopyfiles,
  Weighmentphotofiles,
  SealCopyfiles,
  ContainerCopyfiles
] = await Promise.all([
 
  db.sequelize.query(
    "SELECT * FROM EB_Files WHERE EB_id = :EBID",
    { replacements: { EBID }, type: db.Sequelize.QueryTypes.SELECT }
  ),
  db.sequelize.query(
    "SELECT * FROM EB_Form13Files WHERE EB_id = :EBID",
    { replacements: { EBID }, type: db.Sequelize.QueryTypes.SELECT }
  ),
  db.sequelize.query(
    "SELECT * FROM EB_ShippingFiles WHERE EB_id = :EBID",
    { replacements: { EBID }, type: db.Sequelize.QueryTypes.SELECT }
  ),
  db.sequelize.query(
    "SELECT * FROM EB_EIRFiles WHERE EB_id = :EBID",
    { replacements: { EBID }, type: db.Sequelize.QueryTypes.SELECT }
  ),
  db.sequelize.query(
    "SELECT * FROM EB_WeighmentFiles WHERE EB_id = :EBID",
    { replacements: { EBID }, type: db.Sequelize.QueryTypes.SELECT }
  ),
  db.sequelize.query(
    "SELECT * FROM EB_SealFiles WHERE EB_id = :EBID",
    { replacements: { EBID }, type: db.Sequelize.QueryTypes.SELECT }
  ),
  db.sequelize.query(
    "SELECT * FROM EB_ContainerFiles  WHERE EB_id = :EBID",
    { replacements: { EBID }, type: db.Sequelize.QueryTypes.SELECT }
  )
]);

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      CRO: CROfiles,
      Form13files: Form13files,
      Shippingfiles: ShippingBillcopyfiles,
      EIRfiles: EIRCopyfiles,
      Weighment: Weighmentphotofiles,
      Sealfiles: SealCopyfiles,
      Containerfiles: ContainerCopyfiles
    });
 
    winston.info("/getBooking: Success");
  } catch (error) {
    console.error("Error in /getBooking:", error);
    winston.error("/getBooking: " + error.message);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});
 

router.put('/delete/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;

    try {

        const updatedCompany = await bookingdetails.update({
            description: jsondata.description,
            status: 2,
        }, {
            where: { EB_id: id }
        });


        var response = CF.getStandardResponse(201, "delete Update successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('putBooking: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

//email
// router.get("/bookingApproval/:id", verifytoken, async function (req, res, next) {
//   const EB_id = req.params.id;

//   try {
//     const result = await db.sequelize.query(
//       `
//       SELECT 
//         b.Email AS ClientEmail,
//         a.confirmation_mail AS ConfirmationEmail,
//         a.BookingNumber,
//         UPPER(b.CompanyName) AS name,
//         FORMAT(a.ContainerPlacementDate, 'dd-MM-yyyy') AS ContainerPlacementDate,
//         a.CustomerAddress,
//         d.Ml_LocationName AS locationName,
//         a.LinearBkgno
//       FROM Export_Bookings a
//       LEFT OUTER JOIN SKY_CreateClients b ON a.CustomerName = b.Client_Id
// 	  inner join EB_ItemDetails c on a.EB_id=c.EB_id
// 	  inner join MasterLocation d on c.PortofLoading2=d.Ml_key
//       WHERE a.status = '0' AND a.EB_id = :EB_id
//       `,
//       {
//         replacements: { EB_id },
//         type: db.Sequelize.QueryTypes.SELECT
//       }
//     );

//     if (result.length === 0) {
//       return res.status(404).json({ message: "No booking found" });
//     }

//     const {
//       ClientEmail,
//       ConfirmationEmail,
//       BookingNumber,
//       name,
//       ContainerPlacementDate: BookingDate,
//       CustomerAddress,
//       locationName: PortOfDischarge,
//       LinearBkgno: LinerBkgno
//     } = result[0];
// console.log(result[0].BookingNumber);
//     const Detailsdata = await getdatas(BookingNumber);

//     let arrayadd = [];
//     if (Detailsdata?.inforadd?.length > 0) {
//       arrayadd = Detailsdata.inforadd.map(i => ({
//         numberoftype: i.numberoftype || "",
//         CargoWeight: i.CargoWeight || "",
//         numbercontainer: `${i.numberoftype || ""} * ${i.generalType || ""}`
//       }));
//     } else {
//       arrayadd = [{ numberoftype: "", CargoWeight: "", numbercontainer: "" }];
//     }
//     let toEmails = ConfirmationEmail && ConfirmationEmail.trim() !== ""
//       ? ConfirmationEmail
//       : ClientEmail;
//     toEmails = toEmails ? toEmails.split(',').map(e => e.trim()).filter(Boolean).join(',') : '';
//     if (!toEmails) {
//       return res.status(400).json({ message: "No recipient email found." });
//     }
//     await db.sequelize.query(
//       `
//       UPDATE Export_Bookings 
//       SET status = :status
//       WHERE EB_id = :id
//       `,
//       {
//         replacements: { status: 1, id: EB_id },
//         type: db.sequelize.QueryTypes.UPDATE
//       }
//     );

//     const transporter = nodemailer.createTransport({
//       host: 'smtp.hostinger.com',
//       port: 587,
//       auth: {
//         user: "info@skybtrans.com",
//         pass: "Welcome@123"
//       }
//     });

//     const mailOptions = {
//       from: "info@skybtrans.com",
//       to: toEmails, 
//       cc: "rajasekar@skybtrans.com,shankar@skybtrans.com,manimaranilt@gmail.com",
//       subject: "Booking Acceptance",
//       html: `
//       <!DOCTYPE html>
//       <html lang='en'>
//       <head>
//         <meta charset='UTF-8'>
//         <meta name='viewport' content='width=device-width, initial-scale=1.0'>
//         <style>
//           body { font-family: Arial, sans-serif; background-color: #f6f6f6; }
//           .container { max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
//           .header { text-align: center; padding: 10px 0; }
//           .content { padding: 20px 0; line-height: 1.6; }
//           .footer { text-align: center; padding: 10px 0; color: #888888; }
//         </style>
//       </head>
//       <body>
//         <div class='container'>
//           <div class='header'>
//             <h1>Booking Acceptance</h1>
//           </div>
//           <div class='content'>
//             <p>Dear Sir / Madam,</p>
//             <p>Thank you for your booking with SKYB Logistics! Your booking / reservation has been confirmed, and you will receive updates on container movements shortly.</p>
//             <p><strong>Booking Details:</strong></p>
//             <p><strong>SKYB Booking No:</strong> ${BookingNumber}</p>
//             <p><strong>Booking From:</strong> ${name}</p>
//             <p><strong>Stuffing Date:</strong> ${BookingDate}</p>
//             <p><strong>Actual Shipper:</strong> ${CustomerAddress}</p>
//             <p><strong>Stuffing Location:</strong> ${PortOfDischarge}</p>
//             <p><strong>S/L Booking No:</strong> ${LinerBkgno}</p>
//             <p><strong>Cargo Weight:</strong> ${arrayadd[0].CargoWeight}</p>
//             <p><strong>Container Type:</strong> ${arrayadd.map(item => item.numbercontainer).join(", ")}</p>
//             <p>If you have any questions or need further assistance, feel free to reach out to our Customer Service representative at SKYB TRANS.</p>
//             <p>Warm Regards,<br>SKYB TRANS PVT. LTD.</p>
//           </div>
//           <div class='footer'>
//             <p>&copy; 2024 SKY B Trans. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//       </html>
//       `
//     };


//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.error(error);
//         res.status(500).send({ message: "Failed to send email", error: error.message });
//       } else {
//         const response = CF.getStandardResponse(201, "Booking confirmed and email sent");
//         res.status(201).send(response);
//       }
//     });

//   } catch (err) {
//     console.error("bookingApproval error:", err);
//     winston.error('bookingApproval: ' + err);
//     const response = CF.getStandardResponse(500, "Something went wrong");
//     res.status(500).send(response);
//   }
// });

router.get("/bookingApproval/:id", verifytoken, async function (req, res) {
  const EB_id = req.params.id;
 

  try {
   
    const result = await db.sequelize.query(
      `
      SELECT 
        b.Email AS ClientEmail,
        a.confirmation_mail AS ConfirmationEmail,
        a.BookingNumber,
        UPPER(b.CompanyName) AS name,
        FORMAT(a.ContainerPlacementDate, 'dd-MM-yyyy') AS ContainerPlacementDate,
        a.CustomerAddress,
        d.Ml_LocationName AS locationName,
        a.LinearBkgno
      FROM Export_Bookings a
      LEFT OUTER JOIN SKY_CreateClients b ON a.CustomerName = b.Client_Id
      INNER JOIN EB_ItemDetails c ON a.EB_id = c.EB_id
      INNER JOIN MasterLocation d ON c.PortofLoading2 = d.Ml_key
      WHERE a.status = '0' AND a.EB_id = :EB_id
      `,
      {
        replacements: { EB_id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No booking found" });
    }

    const {
      ClientEmail,
      ConfirmationEmail,
      BookingNumber,
      name,
      ContainerPlacementDate: BookingDate,
      CustomerAddress,
      locationName: PortOfDischarge,
      LinearBkgno: LinerBkgno
    } = result[0];

    

   
    let Detailsdata = {};
    try {
      Detailsdata = await getdatas(BookingNumber);
      console.log("🔥 getdatas() Success");
    } catch (err) {
      console.error("❌ getdatas() Failed:", err);
      return res.status(500).json({ message: "Failed to fetch item details", error: err.toString() });
    }

    
    let arrayadd = [];

    if (Detailsdata?.inforadd?.length > 0) {
      arrayadd = Detailsdata.inforadd.map(i => ({
        numberoftype: i.numberoftype || "",
        CargoWeight: i.CargoWeight || "",
        numbercontainer: `${i.numberoftype || ""} * ${i.generalType || ""}`
      }));
    } else {
      arrayadd = [{ numberoftype: "", CargoWeight: "", numbercontainer: "" }];
    }

    const CargoWeight = arrayadd?.[0]?.CargoWeight || "";
    const ContainerType = arrayadd.map(item => item.numbercontainer).join(", ");

    
    let toEmails = ConfirmationEmail?.trim() || ClientEmail?.trim() || "";

    if (!toEmails) {
      return res.status(400).json({ message: "No recipient email found." });
    }

    
    toEmails = toEmails
      .split(',')
      .map(e => e.trim())
      .filter(Boolean)
      .join(',');

   

    
    try {
      await db.sequelize.query(
        `
        UPDATE Export_Bookings 
        SET status = :status
        WHERE EB_id = :id
        `,
        {
          replacements: { status: 1, id: EB_id },
          type: db.sequelize.QueryTypes.UPDATE
        }
      );
     
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      return res.status(500).json({ message: "Failed to update booking status" });
    }

    
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 587,
      auth: {
        user: "contact@infologia.in",
        pass: "Welcome@123"
      }
    });

    const mailOptions = {
      from: "contact@infologia.in",
      to: toEmails,
    //  cc: "rajasekar@skybtrans.com,shankar@skybtrans.com,manimaranilt@gmail.com",
      subject: "Booking Acceptance",
      html: `
      <!DOCTYPE html>
      <html lang='en'>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f6f6f6; }
          .container { max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; padding: 10px 0; }
          .content { padding: 20px 0; line-height: 1.6; }
          .footer { text-align: center; padding: 10px 0; color: #888888; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='header'>
            <h1>Booking Acceptance</h1>
          </div>
          <div class='content'>
            <p>Dear Sir / Madam,</p>
            <p>Thank you for your booking with Infologia Logistics! Your reservation has been confirmed.</p>
            <p><strong>Booking Details:</strong></p>
            <p><strong>Infologia Booking No:</strong> ${BookingNumber}</p>
            <p><strong>Booking From:</strong> ${name}</p>
            <p><strong>Stuffing Date:</strong> ${BookingDate}</p>
            <p><strong>Actual Shipper:</strong> ${CustomerAddress}</p>
            <p><strong>Stuffing Location:</strong> ${PortOfDischarge}</p>
            <p><strong>S/L Booking No:</strong> ${LinerBkgno}</p>
            <p><strong>Cargo Weight:</strong> ${CargoWeight}</p>
            <p><strong>Container Type:</strong> ${ContainerType}</p>
            <p>You will receive updates soon.</p>
            <p>Warm Regards,<br>Infologia Technologies PVT. LTD.</p>
          </div>
          <div class='footer'>
            <p>&copy; 2024 Infologia Technologies. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `
    };

    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        console.error("❌ Email Error:", error);
        return res.status(500).json({ message: "Failed to send email", error: error.message });
      }

      console.log("📧 Email Sent Successfully");
      return res.status(201).json({ message: "Booking confirmed and email sent" });
    });

  } catch (err) {
    console.error("❌ bookingApproval error:", err);
    return res.status(500).json({ message: "Something went wrong", error: err.toString() });
  }
});

//email
router.get("/bookingcancel/:EB_id", verifytoken, async function (req, res, next) {


    const id = req.params.EB_id;

     const result = await db.sequelize.query(
      `
      SELECT 
        b.Email AS ClientEmail,
        a.confirmation_mail AS ConfirmationEmail,
        a.BookingNumber,
        UPPER(b.CompanyName) AS name,
        FORMAT(a.ContainerPlacementDate, 'dd-MM-yyyy') AS ContainerPlacementDate,
        a.CustomerAddress,
        a.Stuffing_Location AS locationName,
        a.LinearBkgno
      FROM Export_Bookings a
      LEFT OUTER JOIN SKY_CreateClients b ON a.CustomerName = b.Client_Id
      WHERE a.status = '2' AND a.EB_id = :EB_id
      `,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No booking found" });
    }

    const {
      ClientEmail,
      ConfirmationEmail,
      BookingNumber,
      name,
      ContainerPlacementDate: BookingDate,
      CustomerAddress,
      locationName: PortOfDischarge,
      LinearBkgno: LinerBkgno
    } = result[0];

 let toEmails = ConfirmationEmail && ConfirmationEmail.trim() !== ""
      ? ConfirmationEmail
      : ClientEmail;
    toEmails = toEmails ? toEmails.split(',').map(e => e.trim()).filter(Boolean).join(',') : '';
    if (!toEmails) {
      return res.status(400).json({ message: "No recipient email found." });
    }
    try {
        await db.sequelize.query(`
        UPDATE Export_Bookings 
        SET status = :status
        WHERE EB_id = :id
    `, {
            replacements: {
                status: 4,
                id: id
            },
            type: db.sequelize.QueryTypes.UPDATE
        });

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
            to: toEmails,
          //  cc: "shankar@skybtrans.com, rajasekar@skybtrans.com",
            subject: "Booking Cancellation",
            html: "<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <style> body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 10px 0; } .header h1 { margin: 0; color: #333333; } .content { padding: 20px 0; line-height: 1.6; } .content p { margin: 0 0 10px; } .footer { text-align: center; padding: 10px 0; color: #888888; } </style> </head> <body> <div class='container'> <div class='header'> <h1>Booking Cancellation</h1> </div> <div class='content'> <p> Dear Sir / Madam ,</p> <p>We regret to inform you that your booking has been cancelled as per your request or due to unforeseen circumstances.</p> <p><strong>Booking Details:</strong></p>  <p >Booking ID: <span style='text-transform: uppercase;'>" + BookingNumber + "</span></p><p>If you have any questions or need further assistance, feel free to reach out Customer Service representative of Infologia.</p> <p> Warm Regards,<br> Infologia Technologies PVT. LTD</p> </div> <div class='footer'> <p>&copy; 2024 SKY B Trans. All rights reserved.</p> </div> </div> </body> </html>",
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send({ message: "Failed to send email", error: error.message });
            } else {

                const response = CF.getStandardResponse(201, "booking cancel");
                res.status(201).send(response);
            }
        });


    } catch (err) {
        winston.error('putBookingDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

/// booking number

async function generateBookingExport() {
    const textPart = 'EXPSKYB';
    const data = await db.sequelize.query(
        "SELECT TOP 1 BookingNumber FROM Export_Bookings ORDER BY BookingNumber DESC",
        { type: db.Sequelize.QueryTypes.SELECT }
    );

    let latestNumber = 0;

    if (data.length > 0 && data[0].BookingNumber !== undefined) {
        const latestinvoiceNumber = data[0].BookingNumber.toString();
        latestNumber = parseInt(latestinvoiceNumber.slice(-4), 10); // Ensure base 10 parsing
    } else {
        console.error("data is empty or BookingNumber is undefined");
    }

    const newNumber = latestNumber + 1;
    const numberPart = newNumber.toString().padStart(4, '0');
    const bookingNumber = `${textPart}${numberPart}`;

    return bookingNumber; // Corrected return variable
}


router.get("/add/:id", verifytoken, function (req, res, next) {
    var id = req.params.id;
    db.sequelize.query(
        "select CompanyAddress from SKY_CreateClients where User_ID=" + id + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
async function getdatas(BookingNumber) {

    try {
        let queryString = "";

        queryString = "WITH CTE_Subquery AS (SELECT count(b.containernumber) as numberoftype, c.generalType, SUM(b.CargoWeight) AS CargoWeight, b.WeightTypes FROM Export_Bookings a INNER JOIN EB_ItemDetails b ON a.EB_id = b.EB_id INNER JOIN general c ON b.ContainerTypes = c.G_key LEFT JOIN MasterLocation d ON b.StuffingLocation = d.Ml_key LEFT JOIN MasterLocation e ON b.EmptyContainerPickup = e.Ml_key WHERE c.generalType LIKE '%40%' AND a.BookingNumber ='" + BookingNumber + "' GROUP BY c.generalType, b.WeightTypes UNION ALL SELECT count(b.containernumber) as numberoftype, c.generalType, SUM(b.CargoWeight) AS CargoWeight, b.WeightTypes FROM Export_Bookings a INNER JOIN EB_ItemDetails b ON a.EB_id = b.EB_id INNER JOIN general c ON b.ContainerTypes = c.G_key LEFT JOIN MasterLocation d ON b.StuffingLocation = d.Ml_key LEFT JOIN MasterLocation e ON b.EmptyContainerPickup = e.Ml_key WHERE c.generalType LIKE '%20%' AND a.BookingNumber ='" + BookingNumber + "' GROUP BY c.generalType, b.WeightTypes ), final as ( SELECT DISTINCT numberoftype, generalType, SUM(CargoWeight) AS CargoWeight, WeightTypes FROM CTE_Subquery GROUP BY generalType,numberoftype, WeightTypes ) select numberoftype,generalType,CargoWeight,WeightTypes from final GROUP BY CargoWeight, WeightTypes,generalType,numberoftype";


        const query1 = queryString;


        const inforadd = await db.sequelize.query(query1);
        console.log(inforadd);

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


router.post('/Exportfile', async function (req, res, next) {
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

        // const saveFile = (file, fileName) => {
        //     const destination = `../public/booking/Export/${fileName}`;
        //     fs.writeFile(destination, file.data, function (err) {
        //         if (err) {
        //             console.error(err);
        //         }
        //     });
        // };
const saveFile = (file, fileName) => {

    const dirPath = path.join(__dirname, '../../public/booking/Export');

    // Create folder if not exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const destination = path.join(dirPath, fileName);

    fs.writeFile(destination, file.data, function (err) {
        if (err) {
            console.error("File save error:", err);
        } else {
            console.log("File saved:", destination);
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


router.delete('/deleteCroFile/:id/:Bid', async (req, res) => {
  const id = req.params.id;
  const Eb_Id = req.params.Bid;

  try {
    // Get record by ID
    const fileRecord = await db.sequelize.query(
      `SELECT CRO FROM EB_Files WHERE EBF_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!fileRecord || fileRecord.length === 0) {
      return res.status(404).send({
        response_code: "404",
        response_message: "File not found"
      });
    }

    const fileName = fileRecord[0].CRO;

    // Delete physical file
    if (fileName) {
      const filePath = path.join(process.cwd(), '../public/booking/Export', fileName);
      console.log("🗂 File path to delete:", filePath);

      if (fsSync.existsSync(filePath)) {
        fsSync.unlinkSync(filePath);
        console.log("✅ File deleted from folder");
      } else {
        console.log("⚠️ File not found in folder");
      }
    }

    // Delete DB row
    await db.sequelize.query(
      `DELETE FROM EB_Files WHERE EBF_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.DELETE
      }
    );

    // Get updated file list
    const test = await db.sequelize.query(
      "SELECT * FROM EB_Files WHERE EB_id = :Eb_Id",
      { replacements: { Eb_Id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      CRO: test // return array
    });

  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});
router.delete('/formFiles/:id/:Bid', async (req, res) => {
  const id = req.params.id;
  const Eb_Id = req.params.Bid;

  try {
    // Get record by ID
    const fileRecord = await db.sequelize.query(
      `select Form13 from EB_Form13Files WHERE EBF_id= :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!fileRecord || fileRecord.length === 0) {
      return res.status(404).send({
        response_code: "404",
        response_message: "File not found"
      });
    }

    const fileName = fileRecord[0].Form13;

    // Delete physical file
    if (fileName) {
      const filePath = path.join(process.cwd(), '../public/booking/Export', fileName);
      console.log("🗂 File path to delete:", filePath);

      if (fsSync.existsSync(filePath)) {
        fsSync.unlinkSync(filePath);
        console.log("✅ File deleted from folder");
      } else {
        console.log("⚠️ File not found in folder");
      }
    }

    // Delete DB row
    await db.sequelize.query(
      `DELETE FROM EB_Form13Files WHERE EBF_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.DELETE
      }
    );

    // Get updated file list
    const test = await db.sequelize.query(
      "SELECT * FROM EB_Form13Files WHERE EB_id = :Eb_Id",
      { replacements: { Eb_Id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      CRO: test // return array
    });

  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});
router.delete('/shipFile/:id/:Bid', async (req, res) => {
  const id = req.params.id;
  const Eb_Id = req.params.Bid;

  try {
    // Get record by ID
    const fileRecord = await db.sequelize.query(
      `select ShippingBillcopy from  EB_ShippingFiles WHERE SF_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!fileRecord || fileRecord.length === 0) {
      return res.status(404).send({
        response_code: "404",
        response_message: "File not found"
      });
    }

    const fileName = fileRecord[0].ShippingBillcopy;

    // Delete physical file
    if (fileName) {
      const filePath = path.join(process.cwd(), '../public/booking/Export', fileName);
      console.log("🗂 File path to delete:", filePath);

      if (fsSync.existsSync(filePath)) {
        fsSync.unlinkSync(filePath);
        console.log("✅ File deleted from folder");
      } else {
        console.log("⚠️ File not found in folder");
      }
    }

    // Delete DB row
    await db.sequelize.query(
      `DELETE FROM EB_ShippingFiles WHERE SF_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.DELETE
      }
    );

    // Get updated file list
    const test = await db.sequelize.query(
      "SELECT * FROM EB_ShippingFiles WHERE EB_id = :Eb_Id",
      { replacements: { Eb_Id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      CRO: test // return array
    });

  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});
router.delete('/eirFile/:id/:Bid', async (req, res) => {
  const id = req.params.id;
  const Eb_Id = req.params.Bid;

  try {
    // Get record by ID
    const fileRecord = await db.sequelize.query(
      `  select EIRCopy from  EB_EIRFiles WHERE EIR_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!fileRecord || fileRecord.length === 0) {
      return res.status(404).send({
        response_code: "404",
        response_message: "File not found"
      });
    }

    const fileName = fileRecord[0].EIRCopy;

    // Delete physical file
    if (fileName) {
      const filePath = path.join(process.cwd(), '../public/booking/Export', fileName);
      console.log("🗂 File path to delete:", filePath);

      if (fsSync.existsSync(filePath)) {
        fsSync.unlinkSync(filePath);
        console.log("✅ File deleted from folder");
      } else {
        console.log("⚠️ File not found in folder");
      }
    }

    // Delete DB row
    await db.sequelize.query(
      `DELETE FROM EB_EIRFiles WHERE EIR_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.DELETE
      }
    );

    // Get updated file list
    const test = await db.sequelize.query(
      "SELECT * FROM EB_EIRFiles WHERE EB_id = :Eb_Id",
      { replacements: { Eb_Id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      CRO: test // return array
    });

  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});
router.delete('/SealFile/:id/:Bid', async (req, res) => {
  const id = req.params.id;
  const Eb_Id = req.params.Bid;

  try {
    // Get record by ID
    const fileRecord = await db.sequelize.query(
      ` select SealCopy from  EB_SealFiles WHERE ES_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!fileRecord || fileRecord.length === 0) {
      return res.status(404).send({
        response_code: "404",
        response_message: "File not found"
      });
    }

    const fileName = fileRecord[0].SealCopy;

    // Delete physical file
    if (fileName) {
      const filePath = path.join(process.cwd(), '../public/booking/Export', fileName);
      console.log("🗂 File path to delete:", filePath);

      if (fsSync.existsSync(filePath)) {
        fsSync.unlinkSync(filePath);
        console.log("✅ File deleted from folder");
      } else {
        console.log("⚠️ File not found in folder");
      }
    }

    // Delete DB row
    await db.sequelize.query(
      `DELETE FROM EB_SealFiles WHERE ES_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.DELETE
      }
    );

    // Get updated file list
    const test = await db.sequelize.query(
      "SELECT * FROM EB_SealFiles WHERE EB_id = :Eb_Id",
      { replacements: { Eb_Id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      CRO: test // return array
    });

  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});
router.delete('/weighmentFile/:id/:Bid', async (req, res) => {
  const id = req.params.id;
  const Eb_Id = req.params.Bid;

  try {
    // Get record by ID
    const fileRecord = await db.sequelize.query(
      ` select Weighmentphoto from EB_WeighmentFiles WHERE WF_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!fileRecord || fileRecord.length === 0) {
      return res.status(404).send({
        response_code: "404",
        response_message: "File not found"
      });
    }

    const fileName = fileRecord[0].Weighmentphoto;

    // Delete physical file
    if (fileName) {
      const filePath = path.join(process.cwd(), '../public/booking/Export', fileName);
      console.log("🗂 File path to delete:", filePath);

      if (fsSync.existsSync(filePath)) {
        fsSync.unlinkSync(filePath);
        console.log("✅ File deleted from folder");
      } else {
        console.log("⚠️ File not found in folder");
      }
    }

    // Delete DB row
    await db.sequelize.query(
      `DELETE FROM EB_WeighmentFiles WHERE WF_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.DELETE
      }
    );

    // Get updated file list
    const test = await db.sequelize.query(
      "SELECT * FROM EB_WeighmentFiles WHERE EB_id = :Eb_Id",
      { replacements: { Eb_Id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      CRO: test // return array
    });

  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

router.delete('/deleteContainerFile/:id/:Bid', async (req, res) => {
  const id = req.params.id;
  const Eb_Id = req.params.Bid;

  try {
    // Get record by ID
    const fileRecord = await db.sequelize.query(
      ` select ContainerCopy from  EB_ContainerFiles WHERE CF_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (!fileRecord || fileRecord.length === 0) {
      return res.status(404).send({
        response_code: "404",
        response_message: "File not found"
      });
    }

    const fileName = fileRecord[0].ContainerCopy;

    // Delete physical file
    if (fileName) {
      const filePath = path.join(process.cwd(), '../public/booking/Export', fileName);
      console.log("🗂 File path to delete:", filePath);

      if (fsSync.existsSync(filePath)) {
        fsSync.unlinkSync(filePath);
        console.log("✅ File deleted from folder");
      } else {
        console.log("⚠️ File not found in folder");
      }
    }

    // Delete DB row
    await db.sequelize.query(
      `DELETE FROM EB_ContainerFiles WHERE CF_id = :id`,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.DELETE
      }
    );

    // Get updated file list
    const test = await db.sequelize.query(
      "SELECT * FROM EB_ContainerFiles WHERE EB_id = :Eb_Id",
      { replacements: { Eb_Id }, type: db.Sequelize.QueryTypes.SELECT }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      CRO: test // return array
    });

  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

module.exports = router;