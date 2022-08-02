'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    estimatedTime: {
      type: DataTypes.STRING,
       allowNull: false,
    },
   
    materialsNeeded: {
       type: DataTypes.STRING,
        allowNull: false,
          },

    // userId : {
    //     type: Sequelize.STRING,
    //         allowNull: false,
    //           },
            
        
 
},
  
 { sequelize });

  Course.associate = (models) => {
    // TODO Add associations.
    Course.belongsTo(models.User,{foreignKey: {
    fieldName: 'userId',
    allowNull: false,
      }
   });
  };    

  return Course;
};