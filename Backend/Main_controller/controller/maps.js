const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const winston = require('../../middlewares/logger');
const CF = require('../../middlewares/commonfunction');
const fs = require('fs');

router.get("/Import/Mapdetails/:id", function (req, res) {

        const bookingId = req.params.id;
           const container = req.body.container;
    const query = "select c.Ml_LocationName as Full_Container_Pickup_From_CFS_Port, c.Ml_latitude as FullContainerPickup_lat, c.Ml_longitude as FullContainerPickup_long, d.Ml_LocationName as Factory_Gate_In, d.Ml_latitude as Factory_Gate_lat, d.Ml_longitude as Factory_Gate_long, e.Ml_LocationName as Empty_Container_Return_at_Yard, e.Ml_latitude as EmptyContainerReturn_lat, e.Ml_longitude as EmptyContainerReturn_long from Import_Bookings a left join IB_ItemDetails b on a.IB_id=b.IB_id left join MasterLocation c on b.ContainerPickupLocation=c.Ml_key left join MasterLocation d on b.DE_StuffingLocation=d.Ml_key left join MasterLocation e on b.EmptyReturnAt=e.Ml_key where a.IB_id='"+bookingId+"' and b.containernumber='"+container+"'";  // Modify query to match your DB structure
  
    db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT })
      .then(data => {
        res.status(200).send({
          response_code: "200",
          response_message: "Success",
          data
        });
        winston.info(" booking mile stone details fetched successfully");
      })
      .catch(error => {
        console.error("Error fetching booking mile stone details:", error);
        res.status(500).send({
          response_code: "500",
          response_message: "Internal Server Error"
        });
      });
  });

  router.get("/Export/Mapdetails/:id", function (req, res) {

        const bookingId = req.params.id;
           const container = req.body.container;
    const query = "select c.Ml_LocationName as Trailer_Reached_at_Empty_Yard, c.Ml_latitude as Empty_Yard_lat, c.Ml_longitude as Empty_Yard_long, d.Ml_LocationName as Factory_Gate_In, d.Ml_latitude as Factory_Gate_lat, d.Ml_longitude as Factory_Gate_long, e.Ml_LocationName as CFS_Gate_In, e.Ml_latitude as CFS_Gate_lat, e.Ml_longitude as CFS_Gate_long, f.Ml_LocationName as Port_Gate, f.Ml_latitude as Port_Gate_lat, f.Ml_longitude as Port_Gate_long from Export_Bookings a left join EB_ItemDetails b on a.EB_id=b.EB_id left join MasterLocation c on b.EmptyContainerPickup=c.Ml_key left join MasterLocation d on b.StuffingLocation=d.Ml_key left join MasterLocation e on a.PointOfClearance=e.Ml_key left join MasterLocation f on a.PortOfDischarge=f.Ml_key where a.EB_id='"+bookingId+"' and b.containernumber='"+container+"'";  // Modify query to match your DB structure
  
    db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT })
      .then(data => {
        res.status(200).send({
          response_code: "200",
          response_message: "Success",
          data
        });
        winston.info(" booking mile stone details fetched successfully");
      })
      .catch(error => {
        console.error("Error fetching booking mile stone details:", error);
        res.status(500).send({
          response_code: "500",
          response_message: "Internal Server Error"
        });
      });
  });

router.post('/Events', async function(req, res, next) {
    const Evdata = req.body;

      const ID = Evdata.EB_Id;
      const container = Evdata.container;
      const MilestoneName = Evdata.Milestone_name;
      const reachedTime = Evdata.reached_Time;
db.sequelize.query(
            "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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

async function sendEmailNotification(bookingnumber, containerId, milestone, Actual, names, email, res) {
    try {
       
        const milestoneData = await db.sequelize.query(
            "SELECT milestones FROM ExportMilestones WHERE EM_id=?",
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
        "select CustomerAddress,b.Ml_LocationName as locationName,LinearBkgno, c.SealNumber from Export_Bookings a left join MasterLocation b on a.PortOfDischarge = b.Ml_key left outer join EB_ItemDetails c on a.EB_id=c.EB_id where BookingNumber='"+bookingnumber+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
    .then((booking) => {
        
       
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
           // cc: "shankar@skybtrans.com, Yogapraveen@skybtrans.com",
            subject: "Milestone Status Alert",
            html: "<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <style> body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f6f6f6; } .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 10px 0; } .header h1 { margin: 0; color: #333333; } .content { padding: 20px 0; line-height: 1.6; } .content p { margin: 0 0 10px; } .footer { text-align: center; padding: 10px 0; color: #888888; } </style> </head> <body> <div class='container'> <div class='header'> <h1 style='text-transform: uppercase;'>milestone status</h1> </div> <div class='content'> <p> Dear Sir / Madam,</p> <p>Thank you for your booking!Exciting Milestone Update Inside.</p> <p><strong>Booking Details:</strong></p> <p >Infologia Booking NO:<span style='text-transform: uppercase;'>&nbsp;&nbsp;" + bookingnumber + "</span></p><p >ContainerNo:<span style='text-transform: uppercase;'>&nbsp;&nbsp;" + containerId + "</span></p> <p>Milestone:&nbsp;&nbsp;" + milestoneName + "</p> <p>Date:&nbsp;&nbsp;" + Actual + "</p><p>Booking From:"+names+"</p><p>Actual Shipper: "+booking[0].CustomerAddress+"</p><p>Port of Loading: "+booking[0].locationName+"</p><p>S/L Booking No: "+booking[0].LinearBkgno+"</p><p>SealNo: "+booking[0].SealNumber+"</p><p><strong>Cargo Weigth:</strong> "+arrayadd[0].CargoWeight+"</p><p><strong>Container Type:</strong> "+arrayadd.map(item => item.numbercontainer).join(", ")+"</p><p>If you have any questions or need further assistance, feel free to reach out Customer Service representative of Infologia Technologies.</p> <p> Warm Regards,<br>Infologia Technologies PVT. LTD.</p> </div> <div class='footer'> <p>&copy; 2024 Sky B Trans. All rights reserved.</p> </div> </div> </body> </html>",
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
module.exports = router;