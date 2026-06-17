const express = require("express");
const router = express.Router();
const db = require("../../config/dbconnection");
const LoginDetails = db.LoginDetails;
const verifytoken = require('../../middlewares/verifytoken');

router.get("/Getall/:role/:Id", verifytoken, function (req, res, next) {
    const role = req.params.role;
     const id = req.params.Id;
    db.sequelize.query(
         "select User_ID,CompanyName,BranchName,BranchCode,Address,status from UserLoginDetails  where User_Roleid='7' and Clientid='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
        })
        .catch(error => {
            console.error("Error fetching Country:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/getvalue/:id", verifytoken, async (req, res) => {
  try {
    const id = req.params.id;

    const branchAdmin = await LoginDetails.findOne({
      where: { User_ID: id },
    });

    if (!branchAdmin) {
      return res.status(404).json({
        success: false,
        message: "Branch admin not found",
      });
    }

    
    const subAdmins = await LoginDetails.findAll({
      where: { Clientid: id },
    });

  
    const subAdminIds = subAdmins.map((sub) => sub.User_ID);

   
    let userDetails = [];
    if (subAdminIds.length > 0) {
      userDetails = await LoginDetails.findAll({
        where: { Clientid: subAdminIds },
      });
    }

   
    res.status(200).json({
      success: true,
      branchAdmin,
      subAdmins,
      userDetails,
    });

  } catch (err) {
    console.error("Error fetching details:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching details",
      error: err.message,
    });
  }
});



router.delete("/delete/:id", verifytoken, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // convert to number

     await db.sequelize.query(
            `
            UPDATE UserLoginDetails 
            SET status = :status
            WHERE User_ID = :id
        `,
            {
              replacements: {
                status: 0,
                id: id,
              },
              type: db.sequelize.QueryTypes.UPDATE,
            }
          );
   
    res.status(200).json({
      success: true,
      message: "Branch admin deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error deleting branch admin",
      error: err.message,
    });
  }
});



module.exports = router;
