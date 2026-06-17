const { DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) =>{
    const Client_selling_price = sequelize.define('Client_selling_price',{
        C_id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ClientName: DataTypes.STRING,
        Stuffing2: DataTypes.STRING,
        ContainerType: DataTypes.INTEGER,
        EmptyContainerPickup: DataTypes.STRING,
        StuffingLocation: DataTypes.STRING,
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
        modifiedBy: DataTypes.INTEGER
    },{
        tableName: 'Client_selling_price',
        timestamps: false
     
    });
    return Client_selling_price;
};