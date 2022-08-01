'use strict';
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt') 

module.exports = (sequelize) => {
  class Users extends Sequelize.Model {}
  Users.init({
  //https://teamtreehouse.com/library/validators-and-custom-error-messages for validation
    firstName: {
      type: Sequelize.STRING,
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
      type: Sequelize.STRING,
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
    email: {
      type: Sequelize.STRING,
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
      type: Sequelize.STRING,  
     allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        len: {
          args: [8, 20],
          msg: 'The password should be between 8 and 20 characters in length'
        }
      }
    },
     confirmedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if ( val === this.password ) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('confirmedPassword', hashedPassword);
        }
      },
      validate: {
        notNull: {
          msg: 'Both passwords must match'
        }
      }
    }
    
  }, { sequelize });

Users.associate = (models) => {
// ADD associations 
Users.hasMany(models.Course, {foreignKey: {
  fieldName: 'userId',
  allowNull: false,
}})
};

  return Users;
};