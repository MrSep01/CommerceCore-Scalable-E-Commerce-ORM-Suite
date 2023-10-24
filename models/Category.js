// Purpose: Sequelize model for Category table in database
const { Model, DataTypes } = require('sequelize');
// Import sequelize connection
const sequelize = require('../config/connection');
// Create Category model
class Category extends Model {}
// Initialize Category model
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Set as primary key
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass in imported sequelize connection
    timestamps: false, // Don't automatically create createdAt/updatedAt timestamp fields
    freezeTableName: true, // Don't pluralize name of database table
    underscored: true, // Use underscores instead of camel-casing (i.e. createdAt instead of createdAt)
    modelName: 'category', // Set model name as lowercase and use underscores instead of camel-casing (i.e. PostTag instead of postTag)
  }
);

module.exports = Category;