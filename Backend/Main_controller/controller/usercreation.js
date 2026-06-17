const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const sequelize = db.sequelize;
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const registration = db.userdetails;

router.post('/Usercreation', function (req, res) {
  
    sequelize.query("select * from UserLoginDetails where Email='"+req.body.Email+"' and PhoneNumber='"+req.body.PhoneNumber+"' and User_Roleid='"+req.body.User_Roleid+"' ",
      { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
  
    if (user.length > 0) {
      const response = CF.getStandardResponse(400, "User already exists.");
      return res.status(400).send(response);
    } else {
      const userreg = new registration(req.body);
      console.log(userreg);
      userreg.save()
        .then(data => {
          winston.info('Created user: ' + JSON.stringify(data));
          const response = CF.getStandardResponse(200, "User created successfully.",data);
          return res.status(200).send(response);
        })
        .catch(err => {
          winston.error('Error saving user: ' + err);
          const response = CF.getStandardResponse(500, "Something went wrong while creating user.");
          return res.status(500).send(response);
        });
    }
  }).catch(err => {
    winston.error('Query error: ' + err);
    const response = CF.getStandardResponse(500, "Database error.");
    return res.status(500).send(response);
  });
});

module.exports = router;