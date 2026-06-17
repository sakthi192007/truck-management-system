const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const DriverDetails = sequelize.define('DriverDetails', {
        DD_key: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        CD_ID: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        DriverName: DataTypes.STRING,
        description: DataTypes.STRING,
        Drivercode: DataTypes.STRING,
        DriverPhoneNumber: DataTypes.STRING,
        DrivingLicenceNumber: DataTypes.STRING,
        AadharNumber: DataTypes.INTEGER,
        DrivingLicenseExpiredDate: DataTypes.DATE,
        DrivingLicenceupload: DataTypes.STRING,
        CreatedBy: DataTypes.INTEGER
    }, {
        tableName: 'DriverDetails',
        timestamps: false
    });

    return DriverDetails;
};