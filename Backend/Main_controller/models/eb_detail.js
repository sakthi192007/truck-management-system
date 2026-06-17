// models/EB_ItemDetails.js
module.exports = (sequelize, DataTypes) => {
    const EB_ItemDetails = sequelize.define('EB_ItemDetails', {
        LItem_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ContainerTypes: DataTypes.INTEGER,
        containernumber: DataTypes.STRING,
        SealNumber: DataTypes.STRING,
        VendorName: DataTypes.INTEGER,
        Vehicleno: DataTypes.STRING,
        CargoWeight: DataTypes.INTEGER,
        WeightTypes: DataTypes.STRING,
        StuffingLocation: DataTypes.INTEGER,
        EmptyContainerPickup: DataTypes.INTEGER,
        NoofPackage: DataTypes.STRING,
        StuffingLocation2: DataTypes.INTEGER,
        StuffingLocation3: DataTypes.INTEGER,
        StuffingLocation4: DataTypes.INTEGER,
        StuffingLocation5: DataTypes.INTEGER,
        PortofLoading1: DataTypes.INTEGER,
        PortofLoading2: DataTypes.INTEGER,
    }, {
        tableName: 'EB_ItemDetails',
        timestamps: false // set to true if you have createdAt/updatedAt columns
    });

    return EB_ItemDetails;
};
