module.exports = (sequelize, DataTypes) => {

    console.log("DECIMAL TYPE:", DataTypes.DECIMAL);
    const PodDocument = sequelize.define("LR_Copy", {
        LR_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Consignmentnoteno: DataTypes.INTEGER,
        Sealno: DataTypes.STRING,
        ConsignmentDate: DataTypes.DATEONLY,
        Shipmenttype: DataTypes.STRING,
        TransitMode: DataTypes.STRING,
        Company: DataTypes.STRING,
        PoliceNo: DataTypes.STRING,
        Amount: DataTypes.DECIMAL(10, 2),
        Date: DataTypes.DATEONLY,
        Risk: DataTypes.STRING,
        ConsignornameAdd: DataTypes.STRING,
        ConsigneenameAdd: DataTypes.STRING,
        FromAdd: DataTypes.STRING,
        ToAdd: DataTypes.STRING,
        Containerno: DataTypes.STRING,
        Driverno: DataTypes.STRING,
        Noofpkgspallets: DataTypes.INTEGER,
        CustomerinvoiceNo: DataTypes.STRING,
        Customerinvoice: DataTypes.DATEONLY,
        Natureofgoods: DataTypes.STRING,
        WeightGross: DataTypes.STRING,
        WeightChargeable: DataTypes.STRING,
        FreightPaid: DataTypes.DECIMAL(10, 2),
        FreightToPay: DataTypes.DECIMAL(10, 2),
        SurchargePaid: DataTypes.DECIMAL(10, 2),
        SurchargeToPay: DataTypes.DECIMAL(10, 2),
        CpchPaid: DataTypes.DECIMAL(10, 2),
        CpchToPay: DataTypes.DECIMAL(10, 2),
        StchPaid: DataTypes.DECIMAL(10, 2),
        StchToPay: DataTypes.DECIMAL(10, 2),
        HAMALIchPaid: DataTypes.DECIMAL(10, 2),
        HAMALIchToPay: DataTypes.DECIMAL(10, 2),
        RiskrsPaid: DataTypes.DECIMAL(10, 2),
        RiskrsToPay: DataTypes.DECIMAL(10, 2),
        ServicechPaid: DataTypes.DECIMAL(10, 2),
        ServicechToPay: DataTypes.DECIMAL(10, 2),
        GrandTotalPaid: DataTypes.DECIMAL(10, 2),
        GrandTotalToPay: DataTypes.DECIMAL(10, 2),
        FreightTopayorPaid: DataTypes.STRING,
        Valuers: DataTypes.DECIMAL(10, 2),
        Privatemark: DataTypes.STRING,
        Remarks: DataTypes.STRING,
         pdf_url: DataTypes.STRING,
        BookingNo: { type: String, required: true },
        Ml_CreatedBy:DataTypes.INTEGER
    }, {
        tableName: 'LR_Copy',
        timestamps: false
    });

    return PodDocument;
};
