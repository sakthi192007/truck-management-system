const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const db = require("../../config/dbconnection");
const nodemailer = require("nodemailer");
const CF = require("../../middlewares/commonfunction");
const winston = require("../../middlewares/logger");
const config1 = require("../../config/config.json");
const verifytoken = require("../../middlewares/verifytoken");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const fsSync = require('fs'); 
const path = require("path");
const { storage } = require("../../middlewares/storage");
var upload = multer({ storage: storage }).single("file");
const moment = require("moment");
const Importbookings = db.Importbookings;



router.put("/updatefile/:id", async (req, res) => {
  const uploadedFile = req.files;
  const jsondata = req.body;

  const formattedDate = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[-T:]/g, "");

  try {
    // Handle file names
    const cro_fle =
      uploadedFile && uploadedFile.crofle
        ? `cro_${formattedDate}_${uploadedFile.crofle.name}`
        : null;

    const pod_fle =
      uploadedFile && uploadedFile.Pod
        ? `impod_${formattedDate}_${uploadedFile.Pod.name}`
        : null;

    const IB_id = jsondata.Importbookingkey;

    if (!IB_id) {
      return res
        .status(400)
        .send(CF.getStandardResponse(400, "Missing Booking ID."));
    }

    const sqlInsert = `
             INSERT INTO IB_Files (IB_id, DeliveryOrder, Pod) 
             VALUES (?, ?, ?);
         `;

    await db.sequelize.query(sqlInsert, {
      replacements: [IB_id, cro_fle, pod_fle],
      type: db.sequelize.QueryTypes.INSERT,
    });

    const saveFile = (file, fileName) => {
      const destination = `./public/booking/${fileName}`;
      fs.writeFile(destination, file.data, function (err) {
        if (err) {
          console.error(err);
        }
      });
    };

    if (uploadedFile?.crofle) {
      saveFile(uploadedFile.crofle, cro_fle);
    }
    if (uploadedFile?.Pod) {
      saveFile(uploadedFile.Pod, pod_fle);
    }

    const response = CF.getStandardResponse(201, "Files uploaded successfully");
    res.status(201).send(response);
  } catch (err) {
    winston.error("updateupload: " + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});
router.post("/Import", verifytoken, async function (req, res, next) {
  const jsondata = req.body;

  console.log(jsondata);

  const primaryID = "";
  try {
 


      const toDateSmart = (value, isDateOnly = false) => {
      if (!value || value === "undefined" || value === "null") return null;

      // DATE only field
      if (isDateOnly) {
        return value; // yyyy-mm-dd
      }

      // DATETIME field
      if (value.includes("T")) {
        return value.replace("T", " ") + ":00";
      }

      return value;
    };

    // Convert all datetime fields properly
    const containerDates = toDateSmart(jsondata.container_date);
    const customs_dates = toDateSmart(jsondata.customs_date);
    const Etas = toDateSmart(jsondata.Eta);
    const IssueDate = toDateSmart(jsondata.issuedate);
    const DovalidUpto = toDateSmart(jsondata.dovaildupto);



  
    const bookingNumber = await generateBookingNumber();
    const sqlInsert = `
    INSERT INTO Import_Bookings 
    (contactperson,phone_number,dovaildupto,Eta,BookingNumber,CustomerName,ContainerPickUpDate,CustomerAddress,PointOfClearance,CustomsClearanceDate,SpecialInstruction,Commodity,IssueDateTime,VesselName,VesselVoyage,ShippingLine,status,DONo,CreatedBy,confirmationmail) 
    VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?, ?);
    SELECT SCOPE_IDENTITY() as id;`;

    try {
      const result = await db.sequelize.transaction(async (t) => {
        const [results] = await db.sequelize.query(sqlInsert, {
          replacements: [
            jsondata.contactperson,
            jsondata.phone_number,
            DovalidUpto,
            Etas,
            bookingNumber,
            jsondata.Customer,
            containerDates,
            jsondata.customer_add,
            jsondata.pointclearance,
            customs_dates,
            jsondata.special_integration,
            jsondata.commodity,
           IssueDate,
            jsondata.vessel,
            jsondata.voyage,
            jsondata.Shippingline,
            jsondata.status,
            jsondata.DONo,
             jsondata.CreatedBy,
             jsondata.confirmationmail
          ],
          type: db.sequelize.QueryTypes.INSERT,
          transaction: t,
        });

        const primaryID = results[0]?.id;
        if (!primaryID) {
          throw new Error("Failed to retrieve primary key after insert.");
        }

        return primaryID;
      });
      

      const response = CF.getStandardResponse(
        201,
        "Company created successfully",
        { id: result }
      );
      res.status(201).send(response);
    } catch (err) {
      winston.error("postBookingDetails: " + err);
      const response = CF.getStandardResponse(500, "Something went wrong");
      res.status(500).send(response);
    }
  } catch (err) {
    winston.error("postBookingDetails: " + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

// router.post("/Import", verifytoken, async function (req, res, next) {
//   const uploadedFile = req.files;
//   const jsondata = req.body;

//   console.log(jsondata);

//   const primaryID = "";
//   try {
//     let issuedates = "";
//     let dovaildupto = "";
//  const isValidDate = (date) => {
//     return date && !isNaN(Date.parse(date));
//   };
//    const toDateTime = (value) => {
//             if (!value || value === "undefined") return null;
//             return value.replace('T', ' ') + ":00";
//         };
//  const containerDates = toDateTime(jsondata.container_date);
//  const customs_dates = toDateTime(jsondata.customs_date);
//  const Eta = toDateTime(jsondata.Eta);

//     if (isValidDate(jsondata.issuedate)) {
//       issuedates = new Date(jsondata.issuedate)
//         .toISOString()
//         .slice(0, 19)
//         .replace("T", " ");
//     } else {
//       issuedates = null;
//     }

//     if (isValidDate(jsondata.dovaildupto)) {
//       dovaildupto = new Date(jsondata.dovaildupto)
//         .toISOString()
//         .slice(0, 19)
//         .replace("T", " ");
//     } else {
//       dovaildupto = null;
//     }
   

  
//     const bookingNumber = await generateBookingNumber();
//     const sqlInsert = `
//     INSERT INTO Import_Bookings 
//     (contactperson,phone_number,dovaildupto,Eta,BookingNumber,CustomerName,ContainerPickUpDate,CustomerAddress,PointOfClearance,CustomsClearanceDate,SpecialInstruction,Commodity,IssueDateTime,VesselName,VesselVoyage,ShippingLine,status,DONo,CreatedBy,confirmationmail) 
//     VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?, ?, ?);
//     SELECT SCOPE_IDENTITY() as id;`;

//     try {
//       const result = await db.sequelize.transaction(async (t) => {
//         const [results] = await db.sequelize.query(sqlInsert, {
//           replacements: [
//             jsondata.contactperson,
//             jsondata.phone_number,
//             dovaildupto,
//             Eta,
//             bookingNumber,
//             jsondata.Customer,
//             containerDates,
//             jsondata.customer_add,
//             jsondata.pointclearance,
//             customs_dates,
//             jsondata.special_integration,
//             jsondata.commodity,
//             issuedates,
//             jsondata.vessel,
//             jsondata.voyage,
//             jsondata.Shippingline,
//             jsondata.status,
//             jsondata.DONo,
//              jsondata.CreatedBy,
//              jsondata.confirmationmail
//           ],
//           type: db.sequelize.QueryTypes.INSERT,
//           transaction: t,
//         });

//         const primaryID = results[0]?.id;
//         if (!primaryID) {
//           throw new Error("Failed to retrieve primary key after insert.");
//         }

//         return primaryID;
//       });
      

//       const response = CF.getStandardResponse(
//         201,
//         "Company created successfully",
//         { id: result }
//       );
//       res.status(201).send(response);
//     } catch (err) {
//       winston.error("postBookingDetails: " + err);
//       const response = CF.getStandardResponse(500, "Something went wrong");
//       res.status(500).send(response);
//     }
//   } catch (err) {
//     winston.error("postBookingDetails: " + err);
//     const response = CF.getStandardResponse(500, "Something went wrong");
//     res.status(500).send(response);
//   }
// });
router.post("/Importitems", verifytoken, async function (req, res, next) {
  const jsondata = req.body;
  try {
    for (let i = 0; i < jsondata.length; i++) {
      const VendorName = jsondata[i].Vendor;
      const bookingId = jsondata[i].BookinimportID;
      const containerType = jsondata[i].importContainer_type || null;
      const containerNumber = jsondata[i].importcontainernumber || null;
      const cargoWeight = jsondata[i].importcargoweight || null;
      const weightType = jsondata[i].importcargokgslbs || null;
      const status = jsondata[i].bookingstatus || null;
      const pickupLocation = jsondata[i].importpickup || null;
      const deStuffingLocation = jsondata[i].importstaffing || null;
      const emptyReturn = jsondata[i].importemptycontainepick || null;
      const sealNumber = jsondata[i].Seal || null;
      const Vehicleno = jsondata[i].Vehiclenos || null;
      const Package = jsondata[i].Package || null;
      const DE_StuffingLocation2 = jsondata[i].destuffing2 || null;
      const DE_StuffingLocation3 = jsondata[i].destuffing3 || null;
      const DE_StuffingLocation4 = jsondata[i].destuffing4 || null;
      const DE_StuffingLocation5 = jsondata[i].destuffing5 || null;
      const PortofDischarge1 = jsondata[i].discharge1 || null;
      const PortofDischarge2 = jsondata[i].discharge2 || null;
 
 
      var sql =
        "INSERT INTO IB_ItemDetails (IB_id,VendorName, ContainerTypes, containernumber, CargoWeight, WeightTypes, ContainerPickupLocation, DE_StuffingLocation, EmptyReturnAt, SealNumber,Vehicleno,NoofPackage,DE_StuffingLocation2,DE_StuffingLocation3,DE_StuffingLocation4,DE_StuffingLocation5,PortofDischarge1,PortofDischarge2,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
 
      await db.sequelize.query(sql, {
        replacements: [
          bookingId,
          VendorName,
          containerType,
          containerNumber,
          cargoWeight,
          weightType,
          pickupLocation,
          deStuffingLocation,
          emptyReturn,
          sealNumber,
          Vehicleno,
          Package,
          DE_StuffingLocation2,
          DE_StuffingLocation3,
          DE_StuffingLocation4,
          DE_StuffingLocation5,
          PortofDischarge1,
          PortofDischarge2,
          status
 
        ],
        type: db.sequelize.QueryTypes.INSERT,
      });
    }
 
    const response = CF.getStandardResponse(
      201,
      "Booking created successfully"
    );
    res.status(201).send(response);
  } catch (err) {
    winston.error("postbooking: " + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});
 



//put
router.put("/booking/update/:id", verifytoken, async function (req, res, next) {
  const id = req.params.id;
  const jsondata = req.body;

  try {
   const toDateSmart = (value, isDateOnly = false) => {
      if (!value || value === "undefined" || value === "null") return null;

      // DATE only field
      if (isDateOnly) {
        return value; // yyyy-mm-dd
      }

      // DATETIME field
      if (value.includes("T")) {
        return value.replace("T", " ") + ":00";
      }

      return value;
    };

    // Convert all datetime fields properly
    const containerDates = toDateSmart(jsondata.container_date);
    const customs_dates = toDateSmart(jsondata.customs_date);
    const Etas = toDateSmart(jsondata.Eta);
    const IssueDate = toDateSmart(jsondata.issuedate);
    const DovalidUpto = toDateSmart(jsondata.dovaildupto);

    let sqlUpdate = `
        UPDATE Import_Bookings 
        SET CustomerName = ?, 
            ContainerPickUpDate = ?, 
            CustomerAddress = ?, 
            PointOfClearance = ?, 
            CustomsClearanceDate = ?, 
            SpecialInstruction = ?, 
            Commodity = ?, 
            IssueDateTime = ?, 
            VesselName = ?, 
            VesselVoyage = ?, 
            ShippingLine = ?,
            contactperson = ?, 
            phone_number = ?, 
            dovaildupto = ?, 
            Eta = ?, 
            DONo = ?, 
            modifiedBy = ?, 
            confirmationmail = ?
    `;

    let replacements = [
      jsondata.Customer,
      containerDates,
      jsondata.customer_add,
      jsondata.pointclearance,
      customs_dates,
      jsondata.special_integration,
      jsondata.commodity,
      IssueDate,        // ✔ converted
      jsondata.vessel,
      jsondata.voyage,
      jsondata.Shippingline,
      jsondata.contactperson,
      jsondata.phone_number,
      DovalidUpto,      // ✔ converted
      Etas,
      jsondata.DONo,
      jsondata.modifiedBy,
      jsondata.confirmationmail
    ];

    sqlUpdate += ` WHERE IB_id = ?;`;
    replacements.push(id);

    await db.sequelize.transaction(async (t) => {
      await db.sequelize.query(sqlUpdate, {
        replacements: replacements,
        type: db.sequelize.QueryTypes.UPDATE,
        transaction: t,
      });
    });

    const response = CF.getStandardResponse(201, "Booking updated successfully");
    res.status(201).send(response);

  } catch (err) {
    winston.error("putBookingDetails: " + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});


router.put("/items/update/:id", verifytoken, async function (req, res, next) {
  const id = req.params.id;
  const jsondata = req.body;

  console.log(jsondata);
 
  try {
    // Delete existing entries
    await db.sequelize.query("DELETE FROM IB_ItemDetails WHERE IB_id = :id", {
      replacements: { id: id },
      type: db.Sequelize.QueryTypes.DELETE,
    });
 
    // Collect all promises for inserting new items
    const promises = jsondata.map((item) => {
      const sql = `INSERT INTO IB_ItemDetails
                        (IB_id,VendorName,ContainerTypes, containernumber, CargoWeight, WeightTypes, ContainerPickupLocation, DE_StuffingLocation, EmptyReturnAt, SealNumber,Vehicleno,NoofPackage,DE_StuffingLocation2,DE_StuffingLocation3,DE_StuffingLocation4,DE_StuffingLocation5,PortofDischarge1,PortofDischarge2,status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)`;
 
      return db.sequelize.query(sql, {
        replacements: [
          id,
          item.Vendor || null,
          item.importContainer_type || null,
          item.importcontainernumber || null,
          item.importcargoweight || null,
          item.importcargokgslbs || null,
          item.importpickup || null,
          item.importstaffing || null,
          item.importemptycontainepick || null,
          item.Seal || null,
          item.Vehiclenos || null,
           item.Package|| null,
          item.DE_StuffingLocation2|| null,
          item.DE_StuffingLocation3|| null,
          item.DE_StuffingLocation4|| null,
          item.DE_StuffingLocation5|| null,
          item.PortofDischarge1|| null,
          item.PortofDischarge2|| null,
          item.bookingstatus|| null,
        ],
        type: db.sequelize.QueryTypes.INSERT,
      });
    });
 
    // Wait for all inserts to complete
    await Promise.all(promises);
 
    // Send response after all inserts are done
    const response = CF.getStandardResponse(
      201,
      "Booking updated successfully"
    );
    res.status(201).send(response);
    winston.info("Booking updated successfully.");
  } catch (err) {
    winston.error("putBooking: " + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});
 
router.get("/getall/:id/:role", verifytoken, function (req, res, next) {
  const id = req.params.id;
  const role = req.params.role;
let query="";
   if(role==1 || role=="1"){
  query= "EXEC ImportBookingcliet_Grid @LoginUserID='"+id+"'";
   }else{
 query= "EXEC ImportBooking_Grid @LoginUserID='"+id+"'";
   }

  
  
      db.sequelize.query(
          ""+query+"", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
      ).then((data) => {
      res.status(200).send({
        response_code: "200",
        response_message: "success.",
        data,
      });
      winston.info("Clients");
    })
    .catch((error) => {
      console.error("Error fetching Clients:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error",
      });
    });
});
router.get("/allbooked/:id/:role", verifytoken, function (req, res, next) {
const id = req.params.id;
  const role = req.params.role;

 
  
      db.sequelize.query(
          "EXEC ImportBookingConfirmed_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
      )
    .then((data) => {
      res.status(200).send({
        response_code: "200",
        response_message: "success.",
        data,
      });
      winston.info("Clients");
    })
    .catch((error) => {
      console.error("Error fetching Clients:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error",
      });
    });
});


//email
router.get("/bookingApproval/:IB_id",verifytoken,async function (req, res, next) {
    const id = req.params.IB_id;

const result = await db.sequelize.query(
      `
   select b.Email,a.IB_id,BookingNumber,upper(b.CompanyName) as name, 
FORMAT(a.ContainerPickUpDate, 'dd-MM-yyyy') AS ContainerPickUpDate, 
a.CustomerAddress,d.Ml_LocationName as CFS, 
a.status,a.description,a.LinearBkgno from Import_Bookings a 
left outer join SKY_CreateClients b on a.CustomerName=b.Client_Id  
inner join IB_ItemDetails c on a.IB_id=c.IB_id
 left join MasterLocation d on c.PortofDischarge2=d.Ml_key
where a.status='0' and a.IB_id=:id
      `,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No booking found" });
    }

    const BookingNumber =  result[0].BookingNumber;
    const name = result[0].name;
    const BookingDate = result[0].ContainerPickUpDate;
    const Email = result[0].Email;
    const CustomerAddress = result[0].CustomerAddress;
    const PortOfDischarge = result[0].de_Stuffing_Location;
    const LinerBkgno = result[0].LinearBkgno;

    const Detailsdata = await getdatas(BookingNumber);

    if (Detailsdata && Array.isArray(Detailsdata.inforadd) && Detailsdata.inforadd.length > 0) {
    arrayadd = Detailsdata.inforadd.map(i => ({
        numberoftype: i.numberoftype || "",
        CargoWeight: i.CargoWeight || "",
        numbercontainer: (i.numberoftype || "") + ' * ' + (i.generalType || "") + ' ',
    }));
} else {
    arrayadd = [{ numberoftype: "", CargoWeight: "", numbercontainer: "" }];
}


   

    try {
      await db.sequelize.query(
        `
        UPDATE Import_Bookings 
        SET status = :status
        WHERE IB_id = :id
    `,
        {
          replacements: {
            status: 1,
            id: id,
          },
          type: db.sequelize.QueryTypes.UPDATE,
        }
      );

      var transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        auth: {
          user: "contact@infologia.in",
          pass: "Welcome@123",
        },
      });

      var mailOptions = {
        from: "contact@infologia.in",
        to: "info@infologia.in",
      //  cc: "shankar@skybtrans.com, Yogapraveen@skybtrans.com",
        subject: "Booking Acceptance",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            background-color: #007bff;
            color: white;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
            color: #333333;
        }
        .content p {
            margin: 0 0 10px;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            color: #888888;
            font-size: 12px;
        }
        strong {
            color: #000000;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Acceptance</h1>
        </div>

        <div class="content">
            <p>Dear Sir / Madam,</p>
            <p>Thank you for your booking with <strong>Infologia Logistics</strong>! Your booking/reservation has been confirmed, and you will receive updates on container movements shortly.</p>

            <p><strong>Booking Details:</strong></p>
            <p>Infologia Booking No: <span style="text-transform: uppercase;">${BookingNumber}</span></p>
            <p>Booking From: ${name}</p>
            <p>DeStuffing Date: ${BookingDate}</p>
            <p>Actual Shipper: ${CustomerAddress}</p>
            <p>De Stuffing Location: ${PortOfDischarge}</p>
            <p>S/L Booking No: ${LinerBkgno}</p>
            <p><strong>Cargo Weigth:</strong> ${arrayadd[0].CargoWeight}</p>
           <p><strong>Container Type:</strong> ${arrayadd
             .map((item) => item.numbercontainer)
             .join(", ")}</p>

            <p>If you have any questions or need further assistance, feel free to reach out to a Customer Service representative at <strong>SKYB TRANS</strong>.</p>

            <p>Warm Regards,<br> <strong>Infologia Technologies PVT. LTD.</strong></p>
        </div>

        <div class="footer">
            <p>&copy; 2024 Infologia Technologies. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res
            .status(500)
            .send({ message: "Failed to send email", error: error.message });
        } else {
          const response = CF.getStandardResponse(201, "booking confirm");
          res.status(201).send(response);
        }
      });
    } catch (err) {
      winston.error("putBookingDetails: " + err);
      const response = CF.getStandardResponse(500, "Something went wrong");
      res.status(500).send(response);
    }
  }
);
//email
router.get("/bookingcancel/:IB_id",verifytoken,async function (req, res, next) {
    const id = req.params.IB_id;

    const result = await db.sequelize.query(
      `
      select b.Email,IB_id,BookingNumber,upper(b.CompanyName) as name, 
FORMAT(a.ContainerPickUpDate, 'dd-MM-yyyy') AS ContainerPickUpDate, 
a.CustomerAddress,a.de_Stuffing_Location as CFS, 
a.status,a.description,a.LinearBkgno from Import_Bookings a 
left outer join SKY_CreateClients b on a.CustomerName=b.Client_Id  
where a.status='0' and a.IB_id=:id
      `,
      {
        replacements: { id },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No booking found" });
    }

     const Email =  result[0].Email;

    const BookingNumber = req.params.BookingNumber;
    const name = req.params.name;
    const BookingDate = req.params.ContainerPickUpDate;

    try {
      await db.sequelize.query(
        `
        UPDATE Import_Bookings 
        SET status = :status
        WHERE IB_id = :id
    `,
        {
          replacements: {
            status: 4,
            id: id,
          },
          type: db.sequelize.QueryTypes.UPDATE,
        }
      );
      const response = CF.getStandardResponse(
        201,
        "booking cancellation successfully"
      );
      res.status(201).send(response);
      var transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        auth: {
          user: "contact@infologia.in",
          pass: "Welcome@123",
        },
      });

      var mailOptions = {
        from: "contact@infologia.in",
        to: "info@infologia",
       // cc: "shankar@skybtrans.com, Yogapraveen@skybtrans.com",
        subject: "Booking Cancellation",
        html:
          "<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <style> body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 10px 0; } .header h1 { margin: 0; color: #333333; } .content { padding: 20px 0; line-height: 1.6; } .content p { margin: 0 0 10px; } .footer { text-align: center; padding: 10px 0; color: #888888; } </style> </head> <body> <div class='container'> <div class='header'> <h1>Booking Cancellation</h1> </div> <div class='content'> <p> Dear Sir / Madam,</p> <p>We regret to inform you that your booking has been cancelled as per your request or due to unforeseen circumstances.</p> <p><strong>Booking Details:</strong></p>  <p >Booking ID: <span style='text-transform: uppercase;'>" +
          BookingNumber +
          "</span></p><p>If you have any questions or need further assistance, feel free to reach out Customer Service representative of Infologia Technologies.</p> <p> Warm Regards,<br> Infologia Technologies PVT. LTD</p> </div> <div class='footer'> <p>&copy; 2024 SKY B Trans. All rights reserved.</p> </div> </div> </body> </html>",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res
            .status(500)
            .send({ message: "Failed to send email", error: error.message });
        } else {
          const response = CF.getStandardResponse(201, "booking confirm");
          res.status(201).send(response);
        }
      });
    } catch (err) {
      winston.error("putBookingDetails: " + err);
      const response = CF.getStandardResponse(500, "Something went wrong");
      res.status(500).send(response);
    }
  }
);

router.get("/:id", verifytoken, async function (req, res, next) {
  const id = req.params.id;
 
  try {
    const booking = await db.sequelize.query(
      `select b.Email as emailid,b.CompanyName as name,a.* from Import_Bookings  a left join SKY_CreateClients b on a.CustomerName=b.Client_Id where a.IB_id = ${id}`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );
 
    if (!booking || booking.length === 0) {
      winston.error(`/getBooking: No booking found for id ${id}`);
      const response = CF.getStandardResponse(404, "Booking not found");
      return res.status(404).send(response);
    }
 
    
    const [
      items
    ] = await Promise.all([
      db.sequelize.query(
        `select * from IB_ItemDetails where IB_id = ${id}`,
        { type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/view/:id", verifytoken, async function (req, res, next) {
  const id = req.params.id;
  try {
    const [
      DOFile,
      PODFile,
      BillOfEntry,
      EmptyReturnCopy,
      ContainerCopy
    ] = await Promise.all([
     
      db.sequelize.query(
        `select * from IB_Files where IB_id = ${id}`,
        { type: db.Sequelize.QueryTypes.SELECT }
      ),
      db.sequelize.query(
        `select * from IB_PODFiles where IB_id = ${id}`,
        { type: db.Sequelize.QueryTypes.SELECT }
      ),
      db.sequelize.query(
        ` select * from IB_BillofEntryFiles where IB_id = ${id}`,
        { type: db.Sequelize.QueryTypes.SELECT }
      ),
      db.sequelize.query(
        `select * from IB_EmptyreturnFiles where IB_id = ${id}`,
        { type: db.Sequelize.QueryTypes.SELECT }
      ),
     db.sequelize.query(
        ` select * from IB_ContainerFiles where IB_id = ${id}`,
        { type: db.Sequelize.QueryTypes.SELECT }
      )
    ]);
 
    res.status(200).send({
      response_code: "200",
      response_message: "success",
     
      DOFile: DOFile,
      PODFile: PODFile,
      BillOfEntry: BillOfEntry,
      EmptyReturnCopy: EmptyReturnCopy,
      ContainerCopy: ContainerCopy
      
    });
 
    winston.info("/getBookingDocuments: Success");
  } catch (error) {
    console.error("Error in /getBookingDocuments:", error);
    winston.error("/getBookingDocuments: " + error.message);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

router.put("/delete/:id", verifytoken, async function (req, res, next) {
  const id = req.params.id;
  const jsondata = req.body;

  try {
    const updatedCompany = await Importbookings.update(
      {
        description: jsondata.description,
        status: 2,
      },
      {
        where: { IB_id: id },
      }
    );

    var response = CF.getStandardResponse(201, "delete Update successfully");
    res.status(201).send(response);
  } catch (err) {
    winston.error("putBooking: " + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

/// booking number

async function generateBookingNumber() {
  const textPart = "IMPSKYB";
  const data = await db.sequelize.query(
    "SELECT TOP 1 BookingNumber FROM Import_Bookings ORDER BY BookingNumber DESC",
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
  const numberPart = newNumber.toString().padStart(4, "0");
  const bookingNumber = `${textPart}${numberPart}`;

  return bookingNumber; // Corrected return variable
}

async function getdatas(BookingNumber) {
  try {
    let queryString = "";

    queryString =
      "WITH CTE_Subquery AS (SELECT count(b.containernumber) as numberoftype, c.generalType, SUM(b.CargoWeight) AS CargoWeight, b.WeightTypes FROM Import_Bookings a INNER JOIN IB_ItemDetails b ON a.IB_id = b.IB_id INNER JOIN general c ON b.ContainerTypes = c.G_key LEFT JOIN MasterLocation d ON b.DE_StuffingLocation = d.Ml_key LEFT JOIN MasterLocation e ON b.ContainerPickupLocation = e.Ml_key WHERE c.generalType LIKE '%40%' AND a.BookingNumber ='" +
      BookingNumber +
      "' GROUP BY c.generalType, b.WeightTypes UNION ALL SELECT count(b.containernumber) as numberoftype, c.generalType, SUM(b.CargoWeight) AS CargoWeight, b.WeightTypes FROM Import_Bookings a INNER JOIN IB_ItemDetails b ON a.IB_id = b.IB_id INNER JOIN general c ON b.ContainerTypes = c.G_key LEFT JOIN MasterLocation d ON b.DE_StuffingLocation = d.Ml_key LEFT JOIN MasterLocation e ON b.ContainerPickupLocation = e.Ml_key WHERE c.generalType LIKE '%20%' AND a.BookingNumber ='" +
      BookingNumber +
      "' GROUP BY c.generalType, b.WeightTypes ), final as ( SELECT DISTINCT numberoftype, generalType, SUM(CargoWeight) AS CargoWeight, WeightTypes FROM CTE_Subquery GROUP BY generalType,numberoftype, WeightTypes ) select numberoftype,generalType,CargoWeight,WeightTypes from final GROUP BY CargoWeight, WeightTypes,generalType,numberoftype";

    const query1 = queryString;

    const inforadd = await db.sequelize.query(query1);

    return { inforadd: inforadd[0] };
  } catch (err) {
    console.error("Error executing queries:", err);
    throw err;
  }
}
async function processBookingData(id) {
  try {
    const Detailsdata = await getdatas(id);

    if (!Array.isArray(Detailsdata)) {
      throw new Error(
        "Expected Detailsdata to be an array, but got:",
        Detailsdata
      );
    }

    let arrayadd = Detailsdata.map((i) => ({
      numberoftype: i.numberoftype,
      numbercontainer: `${i.numberoftype} * ${i.generalType}`,
    }));

    console.log("Processed Data:", arrayadd);

    return `<p><strong>Container Type:</strong> ${arrayadd
      .map((item) => item.numberoftype)
      .join(", ")}</p>`;
  } catch (err) {
    console.error("Error processing booking data:", err);
  }
}
  router.post("/Importfile", async function (req, res, next) {
  const uploadedFile = req.files;
  const jsondata = req.body;

  console.log(uploadedFile);

  const formattedDate = new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[-T:]/g, "");
  const IB_id = jsondata.Importbookingkey;


  if (!IB_id) {
    return res
      .status(400)
      .send(CF.getStandardResponse(400, "Missing  Import Booking ID."));
  }

  try {
    const fileMappings = [
      {
        key: "bilfle",
        name: `bil_${formattedDate}_${uploadedFile?.bilfle?.name}`,
        table: "IB_BillofEntryFiles",
        column: "BillOfEntry",
      },
      {
        key: "confle",
        name: `con_${formattedDate}_${uploadedFile?.confle?.name}`,
        table: "IB_ContainerFiles",
        column: "Containerphoto",
      },
      {
        key: "empfle",
        name: `emp_${formattedDate}_${uploadedFile?.empfle?.name}`,
        table: "IB_EmptyreturnFiles",
        column: "Emptyreturncopy",
      },
      {
        key: "Pod",
        name: `pod_${formattedDate}_${uploadedFile?.Pod?.name}`,
        table: "IB_PODFiles",
        column: "Pod",
      },
      {
        key: "crofle",
        name: `cro_${formattedDate}_${uploadedFile?.crofle?.name}`,
        table: "IB_Files",
        column: "DeliveryOrder",
      },
    ];

    const saveFile = (file, fileName) => {
    
        const dirPath = path.join(__dirname, '../../public/booking/Import');
    
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
        const sqlInsert = `INSERT INTO ${mapping.table} (IB_id, ${mapping.column}) VALUES (?, ?);`;
        await db.sequelize.query(sqlInsert, {
          replacements: [IB_id, mapping.name],
          type: db.sequelize.QueryTypes.INSERT,
        });
        saveFile(file, mapping.name);
      }
    }

    const response = CF.getStandardResponse(201, "Files uploaded successfully");
    res.status(201).send(response);
  } catch (err) {
    winston.error("postbooking Exportfiles: " + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

router.delete('/delivery/:id/:Bid', async (req, res) => {
   const id = req.params.id;
   const Eb_Id = req.params.Bid;
 
   try {
     // Get record by ID
     const fileRecord = await db.sequelize.query(
       ` select DeliveryOrder from  IB_Files WHERE IBF_id = :id`,
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
 
     const fileName = fileRecord[0].DeliveryOrder;
 
     // Delete physical file
     if (fileName) {
       const filePath = path.join(process.cwd(), '../../public/booking/Export', fileName);
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
       `DELETE FROM IB_Files WHERE IBF_id = :id`,
       {
         replacements: { id },
         type: db.Sequelize.QueryTypes.DELETE
       }
     );
 
     // Get updated file list
     const test = await db.sequelize.query(
       "SELECT * FROM IB_Files WHERE IB_id = :Eb_Id",
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
  router.delete('/pod/:id/:Bid', async (req, res) => {
   const id = req.params.id;
   const Eb_Id = req.params.Bid;
 
   try {
     // Get record by ID
     const fileRecord = await db.sequelize.query(
       ` select Pod from  IB_PODFiles WHERE Pod_id = :id`,
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
 
     const fileName = fileRecord[0].Pod;
 
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
       `DELETE FROM IB_PODFiles WHERE Pod_id = :id`,
       {
         replacements: { id },
         type: db.Sequelize.QueryTypes.DELETE
       }
     );
 
     // Get updated file list
     const test = await db.sequelize.query(
       "SELECT * FROM IB_PODFiles WHERE IB_id = :Eb_Id",
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
  router.delete('/bill/:id/:Bid', async (req, res) => {
   const id = req.params.id;
   const Eb_Id = req.params.Bid;
 
   try {
     // Get record by ID
     const fileRecord = await db.sequelize.query(
       ` select BillOfEntry from  IB_BillofEntryFiles WHERE BLE_id = :id`,
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
 
     const fileName = fileRecord[0].BillOfEntry;
 
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
       `DELETE FROM IB_BillofEntryFiles WHERE BLE_id = :id`,
       {
         replacements: { id },
         type: db.Sequelize.QueryTypes.DELETE
       }
     );
 
     // Get updated file list
     const test = await db.sequelize.query(
       "SELECT * FROM IB_BillofEntryFiles WHERE IB_id = :Eb_Id",
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
  router.delete('/container/:id/:Bid', async (req, res) => {
   const id = req.params.id;
   const Eb_Id = req.params.Bid;
 
   try {
     // Get record by ID
     const fileRecord = await db.sequelize.query(
       ` select Containerphoto from  IB_ContainerFiles WHERE Cnt_id = :id`,
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
 
     const fileName = fileRecord[0].Containerphoto;
 
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
       `DELETE FROM IB_ContainerFiles WHERE Cnt_id = :id`,
       {
         replacements: { id },
         type: db.Sequelize.QueryTypes.DELETE
       }
     );
 
     // Get updated file list
     const test = await db.sequelize.query(
       "SELECT * FROM IB_ContainerFiles WHERE IB_id = :Eb_Id",
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
  router.delete('/shipping/:id/:Bid', async (req, res) => {
   const id = req.params.id;
   const Eb_Id = req.params.Bid;
 
   try {
     // Get record by ID
     const fileRecord = await db.sequelize.query(
       ` select Emptyreturncopy from  IB_EmptyreturnFiles WHERE ERF_id = :id`,
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
 
     const fileName = fileRecord[0].Emptyreturncopy;
 
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
       `DELETE FROM IB_EmptyreturnFiles WHERE ERF_id = :id`,
       {
         replacements: { id },
         type: db.Sequelize.QueryTypes.DELETE
       }
     );
 
     // Get updated file list
     const test = await db.sequelize.query(
       "SELECT * FROM IB_EmptyreturnFiles WHERE IB_id = :Eb_Id",
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
