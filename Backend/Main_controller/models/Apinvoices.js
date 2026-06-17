const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Apinvoices = sequelize.define('Apinvoices', {
        AP_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Department: DataTypes.INTEGER,
        VendorName: DataTypes.STRING,
        BookingNo: DataTypes.STRING,
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
        invoicepdf: DataTypes.STRING,
        Advpayment: DataTypes.INTEGER,
        Balancedue: DataTypes.INTEGER,
        CreatedBy: DataTypes.INTEGER
    }, {
        tableName: 'Apinvoices',
        timestamps: false
    });

    return Apinvoices;
};