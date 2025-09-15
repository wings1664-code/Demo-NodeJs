import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';

class Category extends Model {}
Category.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'Category' });

export default Category;