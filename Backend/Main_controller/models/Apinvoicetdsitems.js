
const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const ApinvoicetdsItems = sequelize.define('APPaymentlineitems', {
        AEL_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        AE_id: DataTypes.INTEGER,
        Paymenttransactionno: DataTypes.STRING,
        Paymentamount: DataTypes.INTEGER,
        Paymentdate: DataTypes.DATE,
    }, {
        tableName: 'APPaymentlineitems',
        timestamps: false
    });

    return ApinvoicetdsItems;
};