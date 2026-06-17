const { DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) =>{
    const Campaignmaster = sequelize.define('Campaignmaster',{
        CM_key:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        CM_CampaignName: DataTypes.STRING,
        CM_Content: DataTypes.STRING,
        CM_Status: DataTypes.INTEGER,
        CM_Createdby: DataTypes.INTEGER,
        CM_Modifiedby: DataTypes.INTEGER
       
    },{
        tableName: 'Campaignmaster',
        timestamps: false
     
    });
    return Campaignmaster;
};