module.exports = function (sequelize, DataTypes) {
    const EBitems = sequelize.define("EB_ItemDetails", {
        LItem_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        EB_id: {
            type: DataTypes.INTEGER
        },
        ContainerTypes: {
            type: DataTypes.INTEGER,
        },
        NoOfContainers: {
            type: DataTypes.INTEGER,
        },
        CargoWeight: {
            type: DataTypes.INTEGER
        },
        WeightTypes: {
            type: DataTypes.STRING
        },
        StuffingLocation: {
            type: DataTypes.INTEGER
        },
         StuffingEstimateTime: {
            type: DataTypes.STRING
        },
         StuffingActualTime: {
            type: DataTypes.STRING
        },
         EmptyContainerPickup: {
            type: DataTypes.INTEGER
        },
         EmptyContainerEstimateTime: {
            type: DataTypes.STRING
        },
         EmptyContainerActualTime: {
            type: DataTypes.STRING
        },
         containernumber: {
            type: DataTypes.STRING
        },
         SealNumber: {
            type: DataTypes.STRING
        },
         VendorName: {
            type: DataTypes.INTEGER
        },
         Vehicleno: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'EB_ItemDetails',
        timestamps: false
    });
    return EBitems;
};
