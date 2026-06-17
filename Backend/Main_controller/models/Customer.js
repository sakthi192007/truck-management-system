module.exports = function(sequelize, DataTypes) {

    const customer = sequelize.define("SKY_registrations", {
        // Define your model attributes here
        // For example:
        registrationkey: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        PhoneNumber: {
            type: DataTypes.STRING
        },
        Password: {
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
    });
    return customer;
}