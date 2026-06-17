module.exports = function (sequelize, DataTypes) {
    const IBitems = sequelize.define("IB_ItemDetails", {
        LineItem_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        IB_id: {
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
         ContainerPickupLocation: {
            type: DataTypes.INTEGER
        },
        ContainerPickupEstimateTime:{
           type: DataTypes.STRING  
        },
        ContainerPickupActualTime:{
           type: DataTypes.STRING  
        },
        DE_StuffingLocation: {
            type: DataTypes.INTEGER
        },
         DE_StuffingEstimateTime: {
            type: DataTypes.STRING
        },
         DE_StuffingActualTime: {
            type: DataTypes.STRING
        },
        EmptyReturnAt: {
            type: DataTypes.INTEGER
        },
         EmptyReturnEstimateTime: {
            type: DataTypes.STRING
        },
         EmptyReturnActualTime: {
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
        tableName: 'IB_ItemDetails',
        timestamps: false
    });
    return IBitems;
};
