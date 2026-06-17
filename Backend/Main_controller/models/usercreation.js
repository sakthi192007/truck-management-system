module.exports = function(sequelize, DataTypes) {

    const userdetails = sequelize.define("UserLoginDetails", {
        // Define your model attributes here
        // For example:
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
        Image: {
            type: DataTypes.STRING
        },
        Address: {
            type: DataTypes.STRING
        },
        User_Roleid: {
            type: DataTypes.INTEGER
        },
        UserName: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'createdon',
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'modifiedon',
        }
    }, {
        

        hooks: {
            beforeCreate: (userdetails, options) => {
                {
                    userdetails.Password = userdetails.Password && userdetails.Password != "" ? bcrypt.hashSync(userdetails.Password, 10) : "";
                }
            },
            beforeUpdate: (userdetails, options) => {
                {
                    if (userdetails.Password) {
                        userdetails.Password = userdetails.Password && userdetails.Password != "" ? bcrypt.hashSync(userdetails.Password, 10) : "";
                    }
                }
            }
        }
    });
    return userdetails;

}