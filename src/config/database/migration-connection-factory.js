/* eslint-disable @typescript-eslint/no-var-requires */
require(`../../../dist/microservice/adapter/helper/extensions/string.extension.js`);
const config = require('../../../dist/config/configuration.js').default();

module.exports = function (collectionName, schemaName = null) {
  schemaName = schemaName ? schemaName : collectionName;
  const mongoose = require('mongoose');
  const schemaCollection = require(`../../../dist/microservice/domain/schemas/${schemaName}.schema`);
  const modelSchema = schemaCollection[`${schemaName.capitalize()}Schema`];
  mongoose.connect(config.database.mongodb.connection);
  return mongoose.model(collectionName, modelSchema);
};
