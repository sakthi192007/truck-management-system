//packages
const bcrypt = require("bcrypt");
const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
//router
const router = express.Router();
//database connection
const db = require('../../config/dbconnection');
const LoginDetails = db.LoginDetails;
//config
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const { storage } = require('../../middlewares/storage');

//insert
var upload = multer({ storage: storage }).single('file');




router.post('/post', verifytoken, async function (req, res, next) {
    const uploadedFile = req.files;
    const jsondata = req.body;

    try {
        const role = await db.sequelize.query(`SELECT RoleCode FROM RoleTable WHERE RoleName = 'Organisation'`);
        const clientRoleCode = role[0][0]?.RoleCode;
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const logo_file = uploadedFile && uploadedFile.CompanyLogo ? `logo_${formattedDate}_${uploadedFile.CompanyLogo.name}` : null;


        const newCompany = await LoginDetails.create({
            CompanyName: jsondata.CompanyName,
            UserName: jsondata.UserName,
            GSTNo: jsondata.GSTNo,
            PanNumber: jsondata.PanNumber,
            PostalCode: jsondata.PostalCode,
            City: jsondata.City,
            State: jsondata.State,
            Country: jsondata.Country,
            Email: jsondata.Email,
            PhoneNumber: jsondata.PhoneNumber,
            Address: jsondata.Address,
            status: jsondata.status,
            description: jsondata.description,
            Image: logo_file,
            Clientid: jsondata.User_ID,
            User_Roleid: clientRoleCode
        });


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
            if (fieldName === "CompanyLogo") {
                const newFileName = `logo_${formattedDate}_${uploadedFile.CompanyLogo.name}`;
                saveFile(uploadedFile.CompanyLogo, newFileName);
            }
        }
 
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false, // use STARTTLS
      auth: {
        user: 'contact@infologia.in',
        pass: 'Welcome@123',
      },
    });

    const templateotp = CF.Organisation(jsondata.CompanyName);
    const mailOptions = {
      from: 'contact@infologia.in',
      to: jsondata.Email,
      subject: 'Password help has arrived!',
      html: templateotp,
    };

   
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');

   
    const response = CF.getStandardResponse(201, 'Organisation created successfully');
    res.status(201).send(response);
  } catch (err) {
    winston.error('postOrganisation: ' + err);
    const response = CF.getStandardResponse(500, 'Something went wrong');
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
        const logo_file = uploadedFile && uploadedFile.CompanyLogo ? `logo_${formattedDate}_${uploadedFile.CompanyLogo.name}` : null;

        const updatedCompanyData = {
            CompanyName: jsondata.CompanyName,
            UserName: jsondata.UserName,
            GSTNo: jsondata.GSTNo,
            PanNumber: jsondata.PanNumber,
            PostalCode: jsondata.PostalCode,
            City: jsondata.City,
            State: jsondata.State,
            Country: jsondata.Country,
            Email: jsondata.Email,
            PhoneNumber: jsondata.PhoneNumber,
            Address: jsondata.Address,
            status: jsondata.status,
            description: jsondata.description,
            Image: logo_file,

        };
if (!logo_file) {
  delete updatedCompanyData.Image;
}
        try {
            const updatedCompany = await LoginDetails.update(updatedCompanyData, {
                where: { User_ID: id }
            });
            console.log('Company updated successfully:', updatedCompany);
        } catch (error) {
            console.error('Error updating company:', error);
        }

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

            if (fieldName === "CompanyLogo") {
                const newFileName = `logo_${formattedDate}_${uploadedFile.CompanyLogo.name}`;
                saveFile(uploadedFile.CompanyLogo, newFileName);
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
//getgridvalues
router.get("/gridvalues/:id/:role", verifytoken, function (req, res, next) {
    const id = req.params.id;
    const role = req.params.role;
    querystring = ""
    if (role == 0) {
        querystring = "select User_ID as Client_ID, Email,CompanyName,PhoneNumber,Address,createdOn from UserLoginDetails  where User_Roleid= 3"
    } else {
        querystring = "select User_ID as Client_ID, Email,CompanyName,PhoneNumber,Address,createdOn from UserLoginDetails  where User_Roleid= 3 and User_ID=" + id + ""

    }
    db.sequelize.query(
        "" + querystring + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Userdetails");
        })
        .catch(error => {
            console.error("Error fetching User details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
//delete
router.delete('/user/:id', verifytoken, function (req, res, next) {

    const id = req.params.id;
    LoginDetails.destroy({
        where: {
            User_ID: id
        }
    })
        .then(Register => {
            if (!Register) {
                return res.status(404).send({
                    message: "Userdetails not found with id " + req.params.id
                });
            }
            winston.info('deleteUserdetails/id' + id)
            res.send({
                message: "Client Details deleted successfully!"
            });

        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Client Details not found with id " + req.params.id
                });
            }
            var response = CF.getStandardResponse(500, "Something wrong while deleted.");
            return res.status(500).send(response)
            winston.error('deleteUserdetails' + err)
        });
});
//get all data
router.get("/Usergetupdate/:id", verifytoken, function (req, res, next) {
    const id = req.params.id;
    db.sequelize.query(
        " select * from UserLoginDetails where User_ID=" + id + "", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("getUserDetails");
        })
        .catch(error => {
            console.error("Error fetching client details:", error);
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