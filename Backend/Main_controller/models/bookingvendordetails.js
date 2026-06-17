module.exports = function (sequelize, DataTypes) {
    const EBvendor = sequelize.define("Export_Bookings", {
        EB_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        CustomerName: {
            type: DataTypes.INTEGER
        },
        ContainerPlacementDate: {
            type: DataTypes.STRING,
        },
        CustomerAddress: {
            type: DataTypes.STRING,
        },
        PointOfClearance: {
            type: DataTypes.INTEGER
        },
        CustomsClearanceDate: {
            type: DataTypes.STRING
        },
        PortOfDischarge: {
            type: DataTypes.INTEGER
        },
        CFS: {
            type: DataTypes.INTEGER
        },
         SpecialInstruction: {
            type: DataTypes.STRING
        },
         Commodity: {
            type: DataTypes.STRING
        },
         CRO: {
            type: DataTypes.STRING
        },
         Form13: {
            type: DataTypes.STRING
        },
         VesselName: {
            type: DataTypes.STRING
        },
         VesselVoyage: {
            type: DataTypes.STRING
        },
         ShippingLine: {
            type: DataTypes.STRING
        },
         status: {
            type: DataTypes.INTEGER
        },
         BookingNumber: {
            type: DataTypes.STRING
        },
         contactperson: {
            type: DataTypes.STRING
        },
         phone_number: {
            type: DataTypes.STRING
        },
         Portcutoff: {
            type: DataTypes.STRING
        },
         etd: {
            type: DataTypes.STRING
        },
         Stuffing_Location: {
            type: DataTypes.STRING
        },
         description: {
            type: DataTypes.STRING
        },
         LinearBkgno: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'Export_Bookings',
        timestamps: false
    });
    return EBvendor;
};
