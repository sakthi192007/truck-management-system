const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const SubMaster = sequelize.define('SkybT_SubMaster', {
        SM_PK: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        SM_GroupId: DataTypes.INTEGER,
        SM_MenuId: DataTypes.INTEGER,
        SM_ModifiedOn: DataTypes.INTEGER
    }, {
        tableName: 'SkybT_SubMaster',
        timestamps: false
    });
    return SubMaster;
};