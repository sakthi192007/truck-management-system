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

router.post('/user', verifytoken, async function(req, res, next) {
    const jsondata = req.body;
    console.log(jsondata)
    try {
  
        const newCompany = await LoginDetails.create({
            User_Roleid: jsondata.role,
            UserName: jsondata.first_name,
            Password: jsondata.Password,
            Email: jsondata.email,
            PhoneNumber: jsondata.phno,
            Address:jsondata.address,
            status : jsondata.status,
            description : jsondata.description,
            Clientid:jsondata.Clientid,
            CompanyName:jsondata.CompanyName,
            Image:jsondata.Image
        });


        const response = CF.getStandardResponse(201, "User created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postUserDetails: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

router.put('/userupdate/:id', verifytoken, async function(req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;

    try {

        const updatedCompany = await LoginDetails.update({
            Email: jsondata.email,
            Password: jsondata.Password,
            User_Roleid: jsondata.role,
            PhoneNumber: jsondata.phno,
            Address:jsondata.address,
            status : jsondata.status,
            description : jsondata.description,
            UserName: jsondata.first_name,
            Image:jsondata.Image

        }, {
            where: { User_ID: id }
        });


        var response = CF.getStandardResponse(201, "User Update successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('putUser: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.get("/gridvalues/:id/:role", verifytoken, function (req, res, next) {
  const role = req.params.role;
  const id = req.params.id;

  let querystring = "EXEC LoginDetails_Information @ClientId = '"+id+"', @User_Roleid ='"+role+"'"; 


  db.sequelize
    .query(querystring, { type: db.Sequelize.QueryTypes.SELECT })
    .then((data) => {
      res.status(200).send({
        response_code: "200",
        response_message: "success.",
        data,
      });
      winston.info("Userdetails");
    })
    .catch((error) => {
      console.error("Error fetching User details:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error",
      });
    });
});
router.get("/getcompany/:role/:id", verifytoken, function (req, res, next) {
  const role = req.params.role;
  const id = req.params.id;

  let querystring = "select CompanyName,User_ID from UserLoginDetails where User_ID='"+id+"'"; 

  db.sequelize
    .query(querystring, { type: db.Sequelize.QueryTypes.SELECT })
    .then((data) => {
      res.status(200).send({
        response_code: "200",
        response_message: "success.",
        data,
      });
      winston.info("Userdetails");
    })
    .catch((error) => {
      console.error("Error fetching User details:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error",
      });
    });
});
router.get("/getbranch/:Id", verifytoken, function (req, res, next) {
  const id = req.params.Id;

  let querystring = "select Branch from states where state_id='"+id+"'"; 

  db.sequelize
    .query(querystring, { type: db.Sequelize.QueryTypes.SELECT })
    .then((data) => {
      res.status(200).send({
        response_code: "200",
        response_message: "success.",
        data,
      });
      winston.info("Userdetails");
    })
    .catch((error) => {
      console.error("Error fetching User details:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error",
      });
    });
});
router.get("/getrole/:Role", verifytoken, function (req, res, next) {
   const id = parseInt(req.params.Role);

  let querystring = "EXEC GetRolesByAccess @Role ='"+id+"'"; 


  db.sequelize
    .query(querystring, { type: db.Sequelize.QueryTypes.SELECT })
    .then((data) => {
      res.status(200).send({
        response_code: "200",
        response_message: "success.",
        data,
      });
      winston.info("Userdetails");
    })
    .catch((error) => {
      console.error("Error fetching User details:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error",
      });
    });
});
router.get("/getroles/:Role", verifytoken, function (req, res, next) {
   const id = parseInt(req.params.Role);

  let querystring = "EXEC GetRolesByAccessMater @Role ='"+id+"'"; 


  db.sequelize
    .query(querystring, { type: db.Sequelize.QueryTypes.SELECT })
    .then((data) => {
      res.status(200).send({
        response_code: "200",
        response_message: "success.",
        data,
      });
      winston.info("Userdetails");
    })
    .catch((error) => {
      console.error("Error fetching User details:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error",
      });
    });
});
router.get("/getnamelist/:Role/:id", verifytoken, function (req, res, next) {
   const role = parseInt(req.params.Role);
   const id = parseInt(req.params.id);

  let querystring = "EXEC GetUserListByRoleOrHierarchy @Role ='"+role+"', @UserID ='"+id+"'"; 


  db.sequelize
    .query(querystring, { type: db.Sequelize.QueryTypes.SELECT })
    .then((data) => {
      res.status(200).send({
        response_code: "200",
        response_message: "success.",
        data,
      });
      winston.info("Userdetails");
    })
    .catch((error) => {
      console.error("Error fetching User details:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error",
      });
    });
});

router.get("/getroleupdate/:Role", verifytoken, async function (req, res, next) {
  try {
    const id = parseInt(req.params.Role);
    let whereCondition = "";

   whereCondition = "RoleCode = :id";

    const data = await db.sequelize.query(
      `SELECT Roleid, RoleName, RoleCode 
       FROM RoleTable 
       WHERE status = 1 AND ${whereCondition}`,
      {
        replacements: { id }, // safely pass parameter
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      data,
    });
    winston.info("User Role fetched successfully");
  } catch (error) {
    console.error("Error fetching User Role:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error",
    });
  }
});
router.get("/getrolemaster/:Role", verifytoken, async function (req, res, next) {
  try {
    const id = parseInt(req.params.Role);
    const data = await db.sequelize.query(
      `EXEC GetRolesByLoginRole @RoleID =:id`,
      {
        replacements: { id }, // safely pass parameter
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success",
      data,
    });
    winston.info("User Role fetched successfully");
  } catch (error) {
    console.error("Error fetching User Role:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error",
    });
  }
});


router.get("/Usergetupdate/:id", verifytoken, function(req, res, next) {
    const id = req.params.id;
    
    LoginDetails.findByPk(id)
        .then((data) => {
            if (!data) {
                const response = CF.getStandardResponse(401, "UserDetails not found");
                return res.status(401).send(response);
            } else {
                winston.info("getUserDetails");
                return res.status(200).send({
                    response_code: "200",
                    response_message: "success.",
                    data,
                });
            }
        })
        .catch((err) => {
            winston.error("/getUserDetails " + err);
            const response = CF.getStandardResponse(500, "Something went wrong");
            return res.status(500).send(response);
        });
});

router.delete('/user/:id', verifytoken, function(req, res, next) {

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
                message: "Userdetails deleted successfully!"
            });

        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Userdetails not found with id " + req.params.id
                });
            }
            var response = CF.getStandardResponse(500, "Something wrong while deleted.");
            return res.status(500).send(response)
            winston.error('deleteUserdetails' + err)
        });
});
router.post('/change-password/:id', verifytoken, async (req, res) => { 
  const id = req.params.id;
  const {oldpassword, confirmPassword } = req.body;

  try {
    const [rows] = await db.sequelize.query(
      'SELECT Password FROM UserLoginDetails WHERE User_ID = ?',
      { replacements: [id], type: db.Sequelize.QueryTypes.SELECT }
    );

    if (!rows || rows.length === 0) {
      const response = CF.getStandardResponse(404, "User not found");
      return res.status(404).send(response);
    }

    const storedPassword = rows.Password;
console.log(storedPassword);
    if (storedPassword !== oldpassword) {
      const response = CF.getStandardResponse(401, "Old password is incorrect");
      return res.status(401).send(response);
    }

    await db.sequelize.query(
      'UPDATE UserLoginDetails SET Password = ? WHERE User_ID = ?',
      { replacements: [confirmPassword, id] }
    );

    const response = CF.getStandardResponse(201, "Password changed successfully");
    return res.status(201).send(response);

  } catch (error) {
    winston.error('changePassword error: ' + error);
    const response = CF.getStandardResponse(500, "Something went wrong");
    return res.status(500).send(response);
  }
});
router.get("/getprofile/:id", verifytoken, function (req, res, next) {
    const id = parseInt(req.params.id); 
    db.sequelize.query("select User_ID,BranchName,User_Roleid,ProfileImage,Email,User_Roleid,UserName,PhoneNumber,Address,CompanyName from UserLoginDetails where User_ID='"+id+"'", { type: db.Sequelize.QueryTypes.SELECT })
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("User Role");
        })
        .catch(error => {
            console.error("Error fetching User Role:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});
router.get("/getimage/:id", verifytoken, function (req, res, next) {
    const id = parseInt(req.params.id); 
    db.sequelize.query("select ProfileImage from UserLoginDetails where User_ID='"+id+"'", { type: db.Sequelize.QueryTypes.SELECT })
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("User Role");
        })
        .catch(error => {
            console.error("Error fetching User Role:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});


router.put("/profile/:id",verifytoken, async function (req, res, next) {
    const id = req.params.id;
   const uploadedFile = req.files;
    const jsondata = req.body;

    console.log(uploadedFile);
    console.log(jsondata);
 const formattedDate = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');

        const Profile = uploadedFile && uploadedFile.file ? `Profile_${formattedDate}_${uploadedFile.file.name}` : null;
   
         try {
            const profile = await LoginDetails.update({
            UserName: jsondata.username,
            PhoneNumber: jsondata.contactNumber,
            ProfileImage: Profile
        }, {
            where: { User_ID: id }
        });
    const saveFile = (file, fileName) => {
              console.log(fileName);
              const destination = `./public/Profile/${fileName}`;
              
              fs.writeFile(destination, file.data, function(err){  
                  if(err){
                      console.error(err);
                      return res.status(500).send(CF.getStandardResponse(500,"Failed to save file."));
                  }
                  console.log(`File ${fileName} saved successfully.`);
              });
          };
          for (const fieldName in uploadedFile) {
              if(fieldName ==="file"){
                      const newFileName = Profile;
                      saveFile(uploadedFile.file, newFileName);
              }
          }
        var response = CF.getStandardResponse(201, "Profile Updated successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('putUser: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
   
})



router.get("/Approval/:id/:name", verifytoken, function (req, res, next) {
   const id = parseInt(req.params.id);
   const name = req.params.name;

  let querystring = "SELECT distinct M.Menukey,M.Menuname, M.Pagename,a.CanCreate,a.CanEdit,a.CanDelete,a.CanReport,a.CanView " +
                                " FROM SkybT_Menu M " +
                                " INNER JOIN SkybT_RolePermissions A ON M.Menukey = A.Menukey " +
                               " INNER JOIN SkybT_GroupMaster B ON B.GM_PK = A.GM_PK " +
								  " WHERE B.GM_Role = '"+id+"' and M.Pagename = '"+name+"'"; 
  db.sequelize
    .query(querystring, { type: db.Sequelize.QueryTypes.SELECT })
    .then((data) => {
      res.status(200).send({
        response_code: "200",
        response_message: "success.",
        data,
      });
      winston.info("Userdetails");
    })
    .catch((error) => {
      console.error("Error fetching User details:", error);
      res.status(500).send({
        response_code: "500",
        response_message: "Internal Server Error",
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