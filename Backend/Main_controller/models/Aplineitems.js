const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Aplineitems = sequelize.define('ApLine_itemDetails', {
        AL_Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        AP_id: DataTypes.INTEGER,
        ChargeCode: DataTypes.INTEGER,
        Description: DataTypes.STRING,
        ContainerType: DataTypes.STRING,
        ContainerNo: DataTypes.STRING,
        HSNCode: DataTypes.STRING,
        Amount: DataTypes.INTEGER,
        SGST: DataTypes.INTEGER,
        CGST: DataTypes.INTEGER,
        IGST: DataTypes.INTEGER, 
        Igstper: DataTypes.STRING, 
        Gstper: DataTypes.STRING,
        Currency: DataTypes.STRING,
    }, {
        tableName: 'ApLine_itemDetails',
        timestamps: false
    });

    return Aplineitems;
};