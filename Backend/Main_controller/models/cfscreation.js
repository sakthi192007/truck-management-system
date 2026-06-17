const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const cfscreation = sequelize.define('ICD_Details', {
        ICD_key: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        LocationName: DataTypes.STRING,
        
    }, {
        tableName: 'ICD_Details',
        timestamps: false
    });

    return cfscreation;
};

