module.exports = (sequelize, DataTypes) => {
    const IB_ItemDetails = sequelize.define('IB_ItemDetails', {
        LineItem_id: {
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
        ContainerPickupLocation:DataTypes.INTEGER,
        DE_StuffingLocation: DataTypes.INTEGER,
        EmptyReturnAt: DataTypes.INTEGER,
        NoofPackagee: DataTypes.STRING,
        DE_StuffingLocation2: DataTypes.INTEGER,
        DE_StuffingLocation3: DataTypes.INTEGER,
        DE_StuffingLocation4: DataTypes.INTEGER,
        DE_StuffingLocation5: DataTypes.INTEGER,
        PortofDischarge1: DataTypes.INTEGER,
        PortofDischarge2: DataTypes.INTEGER,
    }, {
        tableName: 'IB_ItemDetails',
        timestamps: false // set to true if you have createdAt/updatedAt columns
    });

    return IB_ItemDetails;
};
