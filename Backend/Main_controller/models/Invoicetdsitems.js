
const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const InvoicetdsItems = sequelize.define('ArPaymentlineitems', {
        APEL_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        APE_id: DataTypes.INTEGER,
        Paymenttransactionno: DataTypes.STRING,
        Paymentamount: DataTypes.INTEGER,
         Paymentdate: DataTypes.DATE,
    }, {
        tableName: 'ArPaymentlineitems',
        timestamps: false
    });

    return InvoicetdsItems;
};