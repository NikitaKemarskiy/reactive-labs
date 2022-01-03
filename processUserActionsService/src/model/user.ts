import { Model, DataTypes } from 'sequelize';

export function init(sequelize) {
  class User extends Model {
    static associate({
      UserAction,
    }) {
      User.hasMany(UserAction, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'userActions',
      });
    }
  }

  User.init({
    googleAnalyticsUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'user',
  });

  return User;
};
