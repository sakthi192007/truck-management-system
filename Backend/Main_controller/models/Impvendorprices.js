const { DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    const impvendor_price = sequelize.define('impvendor_price',{
        V_id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        VendorName: DataTypes.STRING,
        ContainerType: DataTypes.INTEGER,
        FullContainerPickupFromCFSPort: DataTypes.STRING,
        EmptyContainerPickup: DataTypes.STRING,
        Unloading: DataTypes.STRING,
        Unloading2: DataTypes.STRING,
        ValidFrom: DataTypes.DATE,
        ValidTo: DataTypes.DATE,
        TransportationCharges:DataTypes.BIGINT,
        HaltingCharges1to2days:DataTypes.BIGINT,
        HaltingCharges2to5days:DataTypes.BIGINT,
        HaltingChargesabove5days:DataTypes.BIGINT,
        Agreement:DataTypes.STRING,
        Status: DataTypes.INTEGER,
        CreatedBy: DataTypes.INTEGER,
        modifiedBy: DataTypes.INTEGER,
    },{

        tableName: 'impvendor_price',
        timestamps: false


    });
    return impvendor_price;
};