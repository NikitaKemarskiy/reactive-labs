import { Sequelize, Dialect } from 'sequelize';
import * as config from 'config';
import * as User from './user';
import * as UserAction from './userAction';

const dbConfig: {
  name: string,
  username: string,
  password: string,
  host: string,
  dialect: Dialect,
  logging: boolean,
// @ts-ignore
} = config.db;

const sequelize = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  minifyAliases: true,
});

async function createBackup() {
  /**
   * Database backup creation logic
   * (create dump, send it to remote
   * server / static files hosting etc.)
   */
  console.log('Create database backup');
}

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
  createBackup,
  sequelize,
  Sequelize,
};
