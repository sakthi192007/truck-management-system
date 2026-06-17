const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();
const db = require('../../config/dbconnection');
const Vehicle_Information = db.VehicleInformation;
const TrackDetails = db.TrackDetails
const Vehicleinform=db.vehicleInform;
const Truckmasterinform=db.Truckmasterinform;

const CF = require('../../middlewares/commonfunction');
const winston = require('../../middlewares/logger');
const config1 = require('../../config/config.json');
const verifytoken = require('../../middlewares/verifytoken');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const axios = require('axios'); 
const { storage } = require('../../middlewares/storage');
var upload = multer({ storage: storage }).single('file');

router.get("/mapdetails/:id/:role", verifytoken, function(req, res, next) {
    const id = req.params.id;
 
     db.sequelize.query(
         "EXEC Container_LiveLocation @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
     )
   
    .then((data) => {
        res.status(200).send({
            response_code: "200",
            response_message: "success.",
            data,
        });
        winston.info("map");
    })
    .catch(error => {
        console.error("Error fetching exportreportgrid details:", error);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    });
});
router.get("/livemapdetails/:id/:Dep", verifytoken, async (req, res) => {
    const containerNumber = req.params.id;
    const dep = req.params.Dep;

    let query = "";

    if (dep === "Export") {
        query = "EXEC GetExportLocationDetails @ContainerNumber = :containerNumber";
    } else {
        query = "EXEC GetImportLocationDetails @ContainerNumber = :containerNumber";
    }

    try {
        // Main data query
        const data = await db.sequelize.query(query, {
            replacements: { containerNumber },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (!data || data.length === 0) {
            return res.status(404).send({
                response_code: "404",
                response_message: "No data found"
            });
        }

        // Live route (history)
        const liveRoute = await db.sequelize.query(
            "SELECT Latitude, Longitude FROM LiveLocation WHERE ContainerNo = :containerNumber ORDER BY Createdon ASC",
            {
                replacements: { containerNumber },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        // Last known location
        const liveMark = await db.sequelize.query(
            "SELECT TOP 1 Latitude, Longitude FROM LiveLocation WHERE ContainerNo = :containerNumber ORDER BY Createdon DESC",
            {
                replacements: { containerNumber },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        res.status(200).send({
            response_code: "200",
            response_message: "Success",
            data: data,
            Liveroute: liveRoute,
            Livedata: liveMark
        });

        winston.info("/livemapdetails - success");

    } catch (error) {
        winston.error("Error in /livemapdetails: " + error.message);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    }
});
router.get("/milestonedetails/Export/:id", verifytoken, async (req, res) => {
    const containerNumber = req.params.id;
    const dep = req.params.Dep;

    let query = "";
    let subquery = "";

        query = "select c.milestones,b.ADT,  b.milestones AS milestone_id, '1' as status from EB_ItemDetails a left join ExportMilestonesStatusList b on a.containernumber=b.containernumber left join ExportMilestones c on b.milestones=c.EM_id where a.containernumber=:containerNumber and b.ADT is not null union select c.milestones,b.EDT,  b.milestones AS milestone_id, '0' as status from EB_ItemDetails a left join ExportMilestonesStatusList b on a.containernumber=b.containernumber left join ExportMilestones c on b.milestones=c.EM_id where a.containernumber=:containerNumber and  b.ADT is null order by milestone_id asc";
        subquery="select b.Ml_LocationName as emptyPickup,c.Ml_LocationName as factory,e.Ml_LocationName as PointOfClearance, f.Ml_LocationName as PortName from EB_ItemDetails a left join MasterLocation b on a.EmptyContainerPickup=b.Ml_key left join MasterLocation c on a.StuffingLocation=c.Ml_key left join Export_Bookings d on a.EB_id=d.EB_id left join MasterLocation e on d.PointOfClearance=e.Ml_key left join MasterLocation f on d.PortOfDischarge=f.Ml_key where a.containernumber=:containerNumber";
   

    try {
        // Main data query
        const data = await db.sequelize.query(query, {
            replacements: { containerNumber },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (!data || data.length === 0) {
            return res.status(404).send({
                response_code: "404",
                response_message: "No data found"
            });
        }

  const locationmilestone = await db.sequelize.query(subquery,
            {
                replacements: { containerNumber },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        res.status(200).send({
            response_code: "200",
            response_message: "Success",
            data: data,
            Milstones: locationmilestone
           
        });

        winston.info("/livemapdetails - success");

    } catch (error) {
        winston.error("Error in /livemapdetails: " + error.message);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    }
});

router.get("/milestonedetails/Import/:id", verifytoken, async (req, res) => {
    const containerNumber = req.params.id;


    let query = "";
    let subquery = "";

    
        query = "SELECT c.milestones, b.ADT AS DateTime, b.milestones AS milestone_id, '1' as status FROM IB_ItemDetails a LEFT JOIN ImportMilestonesStatusList b ON a.containernumber = b.containernumber LEFT JOIN ImportMilestones c ON b.milestones = c.IM_id WHERE a.containernumber = :containerNumber AND b.ADT IS NOT NULL UNION  SELECT c.milestones, b.EDT AS DateTime, b.milestones AS milestone_id, '0' as status FROM IB_ItemDetails a LEFT JOIN ImportMilestonesStatusList b ON a.containernumber = b.containernumber LEFT JOIN ImportMilestones c ON b.milestones = c.IM_id WHERE a.containernumber = :containerNumber AND b.ADT IS NULL ORDER BY milestone_id ASC;";
        subquery="select b.Ml_LocationName as ContainerPickupLocation,c.Ml_LocationName as StuffingLocation,d.Ml_LocationName as EmptyReturnAt from IB_ItemDetails a left join MasterLocation b on a.ContainerPickupLocation=b.Ml_key left join MasterLocation c on a.DE_StuffingLocation=c.Ml_key left join MasterLocation d on a.EmptyReturnAt=d.Ml_key where a.containernumber=:containerNumber";
    

    try {
        // Main data query
        const data = await db.sequelize.query(query, {
            replacements: { containerNumber },
            type: db.Sequelize.QueryTypes.SELECT
        });

        if (!data || data.length === 0) {
            return res.status(404).send({
                response_code: "404",
                response_message: "No data found"
            });
        }

  const locationmilestone = await db.sequelize.query(subquery,
            {
                replacements: { containerNumber },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );

        res.status(200).send({
            response_code: "200",
            response_message: "Success",
            data: data,
            Milstones: locationmilestone
           
        });

        winston.info("/livemapdetails - success");

    } catch (error) {
        winston.error("Error in /livemapdetails: " + error.message);
        res.status(500).send({
            response_code: "500",
            response_message: "Internal Server Error"
        });
    }
});
  
router.post('/vehicledetails', verifytoken, async function(req, res, next) {
    const jsondata = req.body;
    console.log(jsondata)
    
    try {

        const newCompany = await Vehicle_Information.create({
            DriverName: jsondata.drivername,
            DriverNo: jsondata.drivernumber,
            // VehicleNo: jsondata.vehiclenumber,
            BookingNumber : jsondata.bookingno,
            DeviceName:jsondata.devicename,
            IMEINo:jsondata.imeino,
            DateofPurchase:jsondata.dop,
            ExpiryDate:jsondata.expirydate,
            ContainerNo:jsondata.contno,
            SealNo:jsondata.SealNo,
        });


        const response = CF.getStandardResponse(201, "VehicleInformation Created successfully");
        res.status(201).send(response);

    } catch (err) {
        winston.error('postVehicleInformation: ' + err);
        const response = CF.getStandardResponse(500, "Something went wrong");
        res.status(500).send(response);
    }
});
router.get("/getdevice", verifytoken, function(req, res, next) {
  
    db.sequelize.query(
            "select G_id,DeviceName,IMEINo,DateofPurchase,ExpiryDate from GpsData", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Device");
        })
        .catch(error => {
            console.error("Error fetching Device:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});

router.get("/getdevicebookingno", verifytoken, function(req, res, next) {
  
    db.sequelize.query(
            "select EB_id,BookingNumber from Export_Bookings", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
        )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success.",
                data,
            });
            winston.info("Device");
        })
        .catch(error => {
            console.error("Error fetching Device:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error"
            });
        });
});


// vehicleInformation page
router.post('/insert', async (req, res) => {
  try {
    const data = req.body;
console.log(data);

    const record = await Vehicleinform.create({
      BookingNumber: data.BookingNumber,
      TruckNumber: data.TruckNumber,
      DriverName: data.DriverName,
      DriverMobile: data.DriverMobile,
      StartKms:data.StartKms,
      EndKms:data.EndKms,
      DieselAllowed: data.DieselAllowed,
      DieselActual: data.DieselActual,
      DieselCost: data.DieselCost,
      DriverBattaActual: data.DriverBattaActual,
      DriverBattaPaid: data.DriverBattaPaid,
      DriverSalaryActual: data.DriverSalaryActual,
      DriverSalaryPaid: data.DriverSalaryPaid,
      Spares: data.Spares,
      Maintenance: data.Maintenance,
      Insurance: data.Insurance,
      TollExpenses: data.TollExpenses,
      TyrePurchase: data.TyrePurchase,
      Retread: data.Retread,
      TyreSales: data.TyreSales,
      OtherExpenses: data.OtherExpenses,
      Oil: data.Oil,
      Income: data.Income,
      Balance: data.Balance,
 status: '0',   
CreatedBy: data.CreatedBy


 });

    res.status(200).json({ success: true, message: 'Vehicle record inserted successfully', data: record });
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).json({ success: false, message: 'Error inserting data', error: error.message });
  }
});
router.get("/getAllVehicle/:id", verifytoken, async (req, res) => {
    const id = req.params.id;
   
    db.sequelize.query(
        "EXEC VehicleInform_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success",
                data,
            });
            winston.info("vehicle fetched successfully.");
        })
        .catch((error) => {
            console.error("Error fetching vehicle details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error",
            });
        });

});

router.get('/getVehicleById/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const vehicle = await Vehicleinform.findOne({ where: { VehicleID: id } });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});
router.put('/updaterecords/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // Find the vehicle first
    const vehicle = await Vehicleinform.findOne({ where: { VehicleID: id } });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await vehicle.update({
  BookingNumber: data.BookingNumber,
  TruckNumber: data.TruckNumber,
  DriverName: data.DriverName,
  DriverMobile: data.DriverMobile,
  EndKms:data.EndKms,
  StartKms:data.StartKms,
  DieselAllowed: data.DieselAllowed,
  DieselActual: data.DieselActual,
  DieselCost: data.DieselCost,
  DriverBattaActual: data.DriverBattaActual,
  DriverBattaPaid: data.DriverBattaPaid,
  DriverSalaryActual: data.DriverSalaryActual,
  DriverSalaryPaid: data.DriverSalaryPaid,
  Spares: data.Spares,
  Maintenance: data.Maintenance,
  Insurance: data.Insurance,
  TollExpenses: data.TollExpenses,
  TyrePurchase: data.TyrePurchase,
  Retread: data.Retread,
  TyreSales: data.TyreSales,
  OtherExpenses: data.OtherExpenses,
  Oil: data.Oil,
  Income: data.Income,
  Balance: data.Balance,
  ModifiedBy: data.ModifiedBy, 
  ModifiedOn: new Date()    
});

    res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: vehicle });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Error updating vehicle', error: error.message });
  }
});
router.put('/deletevehiclegrid/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Delete request received for VehicleID:', id);

    const vehicle = await Vehicleinform.findOne({ where: { VehicleID: id } });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    
    await vehicle.update({ status: '1' });

    res.status(200).json({
      success: true,
      message: 'Vehicle soft-deleted successfully',
      data: vehicle
    });
  } catch (err) {
    console.error('Error in deletevehiclegrid:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});
// Truckmasterpage


router.post('/truckinsert', async (req, res) => {
  try {
    const data = req.body;

    console.log(data);
const record = await Truckmasterinform.create({
  BookingNumber: data.BookingNumber,
  IncomeA_C: data.IncomeA_C || '',
  DieselA_C: data.DieselA_C || '',
  AdvanceA_C: data.AdvanceA_C || '',
  DriverBattaA_C: data.DriverBattaA_C || '',
  CleanerBattaA_C: data.CleanerBattaA_C || '',
  OtherExpensesA_C: data.OtherExpensesA_C || '',
  OilA_C: data.OilA_C || '',
  NewTyrePurchaseA_C: data.NewTyrePurchaseA_C || '', 
  TyreRetreadA_C: data.TyreRetreadA_C || '',
  TyreSalesA_C: data.TyreSalesA_C || '',
  SparesA_C: data.SparesA_C || '',
  MaintenanceA_C: data.MaintenanceA_C || '',
  InsuranceTaxA_C: data.InsuranceTaxA_C || '',
  TDSA_C: data.TDSA_C || '',
  ShortageA_C: data.ShortageA_C || '',
  HPA_C: data.HPA_C || '',
  HPA_C2: data.HPA_C2 || '',
  HPInterestA_C: data.HPInterestA_C || '',
  HPInterestA_C2: data.HPInterestA_C2 || '',
  CommissionA_C: data.CommissionA_C || '',
  FastTagA_C: data.FastTagA_C || '',
  BusinessPromotionA_C: data.BusinessPromotionA_C || '',
  MamoolA_C: data.MamoolA_C || '',
  LabourWelfareA_C: data.LabourWelfareA_C || '',
  AssetA_C: data.AssetA_C || '',
  Status: '0' ,
CreatedBy: data.CreatedBy
});

    res.status(200).json({ success: true, message: 'Truckmaster record inserted successfully', data: record });
  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).json({ success: false, message: 'Error inserting data', error: error.message });
  }
});

router.get("/getAllTruck/:id", verifytoken, async (req, res) => {
    const id = req.params.id;
   
    db.sequelize.query(
        "EXEC Truckmaster_Grid @LoginUserID='"+id+"'", { replacements: ["active"], type: db.Sequelize.QueryTypes.SELECT }
    )
        .then((data) => {
            res.status(200).send({
                response_code: "200",
                response_message: "success",
                data,
            });
            winston.info("truckmaster fetched successfully.");
        })
        .catch((error) => {
            console.error("Error fetching truckmaster details:", error);
            res.status(500).send({
                response_code: "500",
                response_message: "Internal Server Error",
            });
        });

});


router.get('/getTruckById/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const truck = await Truckmasterinform.findOne({ where: { TruckID: id } });
    if (!truck) {
      return res.status(404).json({ success: false, message: 'truck not found' });
    }
    res.status(200).json({ success: true, data: truck });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});
router.put('/updateTruckRecords/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
      console.log(data);
    const { Sequelize } = require('sequelize');
    const moment = require('moment'); // optional if you want to format dates

    const truck = await Truckmasterinform.findOne({ where: { TruckID: id } });
    if (!truck) {
      return res.status(404).send(CF.getStandardResponse(404, 'Truck not found', null));
    }

    await truck.update({
      BookingNumber: data.BookingNumber || '',
      IncomeA_C: data.IncomeA_C || data.Income || '',
      DieselA_C: data.DieselA_C || data.Diesel || '',
      AdvanceA_C: data.AdvanceA_C || data.Advance || '',
      DriverBattaA_C: data.DriverBattaA_C || data.DriverBatta || data.Driverbata || '',
      CleanerBattaA_C: data.CleanerBattaA_C || data.Cleanerbata || '',
      OtherExpensesA_C: data.OtherExpensesA_C || data.OtherExpenses || '',
      OilA_C: data.OilA_C || data.Oil || '',
      NewTyrePurchaseA_C: data.NewTyrePurchaseA_C || data.Pressure || '',
      TyreRetreadA_C: data.TyreRetreadA_C || data.Retread || '',
      TyreSalesA_C: data.TyreSalesA_C || data.tyreSales || '',
      SparesA_C: data.SparesA_C || data.Spares || '',
      MaintenanceA_C: data.MaintenanceA_C || data.Maintenance || '',
      InsuranceTaxA_C: data.InsuranceTaxA_C || data.Insurance || '',
      TDSA_C: data.TDSA_C || data.Tds || '',
      ShortageA_C: data.ShortageA_C || data.Shortage || '',
      HPA_C: data.HPA_C || data.HP1 || '',
      HPA_C2: data.HPA_C2 || data.HP2 || '',
      HPInterestA_C: data.HPInterestA_C || data.Hpinetest || '',
      HPInterestA_C2: data.HPInterestA_C2 || data.HPInterest2 || '',
      CommissionA_C: data.CommissionA_C || data.Commission || '',
      FastTagA_C: data.FastTagA_C || data.Fasttag || '',
      BusinessPromotionA_C: data.BusinessPromotionA_C || data.BussinessPromotion || '',
      MamoolA_C: data.MamoolA_C || data.Mamool || '',
      LabourWelfareA_C: data.LabourWelfareA_C || data.Labour || '',
      AssetA_C: data.AssetA_C || data.AssetNumber || '',
      ModifiedBy: data.ModifiedBy,
      ModifiedOn: Sequelize.literal(`CONVERT(DATETIME, '${new Date().toISOString().replace('T', ' ').substring(0, 19)}', 120)`)
    });

    const response = CF.getStandardResponse(200, 'Truckmaster updated successfully', truck);
    return res.status(200).send(response);

  } catch (error) {
    console.error('Update error:', error);
    const response = CF.getStandardResponse(500, 'Error updating truckmaster', { error: error.message });
    return res.status(500).send(response);
  }
});



router.put('/deleteTruckmastergrid/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Delete request received for TruckID:', id);

    const truck = await Truckmasterinform.findOne({ where: { TruckID: id } });

    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truckmaster not found' });
    }

    await truck.update({ Status: '1' });

    res.status(200).json({
      success: true,
      message: 'Truck soft-deleted successfully',
      data: truck
    });
  } catch (err) {
    console.error('Error in deleteTruckmastergrid:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;