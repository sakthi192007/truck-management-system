const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const LoginDetails = sequelize.define('UserLoginDetails', {
        User_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Email: DataTypes.STRING,
        Password: DataTypes.STRING,
        User_Roleid: DataTypes.INTEGER,
        UserName: DataTypes.INTEGER,
        PhoneNumber: DataTypes.STRING,
        Address: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.INTEGER,
        GSTNo: DataTypes.STRING,
        Clientid: DataTypes.INTEGER,
        PanNumber: DataTypes.STRING,
        PostalCode: DataTypes.STRING,
        City: DataTypes.STRING,
        State: DataTypes.STRING,
        Country: DataTypes.STRING,
        CompanyName: DataTypes.STRING,
        Image : DataTypes.STRING,
        BranchCode: DataTypes.STRING,
        BranchName: DataTypes.STRING,
        SubadminName: DataTypes.STRING,
        UseradminName: DataTypes.STRING,
        ProfileImage: DataTypes.STRING,
        vendorId: DataTypes.INTEGER,
        UserClientId: DataTypes.INTEGER,
        


    }, {
        tableName: 'UserLoginDetails',
        timestamps: false
    });


    return LoginDetails;
};