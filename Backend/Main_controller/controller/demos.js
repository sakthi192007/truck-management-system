
const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const sellerInvoice = db.sellerInvoices;
const selleritems = db.sellerInvoicesItems;
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const pdf = require("pdf-creator-node");


const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const { storage } = require('../../middlewares/storage');
const { Console, log } = require("console");
const { console } = require("inspector");
var upload = multer({ storage: storage }).single('file');



router.post('/demos', async function (req, res, next) {

    try {
    
        htmlpage = './view/sellerInvoice.html';
        
        const html = fs.readFileSync(path.join(__dirname, htmlpage), 'utf-8');
        const filename = 'SKYB_' + Date.now() + '.pdf';
        const outputDir = path.join(__dirname, '../../public/invoice/TaxInvoice/');

        let qrCodeData = `${process.env.IPURL}TaxInvoice/${filename}`;
      
     
        const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);


        const obj = {
          
            qrCodeBase: qrCodeBase64,
           
        };

        var options = {
            format: 'A4',
            orientation: 'portrait',
            border: '4mm',
            header: {
                height: '150mm',
                contents: `
                <span><img src="https://i.ibb.co/N377CQs/download.png" style="height:80pt; width: 180pt;" /></span>
                <div class="from-address" style="margin-left:400pt;margin-top:-80pt;">
                    <span style="font-size: 10pt; font-weight: bold;">SKYB TRANS PRIVATE LIMITED</span><br>
                    <span style="font-size: 10pt;">
                        No.19A,BHARATHIAR STREET,<br>
                        MEENAMBAKKAM,CHENNAI,<br>
                        IN.PIN – 600027.<br>
                        Ph No: +91 9840928505,<br>
                        E-mail: info@skybtrans.com<br>
                        GST: 33ABNCS2626M1ZZ<br>
                    </span>
                </div>
                <p style="color:#232879;font-size:18pt;margin-top:-90pt; margin-left:240pt;">
                    <span>CREDIT NOTE</span>
                </p>
                <div class="to-address" style="margin-left:10pt;">
                    <strong>Recipient:</strong><br>
                   TVS SCS Global Freight Solutions Limited <br>
                   2nd and 3rd Floor,Old No 10 New No 19, Blue Haven, Harrington Road CHENNAI TAMILNADU-600031 <br>
                    Ph No: 9841410382<br>
                    E-mail: vinoth.d@tvsscs.com<br>
                    GST: 33AACCT7471P1ZS
                </div>
                <img class="qrcode" src="${qrCodeBase64}" alt="QR Code" />
                <table class="weight">
                    <tbody>
                        <tr><td>Cargo Weight:</td><td>13000 kG</td></tr>
                        <tr><td>Empty Container Pickup:</td><td>2024-11-21</td></tr>
                        <tr><td>Stuffing Location :</td><td>TVS HOSUR FACTORY 2W-SPARES</td></tr>
                        <tr><td>Shipper :</td><td>TVS CO</td></tr>
                        <tr><td>Port Of Loading :</td><td>Kattupalli Port</td></tr>
                    </tbody>
                </table>
                <table class="invoices">
                    <tbody>
                        <tr><td>Invoice:</td><td>MAASKYB24120066</td></tr>
                        <tr><td>Invoice Issue Date:</td><td>2024-12-24</td></tr>
                        <tr><td>Due Date:</td><td></td></tr>
                        <tr><td>Booking No:</td><td>EXPSKYB0024</td></tr>
                        <tr><td>No of Containers:</td><td>1 * 40 HC,</td></tr>
                        <tr><td>CN for Invoice No:</td><td>MAASKYB24110034</td></tr>
                    </tbody>
                </table>
        `},
            footer: {
                height: '20mm',
                contents: {
                    first: '<span style="margin-left: 15pt;">E/OE</span>',
                    2: '<span style="margin-left: 15pt;">E/OE</span>',
                    default: '<span style="margin-left: 15pt;">E/OE</span>',
                    last: '<span style="margin-left: 15pt;">E/OE</span>'
                }
            }
        };
        const document = {
            html: html,
            path: outputDir + filename,
            data: {
                products: obj
            },
            type: ""
        };
        pdf.create(document,options).then(result => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                filename,
            });
        }).catch(error => {
            res.status(500).send({
                response_code: "500",
                response_message: "Something went to wrong",
                error
            });
        });

} catch (error) {
    console.error('Error during PDF generation:', error);
    next(error);
}

});


module.exports = router;