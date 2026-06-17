
const { DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) =>{
    const ImportClient_selling_price = sequelize.define('ImportClient_selling_price',{
        C_id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ClientName: DataTypes.STRING,
        fullcontainerpickup: DataTypes.INTEGER,
        Unloading2: DataTypes.STRING,
        ContainerType: DataTypes.INTEGER,
        EmptyContainerPickup: DataTypes.STRING,
        Unloading: DataTypes.STRING,
        ValidFrom: DataTypes.DATE,
        ValidTo: DataTypes.DATE,
        TransportationCharges:DataTypes.BIGINT,
        HaltingCharges1to2days:DataTypes.BIGINT,
        HaltingCharges2to5days:DataTypes.BIGINT,
        HaltingChargesabove5days:DataTypes.BIGINT,
        FileName:DataTypes.STRING,
        Status: DataTypes.INTEGER,
        CreatedBy: DataTypes.INTEGER,
        modifiedBy: DataTypes.INTEGER,
    },{
        tableName: 'ImportClient_selling_price',
        timestamps: false
     
    });
    return ImportClient_selling_price;
};