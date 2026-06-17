const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const SubAdminLoginDetails = sequelize.define('SubAdminLoginDetails', {
        SA_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Client_ID: DataTypes.INTEGER,
        Email: DataTypes.STRING,
        Password: DataTypes.STRING,
        User_Roleid: DataTypes.INTEGER,
        UserName: DataTypes.INTEGER,
        PhoneNumber: DataTypes.STRING,
        Address: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.INTEGER,
        GSTNo: DataTypes.STRING,
        PanNumber: DataTypes.STRING,
        PostalCode: DataTypes.STRING,
        City: DataTypes.STRING,
        State: DataTypes.STRING,
        Country: DataTypes.STRING,
        CompanyName: DataTypes.STRING,
        Image : DataTypes.STRING,

    }, {
        tableName: 'SubAdminLoginDetails',
        timestamps: false
    });


    return SubAdminLoginDetails;
};