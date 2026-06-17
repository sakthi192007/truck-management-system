const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const AdditionalvehicleDetails = sequelize.define('AdditionalvehicleDetails', {
        AVD_key: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        CD_ID: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        ContainerFt: DataTypes.INTEGER,
        TypeofContainers: DataTypes.INTEGER,
        VehicleNumber: DataTypes.STRING,
        VehicleSpecifications: DataTypes.INTEGER,
        RcNumber: DataTypes.STRING,
        YearofManufacture: DataTypes.DATE,
        PermitofVehicle: DataTypes.STRING,
        PermitofVehicleExpiryDate: DataTypes.DATE,
        FCExpiryDate: DataTypes.DATE,
        RoadTaxExpiryDate: DataTypes.DATE,
        VehiclePollutionCertificateNumber: DataTypes.STRING,
        InsuranceCompanyName: DataTypes.STRING,
        InsuranceExpiryDate: DataTypes.DATE,
        RCUpload: DataTypes.STRING,
        InsuranceUpload: DataTypes.STRING,
        PollutionCertificateUpload: DataTypes.STRING,
        AttachedTruckDetails: DataTypes.STRING,
        booking_status: DataTypes.INTEGER,
        CreatedBy: DataTypes.INTEGER,

        ModifiedBy: DataTypes.INTEGER
    }, {
        tableName: 'AdditionalvehicleDetails',
        timestamps: false
    });

    return AdditionalvehicleDetails;
};