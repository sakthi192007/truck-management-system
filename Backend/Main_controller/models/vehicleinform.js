const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
const VehicleInform = sequelize.define('VehicleInform', {
  VehicleID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  BookingNumber: DataTypes.STRING,
  TruckNumber: DataTypes.STRING,
  DriverName: DataTypes.STRING,
  DriverMobile: DataTypes.STRING,
  DieselAllowed: DataTypes.STRING,
  DieselActual: DataTypes.STRING,
  DieselCost: DataTypes.STRING,
  DriverBattaActual: DataTypes.STRING,
  DriverBattaPaid: DataTypes.STRING,
  DriverSalaryActual: DataTypes.STRING,
  DriverSalaryPaid: DataTypes.STRING,
  Spares: DataTypes.STRING,
  Maintenance: DataTypes.STRING,
  Insurance: DataTypes.STRING,
  TollExpenses: DataTypes.STRING,
  TyrePurchase: DataTypes.STRING,
  Retread: DataTypes.STRING,
  TyreSales: DataTypes.STRING,
  OtherExpenses: DataTypes.STRING,
  Oil: DataTypes.STRING,
  Income: DataTypes.STRING,
  Balance: DataTypes.STRING,
  CreatedBy:DataTypes.INTEGER,
 Status: {
      type: DataTypes.STRING,
      defaultValue: 'Active'
    }
}, {
  tableName: 'VehicleInform',
  timestamps: false
});

    return VehicleInform;
};
