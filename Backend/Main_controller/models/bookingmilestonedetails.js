module.exports = function (sequelize, DataTypes) {
    const Milestonedetails = sequelize.define("ExportMilestonesStatusList", {
        ESL_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        milestones: {
            type: DataTypes.INTEGER
        },
        EDT: {
            type: DataTypes.STRING,
        },
        ADT: {
            type: DataTypes.STRING,
        },
        containerNumber: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'ExportMilestonesStatusList',
        timestamps: false
    });
    return Milestonedetails;
};
 