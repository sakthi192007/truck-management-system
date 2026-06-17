const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const vehicleDetails = sequelize.define('vehicleDetails', {
        VD_key: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        CD_ID: DataTypes.INTEGER,
        booking_status: DataTypes.INTEGER,
        own_addition: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        ContainerFt: DataTypes.INTEGER,
        TypeofContainers: DataTypes.INTEGER,
        vehiclecode: DataTypes.STRING,
        VehicleNumber: DataTypes.STRING,
        VehicleSpecifications: DataTypes.INTEGER,
        RcNumber: DataTypes.STRING,
        polluctionexpiry: DataTypes.DATE,
        YearofManufacture: DataTypes.DATE,
        PermitofVehicle: DataTypes.STRING,
        insurancenumber: DataTypes.STRING,
        vehides: DataTypes.STRING,
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
        CreatedBy: DataTypes.INTEGER,
        ModifiedBy: DataTypes.INTEGER
    }, {
        tableName: 'vehicleDetails',
        timestamps: false
    });

    return vehicleDetails;
};