module.exports = (sequelize, DataTypes) => {
    const BK_Documentation = sequelize.define("BK_Documentation", {
      BK_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      DocumentName: {
        type: DataTypes.STRING
      },
      FileName: {
        type: DataTypes.STRING
      },
      BK_no: {
        type: DataTypes.STRING
      }
    }, {
      tableName: "BK_Documentation",
      timestamps: false  // Disable if no createdAt/updatedAt in table
    });
  
    return BK_Documentation;
  };
  