const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const userdetails = db.userdetails;
const Profiledetails = db.Profiledetails;
router.get('/change/:id', verifytoken, function(req, res, next) {
    const id = req.body.id;
    console.log(id);
    sequelize.query("select PhoneNumber,Password from SKY_usercreations where usercreationkey='" + id + "", {
            replacements: ['active'],
            type: sequelize.QueryTypes.SELECT

        })
        .then(data => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data

            });

            winston.info('getloanhistory')
        })
})
router.put('/profileupdate/:id', async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    try {
        const profile = await Profiledetails.update({
            Email: jsondata.email,
            Password: jsondata.Password,
            User_Roleid: jsondata.role,
            PhoneNumber: jsondata.phno,
            Address: jsondata.address,
            status: jsondata.status,
            description: jsondata.description,
            UserName: jsondata.UserName,
            Image: jsondata.Image
        }, {
            where: { User_ID: id }
        });

        var response = CF.getStandardResponse(201, "Profile Update successfully");
        res.status(201).send(response);
    } catch (err) {
        winston.error('putUser: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.get('/get/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const data = await db.sequelize.query(
      "SELECT UserName, Email,Image FROM UserLoginDetails WHERE User_ID = :userId",
      {
        replacements: { userId: userId },
        type: db.Sequelize.QueryTypes.SELECT
      }
    );

    res.status(200).send({
      response_code: "200",
      response_message: "success.",
      data,
    });

  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send({
      response_code: "500",
      response_message: "Internal Server Error"
    });
  }
});

module.exports = router;