const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const logdetails = sequelize.define('logdetails', {
        logkey: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        otp: DataTypes.INTEGER,
        createdby: DataTypes.INTEGER,
        createdOn: DataTypes.DATE,
    }, {
        tableName: 'logdetails',
        timestamps: false
    });
    

    return logdetails;
};