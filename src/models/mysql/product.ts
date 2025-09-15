import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';
import Category from './category';
import Subcategory from './subcategory';

class Product extends Model {}
Product.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
  subcategoryId: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'Product' });

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.belongsTo(Subcategory, { foreignKey: 'subcategoryId' });

export default Product;