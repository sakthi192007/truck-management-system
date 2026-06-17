const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const BranchDetails = sequelize.define('BranchDetails', {
        B_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        User_ID: DataTypes.INTEGER,
        Email: DataTypes.STRING,
        User_Roleid: DataTypes.INTEGER,
        CompanyName:DataTypes.STRING,
        BranchName:DataTypes.STRING,
        PhoneNumber: DataTypes.STRING,
        Address: DataTypes.STRING,
        Description: DataTypes.STRING,
        Status: DataTypes.INTEGER,
        GSTNo: DataTypes.STRING,
        PanNumber: DataTypes.STRING,
        PostalCode: DataTypes.STRING,
        City: DataTypes.STRING,
        State: DataTypes.STRING,
        Country: DataTypes.STRING,
        Branch: DataTypes.STRING

    }, {
        tableName: 'BranchDetails',
        timestamps: false
    });


    return BranchDetails;
};