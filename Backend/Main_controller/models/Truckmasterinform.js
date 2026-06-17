const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const TruckMaster = sequelize.define('Truckmasterinform', {
    TruckID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    BookingNumber: DataTypes.STRING,
    IncomeA_C: DataTypes.STRING,
    DieselA_C: DataTypes.STRING,
    AdvanceA_C: DataTypes.STRING,
    DriverBattaA_C: DataTypes.STRING,
    CleanerBattaA_C: DataTypes.STRING,
    OtherExpensesA_C: DataTypes.STRING,
    OilA_C: DataTypes.STRING,
    NewTyrePurchaseA_C: DataTypes.STRING,
    TyreRetreadA_C: DataTypes.STRING,
    TyreSalesA_C: DataTypes.STRING,
    SparesA_C: DataTypes.STRING,
    MaintenanceA_C: DataTypes.STRING,
    InsuranceTaxA_C: DataTypes.STRING,
    TDSA_C: DataTypes.STRING,
    ShortageA_C: DataTypes.STRING,
    HPA_C: DataTypes.STRING,
    HPA_C2: DataTypes.STRING,
    HPInterestA_C: DataTypes.STRING,
    HPInterestA_C2: DataTypes.STRING,
    CommissionA_C: DataTypes.STRING,
    FastTagA_C: DataTypes.STRING,
    BusinessPromotionA_C: DataTypes.STRING,
    MamoolA_C: DataTypes.STRING,
    LabourWelfareA_C: DataTypes.STRING,
    AssetA_C: DataTypes.STRING,
     CreatedBy: { type: DataTypes.STRING, allowNull: true },
  ModifiedBy: { type: DataTypes.STRING, allowNull: true },
  ModifiedOn: { type: DataTypes.DATE, allowNull: true },
    Status: {
      type: DataTypes.STRING,
      defaultValue: 'Active'
    },
    
  }, {
    tableName: 'truckmaster',
    timestamps: false
  });

  return TruckMaster;
};
