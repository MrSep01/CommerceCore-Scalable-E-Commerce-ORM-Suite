// Purpose: Sequelize model for Tag table
const { Model, DataTypes } = require('sequelize');
// Import sequelize connection
const sequelize = require('../config/connection');
// Create Tag model
class Tag extends Model {}
// Initialize Tag model
Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tag_name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag',
  }
);
// Export Tag model
module.exports = Tag;