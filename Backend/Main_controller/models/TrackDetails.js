const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const TrackDetails = sequelize.define('TrackDetails', {
        TD_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
       
        Speed: DataTypes.INTEGER,
        Latitude: DataTypes.STRING,
        Longitude: DataTypes.STRING,
        Ignition: DataTypes.STRING,
        TotalGpsDuration: DataTypes.STRING,
        TotalGpsOdometer: DataTypes.INTEGER,
        VehicleNo: DataTypes.INTEGER,
        Timestamp: DataTypes.BIGINT,
        Alias: DataTypes.STRING,
        Imei : DataTypes.STRING,
        VehicleStatus: DataTypes.STRING,
        Direction :DataTypes.INTEGER,
        Vendor: DataTypes.STRING
        
    }, {
        tableName: 'TrackDetails',
        timestamps: false
    });

    return TrackDetails;
};