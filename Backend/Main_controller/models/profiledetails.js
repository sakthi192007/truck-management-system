module.exports = function (sequelize, DataTypes) {
    const Profiledetails = sequelize.define("UserLoginDetails", {
        User_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Email: {
            type: DataTypes.STRING
        },
        Password: {
            type: DataTypes.STRING
        },
        PhoneNumber: {
            type: DataTypes.STRING
        },
        Address: {
            type: DataTypes.STRING
        },
        User_Roleid: {
            type: DataTypes.INTEGER
        },
        UserName: {
            type: DataTypes.INTEGER 
        },
        Image: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'UserLoginDetails',
        timestamps: false
    });
    return Profiledetails;
};
 