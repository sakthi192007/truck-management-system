const express = require('express');
const { parseISO } = require('date-fns');
const router = express.Router();
const db = require('../../config/dbconnection');
const sequelize = db.sequelize;
const LoginDetails = db.LoginDetails;
const userdetails = db.userdetails;
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { storage } = require('../../middlewares/storage');

router.post('/', verifytoken, async function (req, res, next) {
    const jsondata = req.body;
    try {
        const role = await db.sequelize.query(`SELECT RoleCode FROM RoleTable WHERE RoleName = 'Branch Admin'`);
        const clientRoleCode = role[0][0]?.RoleCode;

        const newCompany = await LoginDetails.create({
            CompanyName: jsondata.CompanyName,
            BranchName: jsondata.BranchName,
             UserName: jsondata.BranchName,
            GSTNo: jsondata.GSTNo,
            PanNumber: jsondata.PanNumber,
            PostalCode: jsondata.PostalCode,
            City: jsondata.City,
            State: jsondata.State,
            Country: jsondata.Country,
            Email: jsondata.Email,
            PhoneNumber: jsondata.PhoneNumber,
            Address: jsondata.Address,
            status: jsondata.Status,
            Description: jsondata.Description,
            Clientid: jsondata.User_ID,
            User_Roleid: clientRoleCode,
            BranchCode: jsondata.Branch,
            Image: jsondata.Image
        });

 const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false, // use STARTTLS
      auth: {
        user: 'contact@infologia.in',
        pass: 'Welcome@123',
      },
    });

    const templateotp = CF.Organisation(jsondata.BranchName);
    const mailOptions = {
      from: 'contact@infologia.in',
      to: jsondata.Email,
      subject: 'Password help has arrived!',
      html: templateotp,
    };

   
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');


        const response = CF.getStandardResponse(201, "Branch created successfully", { 
            Name: newCompany.BranchName, 
            id: newCompany.User_ID 
        });
        res.status(201).send(response);

    } catch (err) {
        winston.error('postBranchDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});


router.put('/update/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    try {
       
        const updatedCompanyData = {
            CompanyName: jsondata.CompanyName,
            BranchName: jsondata.BranchName,
             UserName: jsondata.BranchName,
            GSTNo: jsondata.GSTNo,
            PanNumber: jsondata.PanNumber,
            PostalCode: jsondata.PostalCode,
            City: jsondata.City,
            State: jsondata.State,
            Country: jsondata.Country,
            Email: jsondata.Email,
            PhoneNumber: jsondata.PhoneNumber,
            Address: jsondata.Address,
            status: jsondata.Status,
            Description: jsondata.Description,
            BranchCode: jsondata.Branch,
            Image:jsondata.Image
        };

        try {
            const updatedCompany = await LoginDetails.update(updatedCompanyData, {
                where: { User_ID: id }
            });
            const response = CF.getStandardResponse(201, "Branch Update successfully",{ Name: updatedCompanyData.BranchName,id:updatedCompanyData.User_ID });
        res.status(201).send(response);
        } catch (error) {
            console.error('Error updating company:', error);
        }
       
    } catch (err) {
        winston.error('putBranchDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

/// SubAdmin 

router.post('/Subadmin/:Name/:id/:logo', verifytoken, async function (req, res, next) {
  const jsondata = req.body;
  const Names = req.params.Name;
  const id = req.params.id;
  const logo = req.params.logo;

  try {
    const role = await db.sequelize.query(
      `SELECT RoleCode FROM RoleTable WHERE RoleName = 'Sub Admin'`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );

    const clientRoleCode = role[0]?.RoleCode;
    if (!clientRoleCode) {
      return res.status(400).json({
        response_code: "400",
        response_message: "Sub Admin role not found in RoleTable.",
      });
    }

    const insertPromises = jsondata.map(async (item) => {
      const BranchName = item.BranchNameAdmin || null;
      const SubadminName = item.SubAdminName || null;
      const CompanyName = Names || null;
      const Email = item.SubAdminEmail || null;
      const PhoneNumber = item.SubAdminPhone || null;
      const status = item.Subadminstatus || null;

      const sql = `
        INSERT INTO UserLoginDetails 
        (Clientid, User_Roleid, BranchName, UserName, CompanyName, Email, PhoneNumber, status,Image) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
      `;

      await db.sequelize.query(sql, {
        replacements: [
          id,
          clientRoleCode,
          BranchName,
          SubadminName,
          CompanyName,
          Email,
          PhoneNumber,
          status,
          logo
        ],
        type: db.Sequelize.QueryTypes.INSERT,
      });


    });

    await Promise.all(insertPromises);

    const querystring = `
      SELECT User_ID, UserName 
      FROM UserLoginDetails 
      WHERE User_Roleid = ? AND Clientid = ?
    `;

    const data = await db.sequelize.query(querystring, {
      replacements: [clientRoleCode, id],
      type: db.Sequelize.QueryTypes.SELECT,
    });

    res.status(201).json({
      response_code: "201",
      response_message: "Branch created successfully.",
      data,
    });

  } catch (err) {
    console.error("Error in /Subadmin route:", err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

router.put('/Subadminupdate/:Name/:id/:logo', verifytoken, async function (req, res, next) {
  const jsondata = req.body;
  const Names = req.params.Name;
  const id = req.params.id;
    const logo = req.params.logo;

  try {
    const role = await db.sequelize.query(
      `SELECT RoleCode FROM RoleTable WHERE RoleName = 'Sub Admin'`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );

    const clientRoleCode = role[0]?.RoleCode;
    if (!clientRoleCode) {
      return res.status(400).json({
        response_code: "400",
        response_message: "Sub Admin role not found in RoleTable.",
      });
    }

    const promises = jsondata.map(async (item) => {
      const BranchName = item.BranchNameAdmin || null;
      const SubadminName = item.SubAdminName || null;
      const CompanyName = Names || null;
      const Email = item.SubAdminEmail || null;
      const PhoneNumber = item.SubAdminPhone || null;
      const status = item.Subadminstatus || null;
      const User_ID = item.SubAdminId || null;

      if (User_ID) {
        const updateSql = `
          UPDATE UserLoginDetails
          SET BranchName = ?, UserName = ?, CompanyName = ?, 
              Email = ?, PhoneNumber = ?, status = ?,Image=?
          WHERE User_ID = ?
        `;
        await db.sequelize.query(updateSql, {
          replacements: [
            BranchName,
            SubadminName,
            CompanyName,
            Email,
            PhoneNumber,
            status,
            logo,
            User_ID,
          ],
          type: db.Sequelize.QueryTypes.UPDATE,
        });
      } else {
        const insertSql = `
          INSERT INTO UserLoginDetails 
          (Clientid, User_Roleid, BranchName, UserName, CompanyName, Email, PhoneNumber, status,Image) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
        `;
        await db.sequelize.query(insertSql, {
          replacements: [
            id,
            clientRoleCode,
            BranchName,
            SubadminName,
            CompanyName,
            Email,
            PhoneNumber,
            status,
            logo
          ],
          type: db.Sequelize.QueryTypes.INSERT,
        });

      //  await getEmail(Email);
      }
    });

    await Promise.all(promises);

    const querystring = `
      SELECT User_ID, UserName 
      FROM UserLoginDetails 
      WHERE User_Roleid = ? AND Clientid = ?
    `;
    const data = await db.sequelize.query(querystring, {
      replacements: [clientRoleCode, id],
      type: db.Sequelize.QueryTypes.SELECT,
    });

    res.status(201).json({
      response_code: "201",
      response_message: "Branch/Subadmin details processed successfully.",
      data,
    });

  } catch (err) {
    console.error("Error in /Subadminupdate route:", err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

//user
router.post('/User/:logo/:companyName', verifytoken, async function (req, res, next) {
  const jsondata = req.body;
    const logo = req.params.logo;
    const companyName = req.params.companyName;
 
  try {
    const role = await db.sequelize.query(
      `SELECT RoleCode FROM RoleTable WHERE RoleName = 'User'`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );

    const clientRoleCode = role[0]?.RoleCode;
    if (!clientRoleCode) {
      return res.status(400).json({
        response_code: "400",
        response_message: "Sub Admin role not found in RoleTable.",
      });
    }

    const insertPromises = jsondata.map(async (item) => {
      const Clientid = item.SubadminName || null;
      const UserName = item.UserName || null;
      const Email = item.UserEmail || null;
      const PhoneNumber = item.UserPhone || null;
      const status = item.Userstatus || null;

      const sql = `
        INSERT INTO UserLoginDetails 
        (Clientid, User_Roleid, UserName, Email, PhoneNumber, status,Image,companyName) 
        VALUES (?, ?, ?, ?, ?, ?,?,?)
      `;

      await db.sequelize.query(sql, {
        replacements: [
          Clientid,
          clientRoleCode,
          UserName,
          Email,
          PhoneNumber,
          status,
          logo,
          companyName
        
        ],
        type: db.Sequelize.QueryTypes.INSERT,
      });

     // await getEmail(Email);
    });

    await Promise.all(insertPromises);

   
 const response = CF.getStandardResponse(201, "User created successfully");
        res.status(201).send(response);

  } catch (err) {
    console.error("Error in /Subadmin route:", err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

router.put('/Userupdate/:logo/:companyName', verifytoken, async function (req, res, next) {
  const jsondata = req.body;
    const logo = req.params.logo;
    const companyName = req.params.companyName;

    console.log(jsondata);
 
  try {
    const role = await db.sequelize.query(
      `SELECT RoleCode FROM RoleTable WHERE RoleName = 'User'`,
      { type: db.Sequelize.QueryTypes.SELECT }
    );

    const clientRoleCode = role[0]?.RoleCode;
    if (!clientRoleCode) {
      return res.status(400).json({
        response_code: "400",
        response_message: "User role not found in RoleTable.",
      });
    }

    const promises = jsondata.map(async (item) => {
      const Clientid = item.SubadminName || null;
      const UserName = item.UserName || null;
      const Email = item.UserEmail || null;
      const PhoneNumber = item.UserPhone || null;
      const status = item.Userstatus || null;
      const User_ID = item.UserAdminId || null;
   

      if (User_ID) {
        const updateSql = `
          UPDATE UserLoginDetails
          SET UserName = ?,Email = ?, PhoneNumber = ?, status = ?,Clientid = ?,Image=?,companyName=?
          WHERE User_ID = ?
        `;
        await db.sequelize.query(updateSql, {
          replacements: [
           UserName,
            Email,
            PhoneNumber,
            status,
            Clientid,
            logo,
            companyName,
            User_ID
          ],
          type: db.Sequelize.QueryTypes.UPDATE,
        });
      } else {
        const insertSql = `
          INSERT INTO UserLoginDetails 
          (Clientid, User_Roleid, UserName, Email, PhoneNumber, status,Image,CompanyName) 
          VALUES (?, ?, ?, ?, ?, ?,?,?)
        `;
        await db.sequelize.query(insertSql, {
          replacements: [
            Clientid,
            clientRoleCode,
           UserName,
            Email,
            PhoneNumber,
            status,
            logo,
            companyName
            
          ],
          type: db.Sequelize.QueryTypes.INSERT,
        });

        //await getEmail(Email);
      }
    });

    await Promise.all(promises);

   const response = CF.getStandardResponse(201, "User created successfully");
        res.status(201).send(response);

  } catch (err) {
    console.error("Error in /Subadminupdate route:", err);
    const response = CF.getStandardResponse(500, "Something went wrong");
    res.status(500).send(response);
  }
});

async function getEmail(Email) {

     userdetails.findOne({
                where: {
                    Email: Email
                }
        
            }).then(user => {
                if (user) {
                    const logreg = new logdetails({
                        createdby: user.User_ID,
                        otp: rnumber
                    });
        
                    logreg.save().then(() => {
                        var data = {
                            to: user.Email,
                            from: "manimaranilt@gmail.com",
                            template: 'forgot_password_email',
                            subject: 'Password help has arrived!',
                            context: {
                                OTP: rnumber,
                                name: user.UserName
                            }
                        };
                        var transporter = nodemailer.createTransport({
                            host: 'smtp.hostinger.com',
                            port: 587,
                            auth: {
                                user: "contact@infologia.in",
                                pass: "Welcome@123"
                            }
                        });
        
                        var otps = data.context.OTP;
                        var names = data.context.name;
        
                        let templateotp = CF.forgortopt(names, otps);
                        var mailOptions = {
                            from: "contact@infologia.in",
                            to: user.Email,
                            subject: "Password help has arrived!",
                            html: templateotp
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
                        var response = CF.getStandardResponse(200, "Password reset details sent to your email id");
                        return res.status(200).send(response);
        
        
                    }).catch(err => {
                        winston.error('Error saving logreg:', err);
                        var response = CF.getStandardResponse(401, "Something went wrong please contact support team");
                        return res.status(401).send(response);
                    });
                } else {
                    var response = CF.getStandardResponse(401, "Invalid Email id");
                    return res.status(401).send(response);
                }
            }).catch(err => {
                winston.error('forgotpassword' + err);
                var response = CF.getStandardResponse(401, "Something went wrong please contact support team");
                return res.status(401).send(response);
            });

}
module.exports = router;