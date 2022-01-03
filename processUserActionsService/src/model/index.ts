import { Sequelize, Dialect } from 'sequelize';
import * as config from 'config';
import * as User from './user';
import * as UserAction from './userAction';

const dbConfig: {
  database: string,
  username: string,
  password: string,
  host: string,
  dialect: Dialect,
  logging: boolean,
} = config.get('db');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  minifyAliases: true,
});

const models = {
  User: User.init(sequelize),
  UserAction: UserAction.init(sequelize),
};

Object
  .values(models)
  .filter(({ associate }) => associate)
  .forEach((model) => model.associate(models));

export default {
  ...models,
  sequelize,
  Sequelize,
};
