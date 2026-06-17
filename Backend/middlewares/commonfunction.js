const db = require('../config/dbconnection');
const Customer = db.customer;
express = require('express');
var path = require("path");

module.exports = {
    getStandardResponse,
    sendemail,
    forgortopt,getCurrentSQLDateTime,
    Organisation,
    Client
};

function forgortopt(name, otp) {
    var templates = "<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <title>Password Reset</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; } .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 10px 0; } .header img { width: 100px; } .content { padding: 20px; text-align: center; } .content h1 { color: #333333; } .content p { color: #666666; } .otp { display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 24px; font-weight: bold; color: #ffffff; background-color: #007BFF; border-radius: 5px; } .footer { text-align: center; padding: 10px 0; color: #999999; font-size: 12px; } </style> </head> <body> <div class='container'> <div class='header'> " +
        "</div> <div class='content'> <h1>Password Reset Request</h1> <p>Hello," + name + "</p> <p>We received a request to reset your password. Use the OTP below to reset your password. This OTP is valid for 10 minutes.</p> <div class='otp'>" + otp + "</div> <p>If you did not request a password reset, please ignore this email.</p> </div> <div class='footer'> &copy; All rights reserved by Infologia Technologies Pvt Ltd </div> </div> </body> </html>"
    return templates;
}
function Client(name) {
    const htmlTemplate = `
  <!doctype html>
  <html>
  <body style="font-family:Arial,Helvetica,sans-serif;background:#f7f7f7;padding:20px;">
    <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="text-align:center;">Welcome to Infologia Technologies</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your login account has been successfully created on <strong>Infologia Technologies</strong>.</p>
      <p>If you received this email, please go to the “Forgot Password” page and change your password before logging in.</p>
      <p style="text-align:center;margin:25px 0;">
        <a href="https://demo.infologia.in/#/ForgotPassword" 
           style="background:#1d72b8;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;font-weight:600;">
           Change Password
        </a>
      </p>
      <p>If you didn’t request this account, please ignore this email or contact support.</p>
      <p>For any help, email us at <a href="mailto:contact@infologia.in">info@infologia.in</a>.</p>
      <p style="font-size:12px;color:#777;text-align:center;border-top:1px solid #eee;padding-top:10px;">
        © ${new Date().getFullYear()} Infologia Technologies. All rights reserved.
      </p>
    </div>
  </body>
  </html>
  `;
    return htmlTemplate;
}
function Organisation(name) {
    const htmlTemplate = `
  <!doctype html>
  <html>
  <body style="font-family:Arial,Helvetica,sans-serif;background:#f7f7f7;padding:20px;">
    <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
      <h2 style="text-align:center;">Welcome to Infologia</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your login account has been successfully created on <strong>Infologia</strong>.</p>
      <p>Your account has been created successfully. To secure your access, please click the button below to set up your password.</p>
      <p style="text-align:center;margin:25px 0;">
        <a href="https://demo.skybtrans.com/#/ForgotPassword" 
           style="background:#1d72b8;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;font-weight:600;">
           Set Your Password
        </a>
      </p>
      <p>If you didn’t request this account, please ignore this email or contact support.</p>
      <p>For any help, email us at <a href="mailto:contact@infologia.in">info@infologia.in</a>.</p>
      <p style="font-size:12px;color:#777;text-align:center;border-top:1px solid #eee;padding-top:10px;">
        © ${new Date().getFullYear()} Infologia. All rights reserved.
      </p>
    </div>
  </body>
  </html>
  `;
    return htmlTemplate;
}
function getStandardResponse(status, message, data) {
    return {
        response_code: status,
        response_message: message,
        data: data
    }
}
hbs = require('nodemailer-express-handlebars'),
    email = process.env.MAILER_EMAIL_ID || 'testinginfologia@gmail.com',
    pass = process.env.MAILER_PASSWORD || 'Welcome@12345',
    nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: email,
        pass: pass
    }
});

const handlebarsOptions = {
    viewEngine: {
        extName: '.html',
        partialsDir: './public/template/',
        layoutsDir: './public/template/',
        defaultLayout: '',
    },
    viewPath: './public/template/',
    extName: '.html',
};
smtpTransport.use('compile', hbs(handlebarsOptions));

function sendemail(data) {
    smtpTransport.sendMail(data);
    return 1;
};
function getCurrentSQLDateTime() {
  const now = new Date();
  const pad = (n, len = 2) => n.toString().padStart(len, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const milliseconds = pad(now.getMilliseconds(), 3);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}