const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const clientdetails = db.clientdetails;
const LoginDetails = db.LoginDetails;
const logdetails = db.logdetails;
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
var upload = multer({ storage: storage }).single('file');

router.post('/post', verifytoken, async function (req, res, next) {
    const uploadedFile = req.files;
    const jsondata = req.body;

    try {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const gstfle = uploadedFile && uploadedFile.gstfle ? `gst_${formattedDate}_${uploadedFile.gstfle.name}` : null;
        const panfle = uploadedFile && uploadedFile.panfle ? `pan_${formattedDate}_${uploadedFile.panfle.name}` : null;
        const smefle = uploadedFile && uploadedFile.smefle ? `sme_${formattedDate}_${uploadedFile.smefle.name}` : null;
        const rocfles = uploadedFile && uploadedFile.rocfle ? `Roc_${formattedDate}_${uploadedFile.rocfle.name}` : null;
        const tinfle = uploadedFile && uploadedFile.tinfle ? `tin_${formattedDate}_${uploadedFile.tinfle.name}` : null;
        const otherfiles = uploadedFile && uploadedFile.otherfile ? `OTH_${formattedDate}_${uploadedFile.otherfile.name}` : null;

        const newCompany = await clientdetails.create({
            FirstName: jsondata.FirstName,
            CompanyName: jsondata.CompanyName,
            Department: jsondata.Department,
            gst_number: jsondata.gst,
            pan_number: jsondata.pan,
            msme: jsondata.msme,
            tin_tan: jsondata.tin_tan,
            Email: jsondata.Email,
            PhoneNumber: jsondata.PhoneNumber,
            landline: jsondata.landline,
            City: jsondata.City,
            State: jsondata.State,
            Country: jsondata.Country,
            Zipcode: jsondata.Zipcode,
            status: jsondata.status,
            description: jsondata.description,
            CompanyAddress: jsondata.CompanyAddress,
            CompanyAddressLine1: jsondata.CompanyAddressLine1,
            GSTfile: gstfle,
            PANupload: panfle,
            smefle: smefle,
            tinfle: tinfle,
            rocfle: rocfles,
            otherfile: otherfiles,
            holder_name: jsondata.holder_name,
            bank_account: jsondata.bank_account,
            bank_name: jsondata.bank_name,
            ifsc_code: jsondata.ifsc_code,
            branch: jsondata.branch,
            bank_add: jsondata.bank_add,
            Business: jsondata.Business,
            CreatedBy: jsondata.CreatedBy
        });
        newCompany.Client_Id
        const saveFile = (file, fileName) => {
            const destination = `./public/clientdetails/${fileName}`;

            fs.writeFile(destination, file.data, function (err) {
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

        const response = CF.getStandardResponse(201, "Client created successfully", { id: newCompany.Client_Id });
        res.status(201).send(response);

    } catch (err) {
        winston.error('postClientDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }


});

async function getEmail(Email,role) {
  return new Promise((resolve, reject) => {
    const rnumber = Math.floor(Math.random() * 1000) + 9000;

    userdetails.findOne({
      where: {
        Email: Email,
        User_Roleid: role
      }
    })
    .then(user => {
      if (!user) {
        return resolve({ success: false, message: "Invalid Email id" });
      }
 const transporter = nodemailer.createTransport({
          host: 'smtp.hostinger.com',
          port: 587,
          auth: {
            user: "contact@infologia.in",
            pass: "Welcome@123"
          }
        });

        const templateotp = CF.Client(user.UserName);
        const mailOptions = {
          from: "contact@infologia.in",
          to: user.Email,
          subject: "Password help has arrived!",
          html: templateotp
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return resolve({ success: false, message: "Failed to send email", error: error.message });
          } else {
            console.log("Email sent: " + info.response);
            return resolve({ success: true, message: "Mail sent", message_id: info.response });
          }
        });
    })
    .catch(err => {
      winston.error('forgotpassword ' + err);
      resolve({ success: false, message: "Something went wrong" });
    });
  });
}

router.post('/User/:id/:clientId', verifytoken, async function (req, res, next) {
  const jsondata = req.body;
  const Userid = req.params.id;
  const client_Id = req.params.clientId;

  try {
    const existingUser = await LoginDetails.findOne({
      where: { UserClientId: client_Id, User_Roleid: 1 }
    });

    if (existingUser) {
      await LoginDetails.update(
        {
          CompanyName: jsondata.CompanyName,
          Image: jsondata.Image,
          UserName: jsondata.UserName,
          Email: jsondata.Email,
          status: jsondata.Status,
          UserClientId:client_Id
        },
        {
          where: { UserClientId: client_Id, User_Roleid: 1 }
        }
      );

      const emailResult = await getEmail(jsondata.Email,1);
      if (!emailResult.success) {
        winston.error('Email error:', emailResult.message);
      }

      const response = CF.getStandardResponse(200, "Client updated successfully");
      res.status(200).send(response);

    } else {
      await LoginDetails.create({
        CompanyName: jsondata.CompanyName,
        Image: jsondata.Image,
        UserName: jsondata.UserName,
        Email: jsondata.Email,
        status: jsondata.Status,
        User_Roleid: 1,
        Clientid: Userid,
         UserClientId:client_Id
      });

      const response = CF.getStandardResponse(201, "Client created successfully");
      res.status(201).send(response);
    }

  } catch (err) {
    winston.error('postClientDetails: ' + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

router.post('/Vendor/:id/:vendorId', verifytoken, async function (req, res, next) {
  const jsondata = req.body;
  const Userid = req.params.id;
  const vendorId = req.params.vendorId;
console.log(jsondata);
console.log(vendorId);
  try {
    const existingUser = await LoginDetails.findOne({
      where: { vendorId: vendorId, User_Roleid: 2 }
    });

    if (existingUser) {
      await LoginDetails.update(
        {
          CompanyName: jsondata.CompanyName,
          Image: jsondata.Image,
          UserName: jsondata.UserName,
          Email: jsondata.Email,
          status: jsondata.Status,
          vendorId:vendorId
        },
        {
          where: { vendorId: vendorId, User_Roleid: 2 }
        }
      );

      // const emailResult = await getEmail(jsondata.Email,2);
      // if (!emailResult.success) {
      //   winston.error('Email error:', emailResult.message);
      // }

      const response = CF.getStandardResponse(200, "Vendor updated successfully");
      res.status(200).send(response);

    } else {
      await LoginDetails.create({
        CompanyName: jsondata.CompanyName,
        Image: jsondata.Image,
        UserName: jsondata.UserName,
        Email: jsondata.Email,
        status: jsondata.Status,
        User_Roleid: 2,
        Clientid: Userid,
        vendorId:vendorId
      });
  //  const emailResult = await getEmail(jsondata.Email,2);
  //     if (!emailResult.success) {
  //       winston.error('Email error:', emailResult.message);
  //     }
      const response = CF.getStandardResponse(201, "Vendor created successfully");
      res.status(201).send(response);
    }

  } catch (err) {
    winston.error('postVendorDetails: ' + err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

//update

router.put('/update/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    const uploadedFile = req.files;


    try {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        // Conditional file name generation
        const gstfle = uploadedFile && uploadedFile.gstfle ? `gst_${formattedDate}_${uploadedFile.gstfle.name}` : null;
        const panfle = uploadedFile && uploadedFile.panfle ? `pan_${formattedDate}_${uploadedFile.panfle.name}` : null;
        const smefle = uploadedFile && uploadedFile.smefle ? `sme_${formattedDate}_${uploadedFile.smefle.name}` : null;
        const rocfles = uploadedFile && uploadedFile.rocfle ? `Roc_${formattedDate}_${uploadedFile.rocfle.name}` : null;
        const tinfle = uploadedFile && uploadedFile.tinfle ? `tin_${formattedDate}_${uploadedFile.tinfle.name}` : null;
        const otherfiles = uploadedFile && uploadedFile.otherfile ? `OTH_${formattedDate}_${uploadedFile.otherfile.name}` : null;



        // Create the update data object
        const updatedCompanyData = {
            FirstName: jsondata.FirstName,
            CompanyName: jsondata.CompanyName,
            Department: jsondata.Department,
            gst_number: jsondata.gst,
            pan_number: jsondata.pan,
            msme: jsondata.msme,
            tin_tan: jsondata.tin_tan,
            Email: jsondata.Email,
            password: jsondata.password,
            PhoneNumber: jsondata.PhoneNumber,
            landline: jsondata.landline,
            City: jsondata.City,
            State: jsondata.State,
            Country: jsondata.Country,
            Zipcode: jsondata.Zipcode,
            status: jsondata.status,
            CompanyAddress: jsondata.CompanyAddress,
            CompanyAddressLine1: jsondata.CompanyAddressLine1,
            description: jsondata.description,
            holder_name: jsondata.holder_name,
            bank_account: jsondata.bank_account,
            bank_name: jsondata.bank_name,
            ifsc_code: jsondata.ifsc_code,
            branch: jsondata.branch,
            bank_add: jsondata.bank_add,
            Business: jsondata.Business,
            modifiedBy: jsondata.modifiedBy,
            ...(gstfle && { GSTfile: gstfle }),       // Conditional assignment using spread operator
            ...(panfle && { PANupload: panfle }),     // Conditional assignment using spread operator
            ...(smefle && { smefle: smefle }),        // Conditional assignment using spread operator
            ...(tinfle && { tinfle: tinfle }),        // Conditional assignment using spread operator
            ...(rocfles && { rocfle: rocfles }),      // Conditional assignment using spread operator
            ...(otherfiles && { otherfile: otherfiles }) // Conditional assignment using spread operator
        };

        // Update the company record in the database
        try {
            const updatedCompany = await clientdetails.update(updatedCompanyData, {
                where: { Client_Id: id }
            });
            console.log('Company updated successfully:', updatedCompany);
        } catch (error) {
            console.error('Error updating company:', error);
        }

        // Save files
        const saveFile = (file, fileName) => {
            const destination = `./public/clientdetails/${fileName}`;
            fs.writeFile(destination, file.data, function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).send(CF.getStandardResponse(500, "Failed to save file."));
                }
                console.log(`File ${fileName} saved successfully.`);
            });
        };

        // Save all uploaded files
        const filePrefixes = {
            gstfle: 'gst',
            panfle: 'pan',
            smefle: 'sme',
            tinfle: 'tin',
            rocfle: 'Roc',
            otherfile: 'OTH'
        };

        for (const fieldName in uploadedFile) {
            if (filePrefixes[fieldName]) {
                const newFileName = `${filePrefixes[fieldName]}_${formattedDate}_${uploadedFile[fieldName].name}`;
                saveFile(uploadedFile[fieldName], newFileName);
            }
        }

        const response = CF.getStandardResponse(201, "Client updated successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('putClientDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.get("/allget/:id/:role", verifytoken, function (req, res, next) {
    const id = req.params.id;

   
    db.sequelize.query(
        "EXEC Clientinformation_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Clientdetails");
        })
        .catch(error => {
            console.error("Error fetching client details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getcountry", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select CountryId,Country_name from Country", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Country");
        })
        .catch(error => {
            console.error("Error fetching Country:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/customers/:id/:role", verifytoken, function (req, res, next) {
    const id = req.params.id;
    
    db.sequelize.query(
        "EXEC Clients_list @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Country");
        })
        .catch(error => {
            console.error("Error fetching Country:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/importcustomers/:id/:role", verifytoken, function (req, res, next) {
    const id = req.params.id;
    const role = req.params.role;

   
    db.sequelize.query(
         "EXEC ImportClients_list @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Country");
        })
        .catch(error => {
            console.error("Error fetching Country:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getstate", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select state_id,state_name from states", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Country");
        })
        .catch(error => {
            console.error("Error fetching Country:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getupdate/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    clientdetails.findByPk(id).then((data) => {
        if (!data) {
            var response = CF.getStandardResponse(401, "Companydetails not found");
            return res.status(401).send(response);
        } else {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
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
router.get("/getbusiness", verifytoken, function (req, res, next) {
    db.sequelize.query(
        "select NB_id,NatureofBusiness from Client_NatureofBusiness", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Business");
        })
        .catch(error => {
            console.error("Error fetching Business:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/CheckEmailExists", verifytoken, async (req, res) => {
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

    // ✅ Using Sequelize raw query
    const result = await db.sequelize.query(query, {
      replacements: { email },
      type: db.Sequelize.QueryTypes.SELECT,
    });

    const exists = result[0].Count > 0;

    // ✅ Send response in same style as getbusiness
    res.status(200).send({
      response_code: "200",
      response_message: "success",
      exists, // true / false
    });

    winston.info("Email validation check executed successfully");
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error",
    });
  }
});

module.exports = router;