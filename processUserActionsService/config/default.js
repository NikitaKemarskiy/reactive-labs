'use strict';

module.exports = {
	db: {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    backupIntervalMinutes: 60,
  },
  aws: {
    region: 'eu-central-1',
  }
};
