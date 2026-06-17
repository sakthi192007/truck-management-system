module.exports = function (sequelize, DataTypes) {
    const milestoneimport = sequelize.define("ImportMilestonesStatusList", {
        ISL_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        milestones: {
            type: DataTypes.INTEGER
        },
        EDT: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ADT: {
            type: DataTypes.STRING,
            allowNull: true
        },
        containerNumber: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'ImportMilestonesStatusList',
        timestamps: false
    });
    return milestoneimport;
};
 