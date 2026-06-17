const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const bookingallocation = sequelize.define('driverBookings', {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Vendor_ID: DataTypes.STRING,
        Client_ID : DataTypes.STRING,
        BookingNumber: DataTypes.STRING,
        Status : DataTypes.STRING,
         CreatedBy:DataTypes.INTEGER,

    }, {
        tableName: 'driverBookings',
        timestamps: false
    });

    return bookingallocation;
};

