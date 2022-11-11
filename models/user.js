'use strict';

const bcryptjs = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    get dateRegister(){
      return this.createdAt.toISOString().slice(0,10)
    }

    static associate(models) {
      // define association here
      User.hasMany(models.Order)
      User.hasOne(models.Profile)
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'This e-mail has been registered'
      },
      validate: {
        notEmpty: true,
        notNull: true,
        isEmail: {
          args: true,
          msg: "e-mail has to be in an email format"
        },
      }
    },
    name: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
        len: {
          args: [8,32],
          msg: "Password length has to be 8 to 32 characters"
        }
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user, options) => {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(user.password, salt)
    user.password = hash;
  });

  return User;
};