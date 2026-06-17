module.exports = function (sequelize, DataTypes) {
    const IBvendor = sequelize.define("Import_Bookings", {
        IB_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        CustomerName: {
            type: DataTypes.INTEGER
        },
        ContainerPickUpDate: {
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
         DeliveryOrder: {
            type: DataTypes.STRING
        },
         IssueDateTime: {
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
         dovaildupto: {
            type: DataTypes.STRING
        },
         eta: {
            type: DataTypes.STRING
        },
         De_Stuffing_Location: {
            type: DataTypes.STRING
        },
        POD: {
            type: DataTypes.STRING
        },
         description: {
            type: DataTypes.STRING
        },
         LinearBkgno: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'Import_Bookings',
        timestamps: false
    });
    return IBvendor;
};
