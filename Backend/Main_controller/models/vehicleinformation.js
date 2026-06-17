const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Vehicle_information = sequelize.define('Vehicle_information', {
        VI_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        DriverName: DataTypes.STRING,
        DriverNo: DataTypes.INTEGER,
        // VehicleNo: DataTypes.STRING,
        DeviceName: DataTypes.STRING,
        IMEINo: DataTypes.STRING,
        //DateofPurchase :DataTypes.DATE,
        ExpiryDate:DataTypes.DATE,
        BookingNumber:DataTypes.STRING,
        ContainerNo:DataTypes.STRING,
        SealNo:DataTypes.STRING,
    }, {
        tableName: 'Vehicle_information',
        timestamps: false
    });

    return Vehicle_information;
};