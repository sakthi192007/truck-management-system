const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const CompanyDetails = sequelize.define('VendorsCompanyDetails', {
        CD_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        CompanyName: DataTypes.STRING,
        GSTNumber: DataTypes.STRING,
        PANNumber: DataTypes.STRING,
        PhoneNumber: DataTypes.STRING,
        description: DataTypes.STRING,
        otherfile: DataTypes.STRING,
        Zipcode: DataTypes.STRING,
        VendorCode: DataTypes.STRING,
        Email: DataTypes.STRING,
        SEMORMSEM: DataTypes.STRING,
        TINNumber: DataTypes.STRING,
        City: DataTypes.STRING,
        State: DataTypes.STRING,
        Country: DataTypes.STRING,
        OfficeAddress: DataTypes.STRING,
        OfficeAddressLine1: DataTypes.STRING,
        GSTFile: DataTypes.STRING,
        PANUpload: DataTypes.STRING,
        smefle: DataTypes.STRING,
        tinfle: DataTypes.STRING,
        status: DataTypes.INTEGER,
        rocfle: DataTypes.STRING,
        CreatedBy: DataTypes.STRING,
        ModifiedBy: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    }, {
        tableName: 'VendorsCompanyDetails',
        timestamps: false
    });

    return CompanyDetails;
};