const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const GroupMaster = sequelize.define('SkybT_GroupMaster', {
        GM_PK: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        GM_GroupName: DataTypes.STRING,
        GM_Role: DataTypes.STRING,
        GM_Description: DataTypes.STRING,
        GM_ModifiedOn: DataTypes.DATE,
        GM_Accessstatus1:DataTypes.INTEGER,
        GM_Accessstatus2:DataTypes.INTEGER,
        GM_Accessstatus3:DataTypes.INTEGER,
        GM_Accessstatus4:DataTypes.INTEGER
    }, {
        tableName: 'SkybT_GroupMaster',
        timestamps: false
    });
    return GroupMaster;
};