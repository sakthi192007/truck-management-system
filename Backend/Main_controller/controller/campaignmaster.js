const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const nodemailer = require('nodemailer');
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const Campaignmaster = db.Campaignmaster;
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const { storage } = require('../../middlewares/storage');
var upload = multer({ storage: storage }).single('file');
const moment = require('moment');

const twilio = require('twilio');


const accountSid = 'AC73870c9a8278171263ba8c3048deb7b9';
const authToken = '1129763723e705f80cd8267360bca44e';
const fromNumber = 'whatsapp:+14155238886'; 
//const fromNumber = 'whatsapp:+9003041568';

const client = twilio(accountSid, authToken);

router.get("/Pushwhatsapp/:id", verifytoken, async function(req, res) {
    try {
        const id = req.params.id;

        const [campaign] = await db.sequelize.query(
            "SELECT CM_CampaignName, CM_Content FROM Campaignmaster WHERE CM_key = :id",
            {
                replacements: { id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        const vendors = await db.sequelize.query(
            `SELECT b.CompanyName, b.PhoneNumber 
             FROM CampaignDetails a 
             LEFT JOIN VendorsCompanyDetails b 
             ON a.CD_VendorID = b.CD_ID 
             WHERE a.CD_CampaignID = :id`,
            {
                replacements: { id },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        const messageResults = [];

        for (const vendor of vendors) {
            const phoneNumber = vendor.PhoneNumber;
            if (!phoneNumber) continue;

            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
            console.log("Sending to:", formattedPhone);

            try {
                const message = await client.messages.create({
                    from: fromNumber,
                    contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
                    contentVariables: JSON.stringify({ "1": campaign.CM_Content }),
                    to: 'whatsapp:8610084931'
                });
                console.log("sent to:", message);
                messageResults.push({ phoneNumber: formattedPhone, sid: message.sid, status: "sent" });
            } catch (twilioError) {
                console.error("Failed to send to:", formattedPhone, twilioError.message);
                messageResults.push({ phoneNumber: formattedPhone, error: twilioError.message, status: "failed" });
            }
        }

        return res.status(200).json({ success: true, results: messageResults });

    } catch (error) {
        console.error("Error sending WhatsApp messages:", error);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
});

// router.get("/Pushwhatsapp/:id", verifytoken, async function(req, res) {
//     try {
//         const id = req.params.id;

//         const [campaign] = await db.sequelize.query(
//             "SELECT CM_CampaignName, CM_Content FROM Campaignmaster WHERE CM_key = :id",
//             { replacements: { id }, type: db.Sequelize.QueryTypes.SELECT }
//         );

//         if (!campaign) {
//             return res.status(404).json({ success: false, message: "Campaign not found" });
//         }

//         const vendors = await db.sequelize.query(
//             "SELECT b.CompanyName, b.PhoneNumber FROM CampaignDetails a LEFT JOIN VendorsCompanyDetails b ON a.CD_VendorID = b.CD_ID WHERE a.CD_CampaignID = :id",
//             { replacements: { id }, type: db.Sequelize.QueryTypes.SELECT }
//         );

//         let messageResults = [];

//         for (const vendor of vendors) {
//             const phoneNumber = vendor.PhoneNumber;
        
//             if (!phoneNumber) continue;
//             console.log("Sending to:", phoneNumber);
        
//             try {
//                 await client.messages.create({
//                     from: fromNumber,
//                     to: `whatsapp:${phoneNumber}`,
//                     body: campaign.CM_Content
//                 });
        
//                 // Success - do not push
//             } catch (twilioError) {
//                 console.log("Failed:", phoneNumber, twilioError.message);
//                 messageResults.push({ phoneNumber, error: twilioError.message, status: "failed" });
//             }
//         }
        
//         res.status(200).json({ success: true, failed: messageResults });

//         res.status(200).json({ success: true, results: messageResults });

//     } catch (error) {
//         console.error("Error sending WhatsApp messages:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });




router.get("/getvendordata", verifytoken, function(req, res, next) {
  
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
router.post('/', verifytoken, async function (req, res, next) {
    const jsondata = req.body;
    try {
        const newCompany = await Campaignmaster.create({
            CM_CampaignName: jsondata.campaign_name,
            CM_Content: jsondata.message,
            CM_Status: 0
        });
        const campaignId = newCompany.CM_key; 
        const response = CF.getStandardResponse(201, "Campaign created successfully", { id: campaignId });
        res.status(201).json(response); // Use .json() instead of .send()

    } catch (err) {
        winston.error('postMasterLocation: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
})
router.post('/items', verifytoken, async function(req, res, next) {
    const jsondata = req.body;
   
       try {
           for (let i = 0; i < jsondata.length; i++) {
               const CD_CampaignID = jsondata[i].CD_CampaignID;
               const CD_VendorID = jsondata[i].CD_VendorID;
              
   
               var sql = "INSERT INTO CampaignDetails (CD_CampaignID,CD_VendorID) VALUES (?,?)";
               await db.sequelize.query(sql, {
                   replacements: [
                    CD_CampaignID, 
                    CD_VendorID
                      
   
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
router.put('/update/:id', verifytoken, async function(req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;

    try {
        const updated = await Campaignmaster.update(
            {
                CM_CampaignName: jsondata.campaign_name,
                CM_Content: jsondata.message,
                CM_Status: 0
            },
            {
                where: { CM_key: id }
            }
        );

        if (updated[0] === 0) {
            const response = CF.getStandardResponse(404, "Campaign not found");
            return res.status(404).json(response);
        }

        const response = CF.getStandardResponse(200, "Campaign updated successfully");
        res.status(200).json(response);

    } catch (err) {
        winston.error('updateCampaign: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).json(response);
    }
});
router.put('/updateItems/:id', verifytoken, async function(req, res, next) {
    const campaignId = req.params.id;
    const jsondata = req.body;

    try {
      
        await db.sequelize.query(
            "DELETE FROM CampaignDetails WHERE CD_CampaignID = ?",
            {
                replacements: [campaignId],
                type: db.sequelize.QueryTypes.DELETE
            }
        );

        // Insert new items
        for (let i = 0; i < jsondata.length; i++) {
            const CD_CampaignID = jsondata[i].CD_CampaignID;
            const CD_VendorID = jsondata[i].CD_VendorID;

            await db.sequelize.query(
                "INSERT INTO CampaignDetails (CD_CampaignID, CD_VendorID) VALUES (?, ?)",
                {
                    replacements: [CD_CampaignID, CD_VendorID],
                    type: db.sequelize.QueryTypes.INSERT
                }
            );
        }

        const response = CF.getStandardResponse(200, "Campaign items updated successfully");
        res.status(200).send(response);

    } catch (err) {
        winston.error('updateCampaignItems: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.get("/getvalue/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
            "select CM_key,CM_CampaignName,CM_Content FROM Campaignmaster where CM_key="+ id +" ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((booking) => {
            if (!booking) {
                winston.error("/getvendor" + err);
                var response = CF.getStandardResponse(500, "Something went to wrong");
                return res.status(500).send(response);
            } else {
                db.sequelize.query(
                        "with main as ( SELECT a.CD_VendorID as CD_ID,c.CompanyName as VendorName,'1' as status FROM CampaignDetails a left join VendorsCompanyDetails c on a.CD_VendorID=c.CD_ID where a.CD_CampaignID="+ id +" ), sub as ( select CD_ID,CompanyName as VendorName,'0'as status from VendorsCompanyDetails where CD_ID not in ( SELECT CD_VendorID FROM CampaignDetails where CD_CampaignID="+ id +" ) ) select distinct CD_ID,VendorName,status from main union all select distinct CD_ID,VendorName,status from sub ", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
                    )
                    .then((items) => {
                        console.log(items);
                        res.status(200).send({
                            response_code: "200",
                            response_message: "success.",
                            data: booking,
                            lineitems: items,
                        });
                        winston.info("getvendor");
                    })

            }

        })
        .catch(error => {
            console.error("Error fetching Clients:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });


});

//campaigngrid
router.get("/campaigngrid", verifytoken, function(req, res, next) {
    
    db.sequelize.query(
        "SELECT a.CM_key,a.CM_CampaignName, a.CM_Content, COUNT(b.CD_CampaignID) AS TotalResponses, SUM(CASE WHEN b.CD_Answer = 1 THEN 1 ELSE 0 END) AS Yes, SUM(CASE WHEN b.CD_Answer = 2 THEN 1 ELSE 0 END) AS No, SUM(CASE WHEN b.CD_Answer = 0 THEN 1 ELSE 0 END) AS NoReply, FORMAT(a.CM_Createdon, 'yyyy-MM-dd HH:mm')  AS CreatedTime,a.CM_Createdon FROM Campaignmaster a LEFT JOIN CampaignDetails b ON a.CM_key = b.CD_CampaignID GROUP BY a.CM_key,a.CM_CampaignName, a.CM_Content,a.CM_Createdon ORDER BY a.CM_Createdon DESC;", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
router.get("/vendorcampaigndata/:id/:value", verifytoken, function(req, res, next) {
    const id = req.params.id;
    const value = req.params.value;
    var valuesdata="";
    var CD_Answerdata="";

    if(value==1){
        valuesdata=   "SELECT b.CD_CampaignID, CONCAT(c.VendorCode, ' - ', c.CompanyName) AS VendorID,a.CM_CampaignName,FORMAT(b.CD_Createdon , 'yyyy-MM-dd HH:mm')  AS CreatedTime,CASE WHEN b.CD_Answer = 1 THEN 'Yes' ELSE NULL END AS responses"
CD_Answerdata="and CD_Answer=1";
 
    }else if(value==2){
        valuesdata=   "SELECT b.CD_CampaignID, CONCAT(c.VendorCode, ' - ', c.CompanyName) AS VendorID,a.CM_CampaignName,FORMAT(b.CD_Createdon , 'yyyy-MM-dd HH:mm')  AS CreatedTime,CASE WHEN b.CD_Answer = 2 THEN 'No' ELSE NULL END AS responses"
        CD_Answerdata="and CD_Answer=2";
    }else if(value==0){
        valuesdata=   "SELECT b.CD_CampaignID, CONCAT(c.VendorCode, ' - ', c.CompanyName) AS VendorID,a.CM_CampaignName,FORMAT(b.CD_Createdon , 'yyyy-MM-dd HH:mm')  AS CreatedTime,CASE WHEN b.CD_Answer = 0 THEN 'No Reply' ELSE NULL END AS responses"
        CD_Answerdata="and (CD_Answer=0 Or CD_Answer is null)";
    }
    else{
        valuesdata=   "SELECT b.CD_CampaignID, CONCAT(c.VendorCode, ' - ', c.CompanyName) AS VendorID, CM_CampaignName, CASE WHEN b.CD_Answer = 0 THEN 'No Reply' WHEN b.CD_Answer = 1 THEN 'Yes' WHEN b.CD_Answer = 2 THEN 'No' END AS responses, FORMAT(b.CD_Createdon, 'yyyy-MM-dd HH:mm') AS CreatedTime"
          "WHERE b.CD_Answer IN (0, 1, 2);";
    }
    db.sequelize.query(
        ""+valuesdata+" FROM Campaignmaster a LEFT JOIN CampaignDetails b ON a.CM_key = b.CD_CampaignID LEFT JOIN VendorsCompanyDetails c ON b.CD_VendorID = c.CD_ID where CD_CampaignID='"+id+"'"+CD_Answerdata+"", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
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
module.exports = router;