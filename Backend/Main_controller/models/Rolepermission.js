const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RolePermissions = sequelize.define('SkybT_RolePermissions', {
        RP_ID: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        GM_PK: DataTypes.BIGINT,   
        Menukey: DataTypes.STRING,
        CanMenu: DataTypes.INTEGER,
        CanCreate: DataTypes.INTEGER,
        CanEdit: DataTypes.INTEGER,
        CanView: DataTypes.INTEGER,
        CanDelete: DataTypes.INTEGER,
        CanReport: DataTypes.INTEGER
    }, {
        tableName: 'SkybT_RolePermissions',
        timestamps: false
    });
    return RolePermissions;
};
