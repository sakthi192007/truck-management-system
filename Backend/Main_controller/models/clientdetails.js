const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const clientdetails = sequelize.define('SKY_CreateClients', {
        Client_Id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        FirstName: DataTypes.STRING,
        CompanyName: DataTypes.STRING,
        Department: DataTypes.STRING,
        gst_number: DataTypes.STRING,
        pan_number: DataTypes.STRING,
        msme: DataTypes.STRING,
        otherfile: DataTypes.STRING,
        tin_tan: DataTypes.STRING,
        Email: DataTypes.STRING,
        PhoneNumber: DataTypes.STRING,
        landline: DataTypes.STRING,
        City: DataTypes.STRING,
        State: DataTypes.STRING,
        Country: DataTypes.STRING,
        Zipcode: DataTypes.STRING,
        status: DataTypes.INTEGER,
        CompanyAddress: DataTypes.STRING,
        description: DataTypes.STRING,
        CompanyAddressLine1: DataTypes.STRING,
        GSTfile: DataTypes.STRING,
        PANupload: DataTypes.STRING,
        smefle: DataTypes.STRING,
        tinfle: DataTypes.STRING,
        rocfle: DataTypes.STRING,
        holder_name : DataTypes.STRING,
	bank_account : DataTypes.STRING,
	bank_name : DataTypes.STRING,
	ifsc_code : DataTypes.STRING,
	branch : DataTypes.STRING,
	bank_add : DataTypes.STRING,
	Business : DataTypes.STRING,
        CreatedBy: DataTypes.INTEGER,
        modifiedBy: DataTypes.INTEGER,
    }, {
        tableName: 'SKY_CreateClients',
        timestamps: false
    });

    return clientdetails;
};

