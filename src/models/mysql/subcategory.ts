import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';
import Category from './category';

class Subcategory extends Model {}
Subcategory.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'Subcategory' });

Subcategory.belongsTo(Category, { foreignKey: 'categoryId' });

export default Subcategory;