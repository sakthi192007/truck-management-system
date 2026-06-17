const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const MenuDetails = sequelize.define('SkybT_Menu', {
        Menukey: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        Menutype: DataTypes.INTEGER,
        Menudescription: DataTypes.STRING,
        Menuname: DataTypes.STRING,
        Foldername: DataTypes.STRING,
        Pagename: DataTypes.STRING,
        Menulist: DataTypes.BIGINT,
        Menuicon: DataTypes.STRING,
        Createdby: DataTypes.BIGINT,
        Modifiedby:DataTypes.BIGINT,
        Modifiedon:DataTypes.DATE,
        Parentmenuid:DataTypes.INTEGER,
        SubParentid:DataTypes.INTEGER
    }, {
        tableName: 'SkybT_Menu',
        timestamps: false
    });
    return MenuDetails;
};