'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

     get status() {
      if (this.CategoryId === 2) {
        return '2 days'
      } else {
        return '5 days'
      }

    }

    isCoveredByInsurance(CategoryId) {

      if (CategoryId === 2) {
        return this.price = `${this.price * 0.8}`
      } else {
        return 'Category is not covered yet'
      }

    }

    static associate(models) {
      // define association here
      Product.belongsTo(models.Category)
      Product.hasMany(models.Order)
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Product Name cannot be empty'
        },
        notNull: {
          args: true,
          msg: 'Product Name cannot be empty'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Description cannot be empty'
        },
        notNull: {
          args: true,
          msg: 'Description cannot be empty'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Price cannot be empty'
        },
        notNull: {
          args: true,
          msg: 'Description cannot be empty'
        },
        moreThanZero(value){
          if(value < 1){
            throw new Error('Price cannot be less than 1')
          }
        }
      }
    },
    CategoryId: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Category cannot be empty'
        },
        notNull: {
          args: true,
          msg: 'Category cannot be empty'
        }

      }
    },
  }, {
    sequelize,
    modelName: 'Product',
  });

  Product.beforeCreate(product => {
    product.qrCode = `localhost:3000/products/${product.name}`
  })
  
  return Product;
};