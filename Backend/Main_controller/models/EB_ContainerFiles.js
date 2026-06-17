module.exports = (sequelize, DataTypes) => {
  const EB_ContainerFiles = sequelize.define('EB_ContainerFiles', {
    CF_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    EB_id: {
      type: DataTypes.INTEGER
    },
    ContainerCopy: {
      type: DataTypes.STRING
    },
    Createdon: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    Modifiedon: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'EB_ContainerFiles',
    timestamps: false
  });

  return EB_ContainerFiles;
};
