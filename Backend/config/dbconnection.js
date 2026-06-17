const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "mssql",
     host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      options: {
        encrypt: false,
      },
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//models/tables
db.userdetails = require("../Main_controller/models/usercreation")(
  sequelize,
  Sequelize
);
db.customer = require("../Main_controller/models/Customer")(
  sequelize,
  Sequelize
);
db.clientdetails = require("../Main_controller/models/clientdetails")(
  sequelize,
  Sequelize
);
db.CompanyDetails = require("../Main_controller/models/companys")(
  sequelize,
  Sequelize
);
db.BankDetails = require("../Main_controller/models/BankDetails")(
  sequelize,
  Sequelize
);
db.vehicleDetails = require("../Main_controller/models/vehicleDetails")(
  sequelize,
  Sequelize
);
db.DriverDetails = require("../Main_controller/models/DriverDetails")(
  sequelize,
  Sequelize
);
db.AdditionalvehicleDetails =
  require("../Main_controller/models/AdditionalvehicleDetails")(
    sequelize,
    Sequelize
  );
db.LoginDetails = require("../Main_controller/models/logindetails")(
  sequelize,
  Sequelize
);
db.logdetails = require("../Main_controller/models/logdetails")(
  sequelize,
  Sequelize
);
db.Importbookings = require("../Main_controller/models/BookingImports")(
  sequelize,
  Sequelize
);
db.ExportBookings = require("../Main_controller/models/BookingExport")(
  sequelize,
  Sequelize
);
db.Vendorpricedetails = require("../Main_controller/models/Vendorprice")(
  sequelize,
  Sequelize
);
db.ClientPrices = require("../Main_controller/models/Clientprices")(
  sequelize,
  Sequelize
);
db.ImportClient_selling_price =
  require("../Main_controller/models/clientpricesImport")(sequelize, Sequelize);
db.impvendorprice = require("../Main_controller/models/Impvendorprices")(
  sequelize,
  Sequelize
);
db.sellerInvoices = require("../Main_controller/models/Invoice")(
  sequelize,
  Sequelize
);
db.RolePermissions = require("../Main_controller/models/Rolepermission")(
  sequelize, 
  Sequelize
);
db.sellerInvoicesItems = require("../Main_controller/models/invoiceItems")(
  sequelize,
  Sequelize
);
db.VehicleInformation = require("../Main_controller/models/vehicleinformation")(
  sequelize,
  Sequelize
);
db.TrackDetails = require("../Main_controller/models/TrackDetails")(
  sequelize,
  Sequelize
);
db.Apinvoices = require("../Main_controller/models/Apinvoices")(
  sequelize,
  Sequelize
);
db.Aplineitems = require("../Main_controller/models/Aplineitems")(
  sequelize,
  Sequelize
);
db.cfscreation = require("../Main_controller/models/cfscreation")(
  sequelize,
  Sequelize
);
db.MasterLocation = require("../Main_controller/models/locationroute")(
  sequelize,
  Sequelize
);
db.Campaignmaster = require("../Main_controller/models/campaignmaster")(
  sequelize,
  Sequelize
);
db.Invoicetds = require("../Main_controller/models/invoicetds")(
  sequelize,
  Sequelize
);
db.APInvoicetds = require("../Main_controller/models/apinvoicetds")(
  sequelize,
  Sequelize
);
db.InvoicetdsItems = require("../Main_controller/models/Invoicetdsitems")(
  sequelize,
  Sequelize
);
db.ApinvoicetdsItems = require("../Main_controller/models/Apinvoicetdsitems")(
  sequelize,
  Sequelize
);
db.bookingallocation = require("../Main_controller/models/bookingallocation")(
  sequelize,
  Sequelize
);
db.poddocumentation = require("../Main_controller/models/poddoc")(
  sequelize,
  DataTypes
);

//mobile app

db.Profiledetails = require("../Main_controller/models/profiledetails")(
  sequelize,
  Sequelize
);
db.Milestonedetails =
  require("../Main_controller/models/bookingmilestonedetails")(
    sequelize,
    Sequelize
  );
db.milestoneimport =
  require("../Main_controller/models/bookingmilestonedetailsimport")(
    sequelize,
    Sequelize
  );
db.EBvendor = require("../Main_controller/models/bookingvendordetails")(
  sequelize,
  Sequelize
);
db.EBitems = require("../Main_controller/models/bookingvendoritems")(
  sequelize,
  Sequelize
);
db.IBvendor = require("../Main_controller/models/bookingvendordetailsimport")(
  sequelize,
  Sequelize
);
db.IBitems = require("../Main_controller/models/bookingvendoritemsimport")(
  sequelize,
  Sequelize
);
db.EB_ItemDetails = require("../Main_controller/models/eb_detail")(
  sequelize,
  Sequelize
);
db.IB_ItemDetails = require("../Main_controller/models/ib_details")(
  sequelize,
  Sequelize
);
db.BK_Documentation = require("../Main_controller/models/bk_doc")(
  sequelize,
  Sequelize
);
db.ClientLoginDetails = require("../Main_controller/models/ClientLoginDetails")(
  sequelize,
  Sequelize
);
db.SubAdminLoginDetails = require("../Main_controller/models/SubAdminLoginDetails")(
  sequelize,
  Sequelize
);
db.SubMaster = require("../Main_controller/models/submaster")(
  sequelize,
   Sequelize
  );
db.GroupMaster = require("../Main_controller/models/groupmaster")(
  sequelize, 
  Sequelize
);
db.MenuDetails = require("../Main_controller/models/menu")(
  sequelize,
  Sequelize
  );
db.BranchDetails = require("../Main_controller/models/Branch")(
  sequelize,
  Sequelize
  );
db.vehicleInform = require("../Main_controller/models/vehicleinform")(sequelize, Sequelize);
db.Truckmasterinform=require("../Main_controller/models/Truckmasterinform")(sequelize, Sequelize);


db.EB_ContainerFiles = require("../Main_controller/models/EB_ContainerFiles")(
  sequelize,
  Sequelize
);



module.exports = db;
