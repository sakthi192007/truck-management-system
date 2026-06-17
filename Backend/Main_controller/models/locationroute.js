const { DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) =>{
    const MasterLocation = sequelize.define('MasterLocation',{
        Ml_key:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Ml_LocationType: DataTypes.STRING,
        Ml_LocationName: DataTypes.STRING,
        Ml_Address: DataTypes.STRING,
        Ml_latitude: DataTypes.DECIMAL(8, 6),
        Ml_longitude: DataTypes.DECIMAL(9, 6),
        Ml_City: DataTypes.STRING,
        Ml_State: DataTypes.STRING,
        Ml_Country: DataTypes.STRING,
        Ml_Createdby: DataTypes.INTEGER,
        Ml_Modifiedby: DataTypes.INTEGER
       
    },{
        tableName: 'MasterLocation',
        timestamps: false
     
    });
    return MasterLocation;
};