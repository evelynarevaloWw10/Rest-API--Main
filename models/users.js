// 'use strict';
// const { Model, DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt');

// module.exports = (sequelize) => {
//   class User extends Model {}
//   User.init({
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notNull: {
//           msg: 'A name is required'
//         },
//         notEmpty: {
//           msg: 'Please provide a name'
//         }
//       }
//     },
   
//     password: {
//       type: DataTypes.VIRTUAL,  
//       allowNull: false,
//       validate: {
//         notNull: {
//           msg: 'A password is required'
//         },
//         notEmpty: {
//           msg: 'Please provide a password'
//         },
//         len: {
//           args: [8, 20],
//           msg: 'The password should be between 8 and 20 characters in length'
//         }
//       }
//     },
    
//   }, { sequelize });

//   return User;
// };