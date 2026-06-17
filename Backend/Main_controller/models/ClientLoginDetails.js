const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const ClientLoginDetails = sequelize.define('ClientLoginDetails', {
        Client_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        User_ID: DataTypes.INTEGER,
        Email: DataTypes.STRING,
        User_Roleid: DataTypes.INTEGER,
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
        tableName: 'ClientLoginDetails',
        timestamps: false
    });


    return ClientLoginDetails;
};