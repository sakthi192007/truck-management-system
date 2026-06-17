
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
require('dotenv').config();

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


router.post('/pdfdownload/list', verifytoken, async function (req, res, next) {
    const jsondata = req.body;

    console.log(jsondata);
    try {
        for (var i = 0; i < jsondata.length; i++) {

            const newCompany = await selleritems.create({
                I_id: jsondata[i].invoiceID,
                Amount: jsondata[i].Amount,
                SGST: jsondata[i].sgst,
                ContainerNo: jsondata[i].containerno,
                ContainerType: jsondata[i].container,
                ChargeCode: jsondata[i].chargedes,
                CGST: jsondata[i].cgst,
                IGST: jsondata[i].igst,
                HSNCode: jsondata[i].hsncode,
                Description: jsondata[i].description,
                Igstper: jsondata[i].igstper,
                Gstper: jsondata[i].sgstper,
                Vehicleno: jsondata[i].Vehicleno,
                 Currency: jsondata[i].curre
            });
        }
        const response = CF.getStandardResponse(201, "Invoice created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postInvoice: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.post('/pdfdownload/insert/:id', verifytoken, async function (req, res, next) {

    let id = req.params.id;
    const jsondata = req.body;

    console.log(jsondata)
    let statusdata = ""
    try {
        if (id != 0) {

            statusdata = 1;
        } else {
            statusdata = 0;
        }
        const InvoiceNumber = await generateInvoiceNumber();



        const newCompany = await sellerInvoice.create({
            Department: jsondata.department,
            CompanyName: jsondata.companyId,
            BookingNo: jsondata.BookingNumber,
            InvoiceDate: jsondata.invoice_date,
            InvoiceDueDate: jsondata.dueinvoicedate,
            InvoiceReference: jsondata.invoice_ref,
            InvoiceNumber: InvoiceNumber,
            SubTotal: jsondata.btmtotal,
            GSTAmount: jsondata.btmgst,
            CGSTAmount: jsondata.btmcgst,
            IGSTAmount: jsondata.btmigst,
            GrandTotal: jsondata.grandtotal,
            Advpayment:jsondata.advpymt,
            Balancedue:jsondata.balancedue,
            Status: statusdata,
             CreatedBy: jsondata.CreatedBy,
                

        });
        const response = CF.getStandardResponse(201, "Invoice created successfully", { id: newCompany.I_id, invoiceno: newCompany.InvoiceNumber });
        res.status(201).send(response);

    } catch (err) {
        winston.error('postInvoice: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }

});
router.get('/pdfdownload/:InvoiceNumber', async function (req, res, next) {
    try {
        const InvoiceNumber = req.params.InvoiceNumber;
        console.log(InvoiceNumber)

        db.sequelize.query(
            "select  invoicepdf from Invoices where InvoiceNumber='" + InvoiceNumber + "'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
            .then((data) => {
                res.status(200).send({
                    response_code: "200",
                    response_message: "success.",
                    data,
                });
                winston.info("Download Invoice");
            })
            .catch(error => {
                console.error("Error fetching Download Invoice:", error);
                res.status(500).send({
                    response_code: "500",
                    response_message: "Internal Server Error"
                });
            });
    } catch (error) {
        console.error('Error during PDF generation:', error);
        next(error);
    }
});
router.post('/sendemail', async function (req, res, next) {

    try {
        const jsondata = req.body;
        const invoicedata = jsondata.formvalues;
        const itemsdata = jsondata.itemsdata;
        const InvoiceNumber = jsondata.InvoiceNumber;
        const Detailsdata = await getdatas(invoicedata.BookingNumber, invoicedata.department, invoicedata.companyId);
        const addform = Detailsdata.addform;
        const inforadd = Detailsdata.inforadd;
        const EmailId = addform[0].Email;
        var Currencyvalue = "";
        if (itemsdata[0].curre == 'USD') {
            Currencyvalue = 'USD'
        } else {
            Currencyvalue = 'INR'
        }

        let wordsamount = numberToWords(invoicedata.balancedue).toUpperCase();;
        const dateObj = new Date(invoicedata.invoice_date);
        const dateObj1 = new Date(invoicedata.dueinvoicedate);

        const day1 = dateObj.getDate().toString().padStart(2, '0');
        const month1 = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year1 = dateObj.getFullYear();

        const day2 = dateObj1.getDate().toString().padStart(2, '0');
        const month2 = (dateObj1.getMonth() + 1).toString().padStart(2, '0');
        const year2 = dateObj1.getFullYear();

 let invoices_data = `${day1}/${month1}/${year1}`;
 let dueinvoice_date = `${day2}/${month2}/${year2}`;

        let htmlpage = '';

        let array = itemsdata.map((i, index) => ({
            Numbers: index + 1,
            curre: i.curre !== '0' ? i.curre : 'INR',
            Description: i.description,
            ContainerType: i.container,
            containerno: i.containerno,
            hsncode: i.hsncode,
            Vehicleno: i.Vehicleno,
            sgstper: invoicedata.gsttype === "0" ? i.sgstper : null,
            igstper: invoicedata.gsttype !== "0" ? i.igstper : null,
            Amount: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.Amount),
            SGST: invoicedata.gsttype === "0" ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.sgst) : null,
            CGST: invoicedata.gsttype === "0" ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.cgst) : null,
            IGST: invoicedata.gsttype !== "0" ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.igst) : null

        }));
      
        function chunkArray(arr, size) {
            let result = [];
            for (let i = 0; i < arr.length; i += size) {
                result.push(arr.slice(i, i + size));
            }
            return result;
        }
        const productChunks = chunkArray(array, 7); 


        let arrayadd = inforadd.map(i => ({
            numberoftype: i.numberoftype,
            numbercontainer: i.numberoftype + ' * ' + i.generalType + ' ',
        }));
       let valuesdata = invoicedata.department == "1" ? "CNTR Plcmnt Dt" : "Full CNTR PU";
        let Stuffing = invoicedata.department == "1" ? "Stf. Location " : "De-Stf. Location";
        let valuespoint = invoicedata.gsttype === "0" ? 40 : 60;
        let Shipper = invoicedata.department == "1" ? "Shipper  " : "Consignee ";
        let Loading = invoicedata.department == "1" ? "POL " : "POD ";
        htmlpage = invoicedata.gsttype === "0" ? './view/TaxSgstCgst.html' : './view/TaxIgst.html';

        const html = fs.readFileSync(path.join(__dirname, htmlpage), 'utf-8');
        const filename = 'SKYB_' + Date.now() + '.pdf';
        const outputDir = path.join(__dirname, '../../public/invoice/TaxInvoice/');

        let qrCodeData = `${process.env.IPURL}TaxInvoice/${filename}`;

        const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);

       
        const updatedinvoice = await sellerInvoice.update({
            invoicepdf: filename,
             Status:1
        }, {
            where: { InvoiceNumber: InvoiceNumber }
        });


const imagePath = path.resolve("public/clientdetails", invoicedata.Image);
const imgBase64 = getBase64Image(imagePath);

        let grandtotal = parseFloat(invoicedata.grandtotal).toFixed(2);
        const obj = {
            prodlist: array,
            productChunks: productChunks,
            addlist: arrayadd,
            pickeup: valuesdata,
            CompanyName: addform[0].CompanyName,
            address: addform[0].address,
            PhoneNumber: addform[0].PhoneNumber,
            Email: addform[0].Email,
            gst_number: addform[0].gst_number,
            Stuffing_Location: addform[0].Stuffing_Location,
            shipper: addform[0].shipper,
            CargoWeight: addform[0].CargoWeight,
            btmtotal: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(invoicedata.btmtotal).toFixed(2)),
            btmigst: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.btmigst),
            btmgst: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.btmgst),
            btmcgst: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.btmcgst),
            advpymt: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.advpymt),
            grandtotal: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(grandtotal),
            balancedue: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.balancedue),
            BookingNumber: invoicedata.BookingNumber,
            invoice_date: invoicedata.invoice_date,
            DueDate: invoicedata.dueinvoicedate,
            invoice_ref: invoicedata.invoice_ref,
            gsttype: invoicedata.gsttype,
            wordsamount: wordsamount,
            qrCodeBase: qrCodeBase64,
            qrCode_Bases:imgBase64,
            Currencyvalue: Currencyvalue
        };

        var options = {
            format: 'A4',
            orientation: 'portrait',
            border: '4mm',
            header: {
                height: '40mm',
                contents: `
       <div style="position: relative; width: 100%; height: 120px;">
  <!-- Left: Logo -->
  <img src="${imgBase64}" 
       style="position: absolute; left: 0; top: 0; height: 90pt; width: 160pt;"/>

  <!-- TAX INVOICE text -->
  <p style="position: absolute; left: 250pt; top: 20pt; font-size: 22pt; color: #232879; margin: 0;">
    TAX INVOICE
  </p>
  <img src="${qrCodeBase64}" 
       style="position: absolute; right: 0; top: 0; width: 100px; height: 100px;" 
       alt="QR Code"/>
</div>
<div class="from-address" style="margin-left:350pt; margin-top:5pt; line-height: 1.2;">
    <span style="font-size: 11pt; font-weight: bold;">${invoicedata.CompanyName}</span><br>
     <span style="font-size: 11pt; font-weight: bold;"> ${invoicedata.UserName}</span><br>
    <span style="font-size: 11pt;">
         ${invoicedata.Address},<br>
      ${invoicedata.City},<br>
        IN.PIN – ${invoicedata.PostalCode}.<br>
        Ph No: +91–${invoicedata.PhoneNumber},<br>
        E-mail: ${invoicedata.Email}<br>
        GST: ${invoicedata.GSTNo}<br>
    </span>
</div>
<div class="to-address" style="margin-left:10pt; margin-top:5pt;">
    <strong>Recipient:</strong><br>
    ${addform[0].CompanyName}<br>
    ${addform[0].address}<br>
    Ph No: ${addform[0].PhoneNumber}<br>
    E-mail: ${addform[0].Email}<br>
    GST: ${addform[0].gst_number}
</div>

                
              <table class="table-style weight-table" style="margin-left:10pt;margin-top:${valuespoint};">
    <tr>
        <td>Cargo Weight</td>
        <td class="colon">:</td>
        <td class="value">${addform[0].CargoWeight} kg</td>
    </tr>
    <tr>
        <td>${valuesdata}</td>
        <td class="colon">:</td>
        <td class="value">${addform[0].containerdate}</td>
    </tr>
    <tr>
        <td>${Stuffing}</td>
        <td class="colon">:</td>
        <td class="value break-text">${addform[0].Stuffing_Location}</td>
    </tr>
    <tr>
        <td>${Shipper}</td>
        <td class="colon">:</td>
        <td class="value break-text">${addform[0].shipper}</td>
    </tr>
    <tr>
        <td>${Loading}</td>
        <td class="colon">:</td>
        <td class="value">${addform[0].locationName}</td>
    </tr>
</table>

<table class="table-style invoice-table">
    <tr>
        <td>Invoice</td>
        <td class="colon">:</td>
        <td class="value">${InvoiceNumber}</td>
    </tr>
    <tr>
        <td>Invoice Issue Date</td>
        <td class="colon">:</td>
        <td class="value">${invoices_data}</td>
    </tr>
    <tr>
        <td>Due Date</td>
        <td class="colon">:</td>
        <td class="value">${dueinvoice_date}</td>
    </tr>
    <tr>
        <td>Booking No</td>
        <td class="colon">:</td>
        <td class="value">${invoicedata.BookingNumber}</td>
    </tr>
    <tr>
        <td>No of Containers</td>
        <td class="colon">:</td>
        <td class="value">${arrayadd.map(item => item.numbercontainer).join(", ")}</td>
    </tr>
    <tr>
        <td>Booking Ref</td>
        <td class="colon">:</td>
        <td class="value">${invoicedata.invoice_ref}</td>
    </tr>
</table>

        `},
            footer: {
                height: '20mm',
                contents: {
                    first: '<div style="margin-left: 15pt; font-size:13px;">E/OE</div><div style="text-align: center; font-size:12px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>',
                    2: '<div style="margin-left: 15pt; font-size:13px;">E/OE</div><div style="text-align: center; font-size:12px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>',
                    default: '<div style="margin-left: 15pt; font-size:13px;">E/OE</div><div style="text-align: center; font-size:12px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>',
                    last: '<div style="margin-left: 15pt; font-size:13px;">E/OE</div><div style="text-align: center; font-size:12px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>'
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
        pdf.create(document, options).then(result => {

            var transporter = nodemailer.createTransport({
                host: 'smtp.hostinger.com',
                port: 587,
                auth: {
                    user: "contact@infologia.in",
                    pass: "Welcome@123"
                }
            });

            var mailOptions = {
                from: "contact@infologia.in",
                 to: "info@infologia.in",
            //   cc: "shankar@skybtrans.com,manimaranilt@gmail.com",
                subject: 'Invoice PDF',
                text: 'Please find attached the invoice PDF.',
                attachments: [
                    {
                        filename: filename,
                        path: outputDir + filename
                    }
                ]
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).send({ message: "Failed to send email", error: error.message });
                } else {


                }
            });
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

function getBase64Image(imgPath) {
  try {
    const image = fs.readFileSync(path.resolve(imgPath));
    const base64 = Buffer.from(image).toString('base64');
    const ext = path.extname(imgPath).substring(1);
    return `data:image/${ext};base64,${base64}`;
  } catch (error) {
    console.error('Image conversion error:', error);
    return '';
  }
}

router.post('/pdfinvoicedownload/', async function (req, res, next) {
    try {
        const jsondata = req.body;
        const { formvalues: invoicedata, itemsdata } = jsondata;

        const Detailsdata = await getdatas(invoicedata.BookingNumber, invoicedata.department, invoicedata.companyId);
        const { addform, inforadd } = Detailsdata;

        let Currencyvalue = itemsdata[0].curre === 'USD' ? 'USD' : 'INR';
        let wordsamount = numberToWords(invoicedata.balancedue).toUpperCase();

      const dateObj = new Date(invoicedata.invoice_date);
        const dateObj1 = new Date(invoicedata.dueinvoicedate);


        let array = itemsdata.map((i, index) => ({
            Numbers: index + 1,
            curre: i.curre !== '0' ? i.curre : 'INR',
            Description: i.description,
            ContainerType: i.container,
            containerno: i.containerno,
            Vehicleno: i.Vehicleno,
            hsncode: i.hsncode,
            sgstper: invoicedata.gsttype === "0" ? i.sgstper : null,
            igstper: invoicedata.gsttype !== "0" ? i.igstper : null,
            Amount: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.Amount),
            SGST: invoicedata.gsttype === "0" ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.sgst) : null,
            CGST: invoicedata.gsttype === "0" ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.cgst) : null,
            IGST: invoicedata.gsttype !== "0" ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.igst) : null
        }));

        // 🔹 Chunk function
        function chunkArray(arr, size) {
            let result = [];
            for (let i = 0; i < arr.length; i += size) {
                result.push(arr.slice(i, i + size));
            }
            return result;
        }
        const productChunks = chunkArray(array, 7);  // split rows into 10 each

        let arrayadd = inforadd.map(i => ({
            numberoftype: i.numberoftype,
            numbercontainer: `${i.numberoftype} * ${i.generalType}`
        }));

        let valuesdata = invoicedata.department == "1" ? "CNTR Plcmnt Dt" : "Full CNTR PU";
        let Stuffing = invoicedata.department == "1" ? "Stf. Location " : "De-Stf. Location";
        let valuespoint = invoicedata.gsttype === "0" ? 10 : 60;
        let Shipper = invoicedata.department == "1" ? "Shipper  " : "Consignee ";
        let Loading = invoicedata.department == "1" ? "POL " : "POD ";

        let htmlpage = invoicedata.gsttype === "0" ? './view/demo.html' : './view/demoigst.html';
        const html = fs.readFileSync(path.join(__dirname, htmlpage), 'utf-8');
        const filename = `SKYB_${Date.now()}.pdf`;
        const outputDir = path.join(__dirname, '../../public/invoice/');

        let qrCodeData = `${process.env.IPURL}invoice/${filename}`;
        const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);

        let grandtotal = parseFloat(invoicedata.grandtotal).toFixed(2);



const imagePath = path.resolve("public/clientdetails", invoicedata.Image);
const imgBase64 = getBase64Image(imagePath);
        // 🔹 Data object
        const obj = {
            prodlist: array,
            productChunks: productChunks,   
            addlist: arrayadd,
            pickeup: valuesdata,
            CompanyName: addform[0].CompanyName,
            address: addform[0].address,
            PhoneNumber: addform[0].PhoneNumber,
            Email: addform[0].Email,
            gst_number: addform[0].gst_number,
            Stuffing_Location: addform[0].Stuffing_Location,
            shipper: addform[0].shipper,
            CargoWeight: addform[0].CargoWeight,
            btmtotal: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(invoicedata.btmtotal)),
            btmigst: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(invoicedata.btmigst)),
            btmgst: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(invoicedata.btmgst)),
            btmcgst: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(invoicedata.btmcgst)),
            advpymt: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(invoicedata.advpymt)),
            grandtotal: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(grandtotal)),
            balancedue: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.balancedue),
            qrCodeBase: imgBase64,
            BookingNumber: invoicedata.BookingNumber,
            invoice_date: invoicedata.invoice_date,
            DueDate: invoicedata.dueinvoicedate,
            invoice_ref: invoicedata.invoice_ref,
            gsttype: invoicedata.gsttype,
            wordsamount: wordsamount,
            Currencyvalue: Currencyvalue
        };


     

        var options = {
            format: 'A4',
            orientation: 'portrait',
            border: '4mm',
            header: {
                height: '40mm',
                contents: `
                <span><img src="${imgBase64}" style="height:90pt; width: 160pt;" /></span>
                <div class="from-address" style="margin-left:350pt;margin-top:-30pt;">
                    <span style="font-size: 11pt; font-weight: bold;"> ${invoicedata.CompanyName}</span><br>
                     <span style="font-size: 11pt; font-weight: bold;"> ${invoicedata.UserName}</span><br>
                    <span style="font-size: 11pt;">
                        ${invoicedata.Address},<br>
                        ${invoicedata.City},<br>
                        IN.PIN  ${invoicedata.PostalCode},<br>
                        Ph No: +91– ${invoicedata.PhoneNumber},<br>
                        E-mail: ${invoicedata.Email}<br>
                        GST: ${invoicedata.GSTNo}<br>
                    </span>
                </div>
                <p style="color:#232879;font-size:22pt;margin-top:-100pt; margin-left:220pt;">
                    <span>Proforma Invoice</span>
                </p>
                <div class="to-address" style="margin-left:10pt;margin-top:10pt;">
                    <strong>Recipient:</strong><br>
                    ${addform[0].CompanyName}<br>
                    ${addform[0].address}<br>
                    Ph No: ${addform[0].PhoneNumber}<br>
                    E-mail: ${addform[0].Email}<br>
                    GST: ${addform[0].gst_number}
                </div>
                 
                
    <table class="table-style weight-table" style="margin-left:10pt;margin-top:${valuespoint};">
        <tr>
            <td>Cargo Weight</td>
            <td class="colon">:</td>
            <td class="value">${addform[0].CargoWeight} kg</td>
        </tr>
        <tr>
            <td>${valuesdata}</td>
            <td class="colon">:</td>
            <td class="value">${addform[0].containerdate}</td>
        </tr>
        <tr>
            <td>${Stuffing}</td>
            <td class="colon">:</td>
            <td class="value break-text">${addform[0].Stuffing_Location}</td>
        </tr>
        <tr>
            <td>${Shipper}</td>
            <td class="colon">:</td>
            <td class="value">${addform[0].shipper}</td>
        </tr>
        <tr>
            <td>${Loading}</td>
            <td class="colon">:</td>
            <td class="value">${addform[0].locationName}</td>
        </tr>
    </table>
     <table class="table-style invoice-table" style="margin-top:${valuespoint};">
        <tr>    
        
            <td>Invoice Issue Date</td>
            <td class="colon">:</td>
            <td class="value">${invoicedata.invoice_date}</td>
        </tr>
        <tr>
            <td>Due Date</td>
            <td class="colon">:</td>
            <td class="value">${invoicedata.dueinvoicedate}</td>
        </tr>
        <tr>
            <td>Booking No</td>
            <td class="colon">:</td>
            <td class="value">${invoicedata.BookingNumber}</td>
        </tr>
        <tr>
            <td>No of Containers</td>
            <td class="colon">:</td>
            <td class="value">${arrayadd.map(item => item.numbercontainer).join(", ")}</td>
        </tr>
        <tr>
            <td>Booking Ref</td>
            <td class="colon">:</td>
            <td class="value">${invoicedata.invoice_ref}</td>
        </tr>
    </table>

        `},
   
            footer: {
                height: '20mm',
                contents: {
                    first: '<div style="margin-left: 15pt; font-size:13px;">E/OE</div><div style="text-align: center; font-size:12px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>',
                    2: '<div style="margin-left: 15pt; font-size:13px;">E/OE</div><div style="text-align: center; font-size:12px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>',
                    default: '<div style="margin-left: 15pt; font-size:13px;">E/OE</div><div style="text-align: center; font-size:12px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>',
                    last: '<div style="margin-left: 15pt; font-size:13px;">E/OE</div><div style="text-align: center; font-size:12px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>'
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

        pdf.create(document, options).then(result => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                filename,
            });
        }).catch(error => {
            res.status(500).send({
                response_code: "500",
                response_message: "Something went wrong",
                error
            });
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        next(error);
    }
});
//credit
router.post('/creditinvoicedownload/', async function (req, res, next) {
    try {
        const jsondata = req.body;
        const invoicedata = jsondata.formvalues;
        const itemsdata = jsondata.itemsdata;
        const InvoiceNumber = jsondata.invNo;
        const Detailsdata = await getdatas(invoicedata.BookingNumber, invoicedata.department, invoicedata.companyId);
        const addform = Detailsdata.addform;
        const inforadd = Detailsdata.inforadd;
        const EmailId = addform[0].Email;
        var Currencyvalue = "";
        if (itemsdata[0].curre == 'USD') {
            Currencyvalue = 'USD'
        } else {
            Currencyvalue = 'INR'
        }

        let wordsamount = numberToWords(invoicedata.balancedue).toUpperCase();;
        const dateObj = new Date(invoicedata.invoice_date);
        const dateObj1 = new Date(invoicedata.dueinvoicedate);

        const day1 = dateObj.getDate().toString().padStart(2, '0');
        const month1 = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year1 = dateObj.getFullYear();

        const day2 = dateObj1.getDate().toString().padStart(2, '0');
        const month2 = (dateObj1.getMonth() + 1).toString().padStart(2, '0');
        const year2 = dateObj1.getFullYear();

 let invoices_data = `${day1}/${month1}/${year1}`;
 let dueinvoice_date = `${day2}/${month2}/${year2}`;




        let htmlpage = '';
        let array = itemsdata.map((i, index) => ({
            Numbers: index + 1,
            curre: i.curre !== '0' ? i.curre : 'INR',
            Description: i.description,
            ContainerType: i.container,
            containerno: i.containerno,
            hsncode: i.hsncode,
            Vehicleno: i.Vehicleno,
            sgstper: invoicedata.gsttype === "0" ? i.sgstper : null,
            igstper: invoicedata.gsttype !== "0" ? i.igstper : null,
            Amount: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.Amount),
            SGST: invoicedata.gsttype === "0" ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.sgst) : null,
            CGST: invoicedata.gsttype === "0" ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.cgst) : null,
            IGST: invoicedata.gsttype !== "0" ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(i.igst) : null

        }));
 function chunkArray(arr, size) {
            let result = [];
            for (let i = 0; i < arr.length; i += size) {
                result.push(arr.slice(i, i + size));
            }
            return result;
        }
        const productChunks = chunkArray(array, 7); 

        let arrayadd = inforadd.map(i => ({
            numberoftype: i.numberoftype,
            numbercontainer: i.numberoftype + ' * ' + i.generalType + ' ',
        }));
         let valuesdata = invoicedata.department == "1" ? "CNTR Plcmnt Dt" : "Full CNTR PU";
        let Stuffing = invoicedata.department == "1" ? "Stf. Location " : "De-Stf. Location";
        let valuespoint = invoicedata.gsttype === "0" ? 50 : 60;
        let Shipper = invoicedata.department == "1" ? "Shipper  " : "Consignee ";
        let Loading = invoicedata.department == "1" ? "POL " : "POD ";

        htmlpage = invoicedata.gsttype === "0" ? './view/sellerInvoice.html' : './view/sellerigst.html';


        const html = fs.readFileSync(path.join(__dirname, htmlpage), 'utf-8');
        const filename = 'SKYB_' + Date.now() + '.pdf';
        const outputDir = path.join(__dirname, '../../public/invoice/TaxInvoice/');

        let qrCodeData = `${process.env.IPURL}TaxInvoice/${filename}`;

        const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);


        const updatedinvoice = await sellerInvoice.update({
            invoicepdf: filename,
             Status:1
        }, {
            where: { InvoiceNumber: InvoiceNumber }
        });

        let grandtotal = parseFloat(invoicedata.grandtotal).toFixed(2);
        let balancedues = parseFloat(invoicedata.balancedue).toFixed(2);

        const imagePath = path.resolve("public/clientdetails", invoicedata.Image);
const imgBase64 = getBase64Image(imagePath);

        const obj = {
            prodlist: array,
             productChunks: productChunks,
            addlist: arrayadd,
            pickeup: valuesdata,
            CompanyName: addform[0].CompanyName,
            address: addform[0].address,
            PhoneNumber: addform[0].PhoneNumber,
            Email: addform[0].Email,
            gst_number: addform[0].gst_number,
            Stuffing_Location: addform[0].Stuffing_Location,
            shipper: addform[0].shipper,
            CargoWeight: addform[0].CargoWeight,
            btmtotal: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(invoicedata.btmtotal).toFixed(2)),
            btmigst: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.btmigst),
            btmgst: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.btmgst),
            btmcgst: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.btmcgst),
            advpymt: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(invoicedata.advpymt),
            grandtotal: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(grandtotal),
            balancedue: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balancedues),
            BookingNumber: invoicedata.BookingNumber,
            invoice_date: invoicedata.invoice_date,
            DueDate: invoicedata.dueinvoicedate,
            invoice_ref: invoicedata.invoice_ref,
            gsttype: invoicedata.gsttype,
            wordsamount: wordsamount,
            qrCodeBase: qrCodeBase64,
            qrCode_Bases:imgBase64,
            Currencyvalue: Currencyvalue
        };

       var options = {
            format: 'A4',
            orientation: 'portrait',
            border: '4mm',
            header: {
                height: '40mm',
                contents: `
                <div style="position: relative; width: 100%; height: 120px;">
  <!-- Left: Logo -->
  <img src="${imgBase64}" 
       style="position: absolute; left: 0; top: 0; height: 90pt; width: 160pt;"/>

  <!-- TAX INVOICE text -->
  <p style="position: absolute; left: 250pt; top: 20pt; font-size: 22pt; color: #232879; margin: 0;">
    CREDIT NOTE
  </p>
  <img src="${qrCodeBase64}" 
       style="position: absolute; right: 0; top: 0; width: 100px; height: 100px;" 
       alt="QR Code"/>
</div>
<div class="from-address" style="margin-left:350pt; margin-top:5pt; line-height: 1.2;">
    <span style="font-size: 11pt; font-weight: bold;">${invoicedata.CompanyName}</span><br>
     <span style="font-size: 11pt; font-weight: bold;"> ${invoicedata.UserName}</span><br>
    <span style="font-size: 11pt;">
         ${invoicedata.Address},<br>
      ${invoicedata.City},<br>
        IN.PIN – ${invoicedata.PostalCode}.<br>
        Ph No: +91–${invoicedata.PhoneNumber},<br>
        E-mail: ${invoicedata.Email}<br>
        GST: ${invoicedata.GSTNo}<br>
    </span>
</div>
<div class="to-address" style="margin-left:10pt; margin-top:5pt;">
    <strong>Recipient:</strong><br>
    ${addform[0].CompanyName}<br>
    ${addform[0].address}<br>
    Ph No: ${addform[0].PhoneNumber}<br>
    E-mail: ${addform[0].Email}<br>
    GST: ${addform[0].gst_number}
</div>

                
              <table class="table-style weight-table" style="margin-left:10pt;margin-top:${valuespoint};">
    <tr>
        <td>Cargo Weight</td>
        <td class="colon">:</td>
        <td class="value">${addform[0].CargoWeight} kg</td>
    </tr>
    <tr>
        <td>${valuesdata}</td>
        <td class="colon">:</td>
        <td class="value">${addform[0].containerdate}</td>
    </tr>
    <tr>
        <td>${Stuffing}</td>
        <td class="colon">:</td>
        <td class="value break-text">${addform[0].Stuffing_Location}</td>
    </tr>
    <tr>
        <td>${Shipper}</td>
        <td class="colon">:</td>
        <td class="value break-text">${addform[0].shipper}</td>
    </tr>
    <tr>
        <td>${Loading}</td>
        <td class="colon">:</td>
        <td class="value">${addform[0].locationName}</td>
    </tr>
</table>

<table class="table-style invoice-table" style="margin-left:10pt;margin-top:${valuespoint};">
    <tr>
        <td>Credit NoteNo</td>
        <td class="colon">:</td>
        <td class="value">${InvoiceNumber}</td>
    </tr>
    <tr>
        <td>CN Issue Date</td>
        <td class="colon">:</td>
        <td class="value">${invoices_data}</td>
    </tr>
    <tr>
        <td>CN for Inv.No</td>
        <td class="colon">:</td>
        <td class="value">${invoicedata.invoice_ref}</td>
    </tr>
    <tr>
        <td>Booking No</td>
        <td class="colon">:</td>
        <td class="value">${invoicedata.BookingNumber}</td>
    </tr>
    <tr>
        <td>No of Containers</td>
        <td class="colon">:</td>
        <td class="value">${arrayadd.map(item => item.numbercontainer).join(", ")}</td>
    </tr>
   
</table>

        `},
            footer: {
                height: '20mm',
                contents: {
                    first: '<div style="margin-left: 15pt; font-size:11px;">E/OE</div><div style="text-align: center; font-size:11px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>',
                    2: '<div style="margin-left: 15pt; font-size:11px;">E/OE</div><div style="text-align: center; font-size:11px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>',
                    default: '<div style="margin-left: 15pt; font-size:11px;">E/OE</div><div style="text-align: center; font-size:11px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>',
                    last: '<div style="margin-left: 15pt; font-size:11px;">E/OE</div><div style="text-align: center; font-size:11px;">THIS IS COMPUTER GENERATED INVOICE, SIGNATURE IS NOT REQUIRED.</div>'
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
        pdf.create(document, options).then(result => {

            var transporter = nodemailer.createTransport({
                host: 'smtp.hostinger.com',
                port: 587,
                auth: {
                    user: "contact@infologia.in",
                    pass: "Welcome@123"
                }
            });

            var mailOptions = {
                from: "contact@infologia.in",
                to: "info@infologia.in",
              // cc: "manimaranilt@gmail.com,shankar@skybtrans.com",
                subject: 'Invoice PDF',
                text: 'Please find attached the invoice PDF.',
                attachments: [
                    {
                        filename: filename,
                        path: outputDir + filename
                    }
                ]
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).send({ message: "Failed to send email", error: error.message });
                } else {


                }
            });
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

//update
router.put('/update/:id/:post', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const postdata = req.params.post;
    const jsondata = req.body;

    try {
        let statusdata = ""
        if (postdata == 1) {
            statusdata = 1;
        } else {
            statusdata = 0;
        }

        const [affectedRows, updatedinvoice] = await sellerInvoice.update(
            {
                Department: jsondata.department,
                CompanyName: jsondata.companyId,
                BookingNo: jsondata.BookingNumber,
                InvoiceDate: jsondata.invoice_date,
                InvoiceDueDate: jsondata.dueinvoicedate,
                InvoiceReference: jsondata.invoice_ref,
                SubTotal: jsondata.btmtotal,
                GSTAmount: jsondata.btmgst,
                CGSTAmount: jsondata.btmcgst,
                IGSTAmount: jsondata.btmigst,
                Advpayment: jsondata.advpymt,
                GrandTotal: jsondata.grandtotal,
                Balancedue:jsondata.balancedue,
                Status: statusdata
            },
            {
                where: { I_id: id },
                returning: true,
                plain: true
            }
        );
        if (updatedinvoice.dataValues.InvoiceNumber) {
            console.log(updatedinvoice.dataValues.InvoiceNumber);
        } else {
            console.log("Invoice update failed or no records were updated.");
        }
        const response = CF.getStandardResponse(201, "Invoice Update successfully", { id: updatedinvoice.dataValues.I_id, invoiceno: updatedinvoice.dataValues.InvoiceNumber });
        res.status(201).send(response);

    } catch (err) {
        winston.error('putinvoice: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});


router.put('/listupdate/:id', verifytoken, async function (req, res, next) {
    const id = req.params.id;
    const jsondata = req.body;
    console.log(jsondata);
    try {
        await db.sequelize.query(
            "DELETE FROM InvoiceLine_ItemDetails WHERE I_id = :id",
            {
                replacements: { id: id },
                type: db.Sequelize.QueryTypes.DELETE
            }
        );

        for (let i = 0; i < jsondata.length; i++) {


            const newCompany = await selleritems.create({
                I_id: id,
                Amount: jsondata[i].Amount,
                SGST: jsondata[i].sgst,
                ContainerNo: jsondata[i].containerno,
                ContainerType: jsondata[i].container,
                ChargeCode: jsondata[i].chargedes,
                CGST: jsondata[i].cgst,
                IGST: jsondata[i].igst,
                HSNCode: jsondata[i].hsncode,
                Vehicleno: jsondata[i].Vehicleno,
                Description: jsondata[i].description,
                Igstper: jsondata[i].igstper,
                Gstper: jsondata[i].sgstper,
                  Currency: jsondata[i].curre,
            });
        }

        const response = CF.getStandardResponse(201, "Invoice updated successfully");
        res.status(201).send(response);

        winston.info("Invoice and associated items updated successfully.");
    } catch (err) {
        winston.error('putitems: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});

/// Invoice number

async function generateInvoiceNumber() {
 
    const date = new Date();
   
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const currentYear = date.getFullYear();
const currentMonth = date.getMonth() + 1;
let fyStart, fyEnd;
 
// Determine Financial Year (April - March)
if (currentMonth >= 4) { 
    fyStart = currentYear.toString().slice(-2);
    fyEnd = (currentYear + 1).toString().slice(-2);
} else { 
    fyStart = (currentYear - 1).toString().slice(-2);
    fyEnd = currentYear.toString().slice(-2);
}
 
// Format financial year code
const financialYear = `${fyStart}${fyEnd}`;
const formattedDate = `${financialYear}${month}`;
const textPart = `MAA${formattedDate}`;
 
const data = await db.sequelize.query(
    "SELECT TOP 1 InvoiceNumber FROM Invoices ORDER BY I_id DESC",
    { type: db.Sequelize.QueryTypes.SELECT }
);
 
let latestNumber = 0;
if (data.length > 0 && data[0].InvoiceNumber) {
    const latestInvoiceNumber = data[0].InvoiceNumber.toString();
    const lastPrefix = latestInvoiceNumber.slice(0, -4);
    
    if (lastPrefix === textPart) {
        latestNumber = parseInt(latestInvoiceNumber.slice(-4));
    }
}
 
const newNumber = latestNumber + 1;
const numberPart = newNumber.toString().padStart(4, '0');
const invoiceNumber = `${textPart}${numberPart}`;
 
return invoiceNumber;
}
 
 
 

function numberToWords(num) {
    const a = [
        '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const inWords = (num) => {
        if (num < 20) return a[num];
        if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
        if (num < 1000) return a[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' and ' + inWords(num % 100) : '');
        if (num < 100000) return inWords(Math.floor(num / 1000)) + ' thousand' + (num % 1000 ? ' ' + inWords(num % 1000) : '');
        if (num < 10000000) return inWords(Math.floor(num / 100000)) + ' lakh' + (num % 100000 ? ' ' + inWords(num % 100000) : '');
        return inWords(Math.floor(num / 10000000)) + ' crore' + (num % 10000000 ? ' ' + inWords(num % 10000000) : '');
    };

    if (num === 0) return 'zero';

    let parts = num.toString().split('.');
    let integerPart = parseInt(parts[0], 10);
    let decimalPart = parts[1] ? parseInt(parts[1].padEnd(2, '0').substring(0, 2), 10) : 0; // Convert to 2-digit paise

    let words = inWords(integerPart) + ' rupees';

    if (decimalPart > 0) {
        words += ' and ' + inWords(decimalPart) + ' paise';
    }

    return words;
}
async function getdatas(booking, dep, id) {

    try {
        let queryString = "";
        let queryString2 = "";
        if (dep == "1") {

            queryString = "EXEC GetExportContainerSummary @CustomerName = "+id+", @BookingNumber = '"+booking+"'";
            queryString2 = "EXEC GetExport_Address @CustomerName = "+id+", @BookingNumber = '"+booking+"'";

        } else {
            queryString = "EXEC GetImport_containerDetails @CustomerName = "+id+", @BookingNumber = '"+booking+"'";
            queryString2 = "EXEC GetImport_Address @CustomerName = "+id+", @BookingNumber = '"+booking+"'";

        }
        console.log(queryString);
        const query1 = queryString;
        const query2 = queryString2;


        const inforadd = await db.sequelize.query(query1);
        const addform = await db.sequelize.query(query2);


        return { inforadd: inforadd[0], addform: addform[0] };
    } catch (err) {
        console.error('Error executing queries:', err);
        throw err;
    }

}



module.exports = router;