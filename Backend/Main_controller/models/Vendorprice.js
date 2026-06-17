const { DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    const Vendor_Price_Details = sequelize.define('Vendor_Price_Details',{
        V_id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        VendorName: DataTypes.STRING,
        ContainerType: DataTypes.INTEGER,
        EmptyContainerPickup: DataTypes.STRING,
        StuffingLocation: DataTypes.STRING,
        Stuffing2: DataTypes.STRING,
        Unloading: DataTypes.STRING,
        ValidFrom: DataTypes.DATE,
        ValidTo: DataTypes.DATE,
        TransportationCharges:DataTypes.BIGINT,
        HaltingCharges1to2days:DataTypes.BIGINT,
        HaltingCharges2to5days:DataTypes.BIGINT,
        HaltingChargesabove5days:DataTypes.BIGINT,
        Total:DataTypes.BIGINT,
        FileName:DataTypes.STRING,
        Price: DataTypes.BIGINT,
        Status: DataTypes.INTEGER,
        CreatedBy: DataTypes.INTEGER,
        modifiedBy: DataTypes.INTEGER,
    },{

        tableName: 'Vendor_Price_Details',
        timestamps: false


    });
    return Vendor_Price_Details;
};