const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const userdetails = db.userdetails;
const logdetails = db.logdetails;
const LoginDetails = db.LoginDetails;
const clientdetails = db.clientdetails;
const ClientLoginDetails = db.ClientLoginDetails;
const SubAdminLoginDetails = db.SubAdminLoginDetails;


router.post('/logins', async function (req, res) {
    try {
        const Email = req.body.email;
        const password = req.body.Password;
        const saltRounds = 10;
        const plaintextPassword = password;
        const hashedPassword = bcrypt.hashSync(plaintextPassword, saltRounds);


 const users = await db.sequelize.query(
            "EXEC LoginDetailsInformation @Email = :Email",
            { replacements: { Email }, type: db.Sequelize.QueryTypes.SELECT }
        );


        if (!users || users.length === 0) {
            var response = CF.getStandardResponse(404, "User not found.");
            return res.status(404).send(response);
        }

        const user = users[0]; // pick first row

        if (user && bcrypt.compareSync(user.Password, hashedPassword)) {
            const refreshToken = jwt.sign({ sub: user.User_ID }, config1.refreshTokenSecret, { expiresIn: config1.refreshTokenLife });
            const token = jwt.sign({ sub: user.User_ID }, config1.secret, { expiresIn: config1.tokenLife });

            const User_Roleid = user.User_Roleid;
            const User_ID = user.User_ID;
            const withoutParentQuery = `
                                SELECT distinct M.Menukey, M.Menutype, M.Menuname, M.Pagename, M.Menulist, M.Menuicon, M.Menudescription, M.Parentmenuid,a.CanCreate,a.CanEdit,a.CanDelete,a.CanReport,a.CanView
                                FROM SkybT_Menu M
                                INNER JOIN SkybT_RolePermissions A ON M.Menukey = A.Menukey
                                INNER JOIN SkybT_GroupMaster B ON B.GM_PK = A.GM_PK
                                INNER JOIN UserLoginDetails C ON B.GM_Role = C.User_Roleid
                                WHERE (M.Parentmenuid IS NULL OR M.Parentmenuid = 0)
                                  AND B.GM_Role = :User_Roleid  and M.SubParentid  IS   NULL  AND A.canmenu = 1
                                ORDER BY M.Menulist ASC
                            `;

            const withParentQuery = `
                                SELECT distinct M.Menukey, M.Menutype, M.Menuname, M.Pagename, M.Menulist, M.Menuicon, M.Menudescription, M.Parentmenuid,a.CanCreate,a.CanEdit,a.CanDelete,a.CanReport,a.CanView
                                FROM SkybT_Menu M
                                INNER JOIN SkybT_RolePermissions A ON M.Menukey = A.Menukey
                                INNER  JOIN SkybT_GroupMaster B ON B.GM_PK = A.GM_PK
                                INNER JOIN UserLoginDetails C ON B.GM_Role = C.User_Roleid
                                WHERE  M.Parentmenuid IS NOT NULL and M.SubParentid  IS  NULL   AND A.canmenu = 1
                                AND M.Parentmenuid != 0
                                  AND B.GM_Role = :User_Roleid
                                ORDER BY M.Menulist ASC
                            `;
                                const withchildmenuQuery = `
                                SELECT distinct M.Menukey, M.Menutype, M.Menuname, M.Pagename, M.Menulist, M.Menuicon, M.Menudescription, M.SubParentid,M.Parentmenuid,a.CanCreate,a.CanEdit,a.CanDelete,a.CanReport,a.CanView
                                FROM SkybT_Menu M
                                INNER JOIN SkybT_RolePermissions A ON M.Menukey = A.Menukey
                                INNER JOIN SkybT_GroupMaster B ON B.GM_PK = A.GM_PK
                                INNER JOIN UserLoginDetails C ON B.GM_Role = C.User_Roleid
                                WHERE  M.Parentmenuid IS NOT NULL and M.SubParentid  IS  NOT NULL    AND A.canmenu = 1
                                AND B.GM_Role = :User_Roleid
                                ORDER BY M.Menulist ASC

                            `;
                             const Branchdetails = ` EXEC GetBranchByUserID @UserID=:User_ID `;
            Promise.all([
                db.sequelize.query(withoutParentQuery, {
                    replacements: { User_Roleid: User_Roleid },
                    type: db.Sequelize.QueryTypes.SELECT
                }),
                db.sequelize.query(withParentQuery, {
                    replacements: { User_Roleid: User_Roleid },
                    type: db.Sequelize.QueryTypes.SELECT
                })
                ,
                db.sequelize.query(withchildmenuQuery, {
                    replacements: { User_Roleid: User_Roleid },
                    type: db.Sequelize.QueryTypes.SELECT
                }),
                db.sequelize.query(Branchdetails, {
                    replacements: { User_ID: User_ID },
                    type: db.Sequelize.QueryTypes.SELECT
                })
            ]).then(([withoutparentmenu, withparentmenu,withchildmenu,Branch_details]) => {

                res.status(200).send({
                    response_code: 200,
                    response_message: "Login success",
                    id: user.User_ID,
                    accessToken: token,
                    refreshToken: refreshToken,
                    User_Roleid: user.User_Roleid,
                    Image: user.Image,
                    Email: user.Email,
                    CompanyName: user.CompanyName,
                    UserName: user.UserName,
                    withoutparentmenu,
                    withparentmenu,
                    withchildmenu,
                    Branch_details,
                    ProfileImage: user.ProfileImage
                });

                winston.info('login user/id=' + user.User_ID);
            });
        }
        else {
            res.status(401).send({
                response_code: 401,
                response_message: "Invalid  password"
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send({
            response_code: 500,
            response_message: "Internal Server Error"
        });
    }
});


router.post('/forgot/:Email', function (req, res, next) {
    var rnumber = (Math.floor(Math.random() * 1000) + 9000);
    const Email = req.params.Email;
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
})
router.post('/verifyotp/:Otp/:Email', function (req, res, next) {

    const Email = req.params.Email;
    const Otp = req.params.Otp;

    userdetails.findOne({
        where: {
            Email: Email
        }
    }).then(user => {
        if (user) {
            logdetails.findOne({
                where: {
                    otp: Otp,
                    createdby: user.User_ID
                },
                order: [
                    ['createdOn', 'DESC'],
                ],
            }).then(logdet => {
                if (logdet) {
                    var moment = require("moment");
                    var curtime = moment();
                    // var createdtime = moment(logdet.createdOn, 'YYYY-MM-DD HH:mm:ss');
                    var createdtime = logdet.createdOn;
                    var curtimeDate = new Date(curtime);
                    var createdtimeDate = new Date(createdtime);
                    var diffMilliseconds = curtimeDate - createdtimeDate;
                    var diffMinutes = diffMilliseconds / (1000 * 60);
                    var absDiffMinutes = Math.abs(diffMinutes);
                    var roundedDiffMinutes = Math.round(absDiffMinutes);

                    if (roundedDiffMinutes > 10) {
                        winston.info('OTP verification success/Id=' + user.User_ID);
                        return res.status(200).send({
                            response_code: 200,
                            response_message: "OTP validation success",
                            logkey: logdet.logkey,
                        });
                    } else {
                        var response = CF.getStandardResponse(401, "OTP time expired");
                        return res.status(200).send(response);
                    }


                } else {
                    var response = CF.getStandardResponse(401, "Invalid Request");
                    return res.status(401).send(response)
                }
            })
        } else {
            var response = CF.getStandardResponse(401, "Invali emailid");
            return res.status(401).send(response)
        }
    }).catch(err => {
        winston.error('error' + err);
        var response = CF.getStandardResponse(500, "Something wrong while created.");
        return res.status(500).send(response)

    });
})
router.put('/resetpassword/:value/:id', function (req, res, next) {
    const Passwords = req.params.value;
    const logkey = req.params.id;

    logdetails.findOne({
        where: {
            logkey: logkey
        }
    }).then(logdetails => {
        if (logdetails) {
            LoginDetails.update({
                Password: Passwords
            }, {
                where: {
                    User_ID: logdetails.createdby
                },
            }).then(data => {
                if (!data) {
                    var response = CF.getStandardResponse(401, "This user not found");
                    return res.status(401).send(response)
                }
                winston.info('password will be changed/id=' + logdetails.createdby);
                var response = CF.getStandardResponse(200, "Details updated successfully");
                return res.status(200).send(response)
            })
                .catch(err => {
                    winston.error('error' + err);
                    var response = CF.getStandardResponse(500, "Something went to wrong");
                    return res.status(500).send(response)
                });
        } else {
            var response = CF.getStandardResponse(401, "Invalid request");
            return res.status(401).send(response)
        }
    })
})
router.put('/resetpassword', function (req, res, next) {
    const Passwords = req.body.value;
    const logkey = req.body.logkey;

    logdetails.findOne({
        where: { logkey: logkey }
    }).then(logdetails => {
        if (logdetails) {
            LoginDetails.update(
                { Password: Passwords },
                { where: { User_ID: logdetails.createdby } }
            ).then(async data => {
                if (!data || data[0] === 0) {
                    var response = CF.getStandardResponse(401, "This user not found");
                    return res.status(401).send(response);
                }

                winston.info('Password will be changed/id=' + logdetails.createdby);

                const user = await LoginDetails.findOne({
                    where: { User_ID: logdetails.createdby }
                });

                if (!user) {
                    var response = CF.getStandardResponse(401, "User details not found");
                    return res.status(401).send(response);
                }

                var response = CF.getStandardResponse(200, "Details updated successfully");
                response.data = {
                    User_ID: user.User_ID,
                    Email: user.Email && user.Email.trim(),
                    PhoneNumber: user.PhoneNumber,
                    Address: user.Address,
                    User_Roleid: user.User_Roleid,
                    UserName: user.UserName,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };

                return res.status(200).send(response);
            }).catch(err => {
                winston.error('error: ' + err);
                var response = CF.getStandardResponse(500, "Something went wrong");
                return res.status(500).send(response);
            });
        } else {
            var response = CF.getStandardResponse(401, "Invalid request");
            return res.status(401).send(response);
        }
    });
});

router.post('/set-idle', async function (req, res) {
    const { userId, isIdle } = req.body;

    if (!userId || typeof isIdle === 'undefined') {
        return res.status(400).send({
            response_code: 400,
            response_message: "Missing userId or isIdle"
        });
    }

    try {
        const user = await LoginDetails.findOne({ where: { User_ID: userId } });

        if (!user) {
            return res.status(404).send({
                response_code: 404,
                response_message: "User not found"
            });
        }

        await LoginDetails.update(
            { isIdle: isIdle },
            { where: { User_ID: userId } }
        );

        return res.status(200).send({
            response_code: 200,
            response_message: `User marked as ${isIdle ? 'idle' : 'active'}`
        });

    } catch (error) {
        console.error("Error updating idle status:", error);
        return res.status(500).send({
            response_code: 500,
            response_message: "Internal server error"
        });
    }
});



module.exports = router;