import { Model, DataTypes } from 'sequelize';

export function init(sequelize) {
  class UserAction extends Model {
    static associate({
      User,
    }) {
      UserAction.belongsTo(User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'user',
      });
    }
  }

  UserAction.init({
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'userAction',
  });

  return UserAction;
};
