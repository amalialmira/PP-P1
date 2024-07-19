'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.belongsToMany(models.Course, {through : models.UserCourse})
      User.hasMany(models.UserCourse)
    }
    get fullName(){
      return `${this.firstName} ${this.lastName}`
    }
    
    static async searchTitle(id, search){
      let userData
            if (search){
                userData = await User.findByPk(id, {
                    include: {
                        model: sequelize.models.Course,
                        where: {
                            title: {
                                [Op.iLike]: `%${search}%`
                            }
                        },
                        include: sequelize.models.Category,
                    }  
                })
            } else {
                userData = await User.findByPk(id, {
                    include: {
                        model: sequelize.models.Course,
                        include: sequelize.models.Category
                        }
                })
            }
            return userData
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "first name is required"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "last name is required"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "first name is required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "first name is required"
        },
        isEmail: {
          msg: "invalid email input"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: {
          msg: "first name is required"
        },
        len: {
          args: [8],
          msg: 'password minimum length is 8'
        }
      }
    },
    role: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate(instance, option){
        const salt = bcrypt.genSaltSync(5);
        const hash = bcrypt.hashSync(instance.password, salt);

        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });

  return User;
};