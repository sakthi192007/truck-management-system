const express = require("express");
const cors = require("cors");
const logger = require("./middlewares/logger");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
var path = require("path");
const app = express();
require("dotenv").config();
const fs = require("fs");
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://demo.skybtrans.com",
      "https://mobileapp.skybtrans.com:4001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-access-token"],
  })
);


app.options("*", cors());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

//map lat and long create
var lacation = require("./Main_controller/controller/MasterLocation");
var campaignmaster = require("./Main_controller/controller/campaignmaster");
var session = require("./Main_controller/controller/idle");
var Companycreation = require("./Main_controller/controller/CompanyCreation")
///
var register = require("./Main_controller/controller/login");
var change = require("./Main_controller/controller/profile");
var client = require("./Main_controller/controller/clientdetails");
var vendor = require("./Main_controller/controller/vendordetails");
var booking = require("./Main_controller/controller/bookingdetails");
var invoice = require("./Main_controller/controller/invoicedetails");
var user = require("./Main_controller/controller/userdetails");
var Importbookings = require("./Main_controller/controller/Importbookings");
var bookingDetails = require("./Main_controller/controller/Exportbooking");
var Vendorprice = require("./Main_controller/controller/Vendorprices");
var Clientprices = require("./Main_controller/controller/Clientprices");
var ExportMilestone = require("./Main_controller/controller/ExportEvents");
var ImportMilestone = require("./Main_controller/controller/ImportEvents");
var pdfinvoice = require("./Main_controller/controller/Pdfdetails");
var VehicleInformation = require("./Main_controller/controller/Vehicleinformation");
//report controller

var Report=require("./Main_controller/controller/Report");

var demopdfdata = require("./Main_controller/controller/demos");
var apinvoices = require("./Main_controller/controller/apinvoices");
var cfsRouter = require("./Main_controller/controller/cfscreation");
var invoicetds = require("./Main_controller/controller/invoicetds");
var apinvoicetds = require("./Main_controller/controller/apinvoicetds");
var allocation = require("./Main_controller/controller/bookingallocation");
const pdfRoutes = require("./Main_controller/controller/pdf");
var PodDocument = require("./Main_controller/controller/pod");
var subadmin = require("./Main_controller/controller/subadmin");
var bkdocexp = require('./Main_controller/controller/bk_docexp');
var bkdocimp = require('./Main_controller/controller/bk_docimp');
var GroupMaster = require("./Main_controller/controller/groupmaster");
var Menudetails = require("./Main_controller/controller/menudetails");
var Branchdetails = require("./Main_controller/controller/Branch");
var AdminDashboard = require("./Main_controller/controller/admindashboard");
var filesdetails = require("./Main_controller/controller/Filesdetails");

//OCR
var OcrDocument = require("./Main_controller/controller/ocrdocument")

app.use('/exports', express.static(path.join(__dirname, 'public/booking/Export')));
app.use('/imports', express.static(path.join(__dirname, 'public/booking/Import')));
app.use("/invoice", express.static(path.join(__dirname, "public/invoice")));
app.use("/TaxInvoice",express.static(path.join(__dirname, "public/invoice/TaxInvoice")));
app.use("/LRCopy",express.static(path.join(__dirname, "public/LRCopy")));

app.use('/bkdocexp',bkdocexp);
app.use('/bkdocimp',bkdocimp);
app.use("/bookingallocation", allocation);
//invoice api
app.use("/Apinvoices", apinvoices);
//client api
app.use("/clientdetails",express.static(path.join(__dirname, "public/clientdetails")));
app.use("/clientprices",express.static(path.join(__dirname, "public/clientprices")));
//vendor api
app.use("/vendorcompany",express.static(path.join(__dirname, "public/vendordetails/company")));
app.use( "/bank",
  express.static(path.join(__dirname, "public/vendordetails/bank"))
);
app.use(
  "/vehicle",
  express.static(path.join(__dirname, "public/vendordetails/vehicle"))
);
app.use(
  "/driver",
  express.static(path.join(__dirname, "public/vendordetails/driver"))
);
app.use(
  "/Vendorprices",
  express.static(
    path.join(__dirname, "public/vendordetails/vendorpricedetails")
  )
);
app.use("/exports", express.static(path.join(__dirname, "public/booking")));
app.use("/qrcodes", express.static(path.join(__dirname, "public/qrcodes")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/pdf", express.static(path.join(__dirname, "public/pdf")));
app.use("/Companycreation", Companycreation)
app.use("/cfscreation", cfsRouter);
app.use("/VehicleInformation", VehicleInformation);
app.use("/register", register);
app.use("/userdetails", user);
app.use("/profile", change);
app.use("/clientdetails", client);
app.use("/vendordetails", vendor);
app.use("/bookingdetails", booking);
app.use("/invoicedetails", invoice);
app.use("/Importbookings", Importbookings);
app.use("/bookingExports", bookingDetails);
app.use("/Vendorpricedetails", Vendorprice);
app.use("/Clientspricedetails", Clientprices);
app.use("/ExportMilestone", ExportMilestone);
app.use("/ImportMilestone", ImportMilestone);
app.use("/pdfdownload", pdfinvoice);

//OCR
app.use("/OcrDocument", OcrDocument);

//report api


  app.use("/Report",Report);

  //files

  app.use('/Exportfile',filesdetails);
  app.use('/Importfile',filesdetails);

  app.use("/demopdfdata", demopdfdata),
  app.use("/lacation", lacation),
  app.use("/invoicetds", invoicetds);

//whatsapp
app.use("/campaignmaster", campaignmaster);
app.use("/apinvoicetds", apinvoicetds);
//documentation Api
app.use("/pod", PodDocument);
app.use("/session", session);
app.use("/pdf", pdfRoutes);
app.use("/subadmin", subadmin);
//menus and groupmaster//
 app.use("/groupmaster", GroupMaster);
  app.use("/menudetails", Menudetails);
  app.use('/Branch',Branchdetails);
 //admindashboard
app.use("/AdminDashboard",AdminDashboard);
//client Image
app.use('/ClientImages', express.static(path.join(__dirname, 'public/clientdetails')));
app.use('/Companylogo', express.static(path.join(__dirname, 'public/clientdetails')));
app.use('/ProfileImages', express.static(path.join(__dirname, 'public/Profile')));
app.get("/", (req, res) => {
  res.send("Welcome to SKY B tool");
});
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
