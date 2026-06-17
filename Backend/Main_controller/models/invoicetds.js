const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Invoicetds = sequelize.define('ArPaymententry', {
        APE_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ClientName: DataTypes.INTEGER,
        InvoiceNumber: DataTypes.STRING,
        InvoiceDate: DataTypes.DATE,
        Paymenttransactionno: DataTypes.STRING,
        SubTotal: DataTypes.INTEGER,
        GST: DataTypes.INTEGER,
        GrandTotal: DataTypes.INTEGER,
        Invoicetype: DataTypes.INTEGER,
        Percentage: DataTypes.INTEGER,
        Amount: DataTypes.INTEGER,
        Type: DataTypes.INTEGER,
        TDS: DataTypes.INTEGER,
        Payment: DataTypes.INTEGER,
        Balanceamount: DataTypes.INTEGER,
        Userid: DataTypes.INTEGER,
    }, {
        tableName: 'ArPaymententry',
        timestamps: false
    });

    return Invoicetds;
};