module.exports = (sequelize, DataTypes) =>{
 const Links = sequelize.define("Links", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      originalUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shortUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
 })

 return Links
}