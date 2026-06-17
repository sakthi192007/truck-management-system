const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const sellerInvoicesItems = sequelize.define('InvoiceLine_ItemDetails', {
        IL_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        I_id: DataTypes.INTEGER,
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
        Vehicleno:DataTypes.STRING,
         Currency: DataTypes.STRING,

    }, {
        tableName: 'InvoiceLine_ItemDetails',
        timestamps: false
    });

    return sellerInvoicesItems;
};