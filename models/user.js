'use strict';
// User Model with f/l name, emailAddress and password
const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
  //https://teamtreehouse.com/library/validators-and-custom-error-messages for validation
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: 'A  first name is required'
        },
        notEmpty:{
          mes: 'Please provide a first name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: 'A last name is required'
        },
        notEmpty:{
          msg: 'Please provide last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg: 'A email is required'
        },
        isEmail: {
          msg: 'Please provide valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
      validate: {
          notNull: {
          msg: 'A password is required',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
      },
    },
    
    
  }, { sequelize });

User.associate = (models) => {
// ADD associations 
User.hasMany(models.Course, {foreignKey: {
  fieldName: 'userId',
  allowNull: false,
}})
};

  return User;
};

