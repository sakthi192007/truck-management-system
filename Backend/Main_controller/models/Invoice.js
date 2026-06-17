const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const sellerInvoices = sequelize.define('Invoices', {
        I_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Department: DataTypes.INTEGER,
        CompanyName: DataTypes.INTEGER,
        BookingNo: DataTypes.STRING,
        invoicepdf: DataTypes.STRING,
        InvoiceDate: DataTypes.DATE,
        InvoiceDueDate: DataTypes.DATE,
        InvoiceReference: DataTypes.STRING,
        InvoiceNumber: DataTypes.STRING,
        SubTotal: DataTypes.INTEGER,
        GSTAmount: DataTypes.INTEGER,
        CGSTAmount: DataTypes.INTEGER,
        IGSTAmount: DataTypes.INTEGER,
        GrandTotal: DataTypes.INTEGER,
        Status: DataTypes.INTEGER,
        Advpayment:DataTypes.INTEGER,
        Balancedue:DataTypes.INTEGER,
         CreatedBy:DataTypes.INTEGER
    }, {
        tableName: 'Invoices',
        timestamps: false
    });

    return sellerInvoices;
};