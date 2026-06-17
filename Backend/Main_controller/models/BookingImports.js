const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const ImportBookings = sequelize.define('Import_Bookings', {
        EB_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        CustomerName: DataTypes.INTEGER,
        ContainerPickUpDate: DataTypes.DATE,
        CustomerAddress: DataTypes.STRING,
        de_Stuffing_Location: DataTypes.STRING,
        description: DataTypes.STRING,
        PointOfClearance: DataTypes.INTEGER,
        CustomsClearanceDate: DataTypes.DATE,
        PortOfDischarge: DataTypes.INTEGER,
        CFS: DataTypes.INTEGER,
        SpecialInstruction: DataTypes.STRING,
        Commodity: DataTypes.STRING,
        DeliveryOrder: DataTypes.STRING,
        IssueDateTime: DataTypes.DATE,
        VesselName: DataTypes.STRING,
        VesselVoyage: DataTypes.STRING,
        ShippingLine: DataTypes.STRING,
        DONo: DataTypes.STRING,
        status: DataTypes.INTEGER,
        CreatedBy: DataTypes.INTEGER,
        ModifiedBy: DataTypes.INTEGER
    }, {
        tableName: 'Import_Bookings',
        timestamps: false
    });

    return ImportBookings;
};