const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const BankDetails = sequelize.define('BankDetails', {
        BD_key: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        CD_ID: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        AccountHolderName: DataTypes.STRING,
        BankAccountNumber: DataTypes.STRING,
        description: DataTypes.STRING,
        BankName: DataTypes.STRING,
        bankcode: DataTypes.STRING,
        IFSCCode: DataTypes.STRING,
        Branch: DataTypes.STRING,
        BankAddress: DataTypes.STRING,
        BankStatement: DataTypes.STRING,
        CreatedBy: DataTypes.STRING,
        ModifiedBy: DataTypes.INTEGER
    }, {
        tableName: 'BankDetails',
        timestamps: false
    });

    return BankDetails;
};