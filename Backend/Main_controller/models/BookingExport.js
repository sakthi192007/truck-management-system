const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const ExportBookings = sequelize.define('Export_Bookings', {
        EB_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        CustomerName: DataTypes.INTEGER,
        ContainerPlacementDate: DataTypes.DATE,
        CustomerAddress: DataTypes.STRING,
        Stuffing_Location: DataTypes.STRING,
        description: DataTypes.STRING,
        PointOfClearance: DataTypes.INTEGER,
        CustomsClearanceDate: DataTypes.DATE,
        PortOfDischarge: DataTypes.INTEGER,
        CFS: DataTypes.INTEGER,
        SpecialInstruction: DataTypes.STRING,
        Commodity: DataTypes.STRING,
        CRO: DataTypes.STRING,
        Form13: DataTypes.STRING,
        VesselName: DataTypes.STRING,
        VesselVoyage: DataTypes.STRING,
        ShippingLine: DataTypes.STRING,
        LinearBkgno: DataTypes.STRING,
        status: DataTypes.INTEGER,
        CreatedBy: DataTypes.INTEGER,
        ModifiedBy: DataTypes.INTEGER,
        confirmation_mail: DataTypes.STRING


    }, {
        tableName: 'Export_Bookings',
        timestamps: false
    });

    return ExportBookings;
};